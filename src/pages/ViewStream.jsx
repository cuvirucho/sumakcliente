import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import {
  IoCheckmark,
  IoClose,
  IoEllipse,
  IoVolumeMute,
  IoVolumeHigh,
  IoExpand,
  IoContract,
} from "react-icons/io5";

// TURN configurable por env (debe coincidir con el del emisor). El openrelay
// gratuito limita el ancho de banda y suele dejar el video en negro. Define un
// TURN confiable con VITE_TURN_URLS (varias URLs separadas por comas),
// VITE_TURN_USERNAME y VITE_TURN_CREDENTIAL.
function buildIceServers() {
  const servers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];
  const turnUrls = (import.meta.env.VITE_TURN_URLS || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  const username = import.meta.env.VITE_TURN_USERNAME;
  const credential = import.meta.env.VITE_TURN_CREDENTIAL;
  if (turnUrls.length && username && credential) {
    servers.push({ urls: turnUrls, username, credential });
  } else {
    // Fallback solo para desarrollo: TURN gratuito (no fiable para video en prod).
    servers.push(
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    );
  }
  return servers;
}

const ICE_SERVERS = buildIceServers();

// Forzar relay (solo TURN) para validar el servidor TURN una vez configurado:
// poner VITE_FORCE_RELAY="true" en .env. Debe coincidir con el emisor.
const ICE_TRANSPORT_POLICY =
  import.meta.env.VITE_FORCE_RELAY === "true" ? "relay" : "all";

const STATUS = {
  waiting: {
    title: "Esperando transmisión",
    subtitle: "El equipo aún no ha iniciado el envío en vivo.",
    spinner: true,
  },
  connecting: {
    title: "Conectando",
    subtitle: "Estableciendo conexión con la cámara…",
    spinner: true,
  },
  live: { title: "EN VIVO", subtitle: "", spinner: false },
  ended: {
    title: "Transmisión finalizada",
    subtitle: "El envío en vivo ha terminado. Gracias por acompañarnos.",
    spinner: false,
  },
  error: {
    title: "No se pudo conectar",
    subtitle: "Revisa tu conexión e intenta nuevamente más tarde.",
    spinner: false,
  },
};

// Reintentos acotados con backoff cuando la conexión falla y no se recupera.
const MAX_RECONNECT_ATTEMPTS = 4;
// Primer reintento con margen: el ICE inicial (sobre todo vía TURN) puede tardar
// varios segundos; reintentar demasiado pronto realimentaba el bucle de
// renegociación. Solo se reintenta tras un fallo real (failed/disconnected).
const RECONNECT_DELAYS_MS = [8000, 15000, 30000, 60000];
const DISCONNECT_GRACE_MS = 8000;

// Diagnóstico temporal: tipo de ruta ICE usada y stats del track de video,
// para confirmar si "video negro, audio ok" es por un relay TURN con poco
// ancho de banda u otra causa.
const STATS_LOG_INTERVAL_MS = 5000;
const STATS_LOG_MAX_TICKS = 12;

async function logStreamDiagnostics(pc, label) {
  try {
    const stats = await pc.getStats();
    let pair = null;
    let video = null;
    stats.forEach((report) => {
      if (report.type === "candidate-pair" && report.nominated) {
        const local = stats.get(report.localCandidateId);
        const remote = stats.get(report.remoteCandidateId);
        pair = {
          state: report.state,
          localType: local && local.candidateType,
          remoteType: remote && remote.candidateType,
        };
      }
      if (report.type === "inbound-rtp" && report.kind === "video") {
        video = {
          dir: "in",
          bytesReceived: report.bytesReceived,
          framesReceived: report.framesReceived,
          framesDecoded: report.framesDecoded,
          packetsLost: report.packetsLost,
        };
      }
    });
    console.log("[stream-diag]", label, JSON.stringify({ pair, video }));
  } catch (e) {
    console.log("[stream-diag]", label, "error", e && e.message);
  }
}

export default function ViewStream() {
  const { turnoId } = useParams();
  const [status, setStatus] = useState("waiting");
  const [videoReady, setVideoReady] = useState(false);
  // Resolución real del video recibido (para diagnosticar en el celular sin
  // devtools): 2×2 = encoder colapsado en el emisor; 640×480 = llega bien.
  const [videoDims, setVideoDims] = useState(null);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef(null);
  const pageRef = useRef(null);
  const pcRef = useRef(null);
  const unsubOfferRef = useRef(null);
  const unsubCallerCandRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const handledSessionRef = useRef(null);
  // Último viewerWants que pedimos: solo respondemos el offer que el emisor selló
  // con ESTE valor (servingWants), nunca un offer viejo de otra sesión.
  const myWantsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const disconnectTimerRef = useRef(null);
  const statsIntervalRef = useRef(null);

  // --- WebRTC ---
  useEffect(() => {
    let cancelled = false;
    const streamDocRef = doc(db, "streams", turnoId);

    function clearReconnectTimers() {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (disconnectTimerRef.current) {
        clearTimeout(disconnectTimerRef.current);
        disconnectTimerRef.current = null;
      }
    }

    function clearStatsInterval() {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
        statsIntervalRef.current = null;
      }
    }

    // Inicia el log periódico de diagnóstico de stats una vez conectado.
    function startStatsLogging(pc) {
      clearStatsInterval();
      let ticks = 0;
      statsIntervalRef.current = setInterval(() => {
        if (cancelled || pcRef.current !== pc) {
          clearStatsInterval();
          return;
        }
        ticks += 1;
        logStreamDiagnostics(pc, "viewer-web");
        if (ticks >= STATS_LOG_MAX_TICKS) clearStatsInterval();
      }, STATS_LOG_INTERVAL_MS);
    }

    // Pide al emisor un offer fresco escribiendo viewerWants. Guarda el valor en
    // myWantsRef para luego solo aceptar el offer correlacionado con esta petición.
    async function requestFreshOffer() {
      const wants = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      myWantsRef.current = wants;
      try {
        // setDoc+merge (no updateDoc): así la petición se registra aunque el
        // emisor aún no haya creado el doc (visor abierto antes que el emisor);
        // el emisor la leerá al arrancar y la atenderá.
        await setDoc(streamDocRef, { viewerWants: wants }, { merge: true });
      } catch (_) {}
    }

    // Si la conexión queda en failed/disconnected y no se recupera, reintenta
    // con backoff pidiendo un offer nuevo. Si se agotan los intentos, muestra
    // un estado de error en vez de quedar "Conectando" para siempre.
    function scheduleReconnect(pc) {
      if (cancelled || pcRef.current !== pc) return;
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        setStatus("error");
        return;
      }
      const delay = RECONNECT_DELAYS_MS[reconnectAttemptsRef.current];
      reconnectAttemptsRef.current += 1;
      reconnectTimerRef.current = setTimeout(() => {
        if (cancelled || pcRef.current !== pc) return;
        requestFreshOffer();
      }, delay);
    }

    // Procesa un offer nuevo (de una sesión que aún no hemos atendido) creando
    // una RTCPeerConnection fresca y respondiendo con un answer de esa sesión.
    async function answerOffer(data) {
      const { offer, session } = data;
      clearReconnectTimers();
      clearStatsInterval();

      // Cerrar la conexión / suscripción de la sesión anterior.
      if (unsubCallerCandRef.current) {
        unsubCallerCandRef.current();
        unsubCallerCandRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      setStatus("connecting");
      setVideoReady(false);

      const pc = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceTransportPolicy: ICE_TRANSPORT_POLICY,
      });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (videoRef.current && stream && videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
          // Algunos navegadores (sobre todo móviles) no arrancan el track de
          // video si se añade después de asignar srcObject; forzar play.
          videoRef.current.play?.().catch(() => {});
        }
        setStatus("live");
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          const typ =
            (event.candidate.candidate.match(/ typ (\S+)/) || [])[1];
          console.log("WEB CAND", typ);
          await addDoc(
            collection(
              db,
              "streams",
              turnoId,
              "sessions",
              session,
              "calleeCandidates",
            ),
            event.candidate.toJSON(),
          );
        } else {
          console.log("WEB CAND fin");
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log("WEB ICE", pc.iceConnectionState);
      };

      pc.onconnectionstatechange = () => {
        if (cancelled || pcRef.current !== pc) return;
        console.log("WEB CONN", pc.connectionState);
        if (pc.connectionState === "failed") {
          setStatus("connecting");
          clearReconnectTimers();
          scheduleReconnect(pc);
        } else if (pc.connectionState === "disconnected") {
          setStatus("connecting");
          // 'disconnected' a veces se autorecupera; dar un margen antes de
          // tratarlo como un fallo y reintentar.
          if (!disconnectTimerRef.current) {
            disconnectTimerRef.current = setTimeout(() => {
              disconnectTimerRef.current = null;
              if (cancelled || pcRef.current !== pc) return;
              if (
                pc.connectionState === "disconnected" ||
                pc.connectionState === "failed"
              ) {
                scheduleReconnect(pc);
              }
            }, DISCONNECT_GRACE_MS);
          }
        } else if (pc.connectionState === "connected") {
          reconnectAttemptsRef.current = 0;
          clearReconnectTimers();
          startStatsLogging(pc);
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      if (cancelled) return;
      await updateDoc(streamDocRef, {
        answer: { type: answer.type, sdp: answer.sdp },
        session,
      });

      unsubCallerCandRef.current = onSnapshot(
        collection(
          db,
          "streams",
          turnoId,
          "sessions",
          session,
          "callerCandidates",
        ),
        (candSnap) => {
          candSnap.docChanges().forEach((change) => {
            if (change.type === "added") {
              try {
                pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
              } catch (_) {}
            }
          });
        },
      );
    }

    async function init() {
      // Pedir un offer fresco al emisor: cada montaje (= reconexión) solicita
      // una sesión nueva escribiendo viewerWants (y guardándolo en myWantsRef).
      await requestFreshOffer();

      unsubOfferRef.current = onSnapshot(streamDocRef, async (snap) => {
        if (cancelled) return;
        if (!snap.exists()) {
          setStatus("ended");
          return;
        }

        const data = snap.data();
        if (
          data.offer &&
          data.session &&
          data.servingWants === myWantsRef.current &&
          data.session !== handledSessionRef.current
        ) {
          handledSessionRef.current = data.session;
          await answerOffer(data);
        }
      });
    }

    init();

    return () => {
      cancelled = true;
      clearReconnectTimers();
      clearStatsInterval();
      if (unsubOfferRef.current) unsubOfferRef.current();
      if (unsubCallerCandRef.current) unsubCallerCandRef.current();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [turnoId]);

  // --- Fullscreen tracking ---
  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // --- Auto-hide controls while live ---
  const revealControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (status === "live") setShowControls(false);
    }, 3000);
  }, [status]);

  useEffect(() => {
    if (status === "live") revealControls();
    else setShowControls(true);
    return () => clearTimeout(controlsTimerRef.current);
  }, [status, revealControls]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      pageRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const info = STATUS[status];
  const isLive = status === "live";

  return (
    <div
      ref={pageRef}
      className="view-stream-page"
      onMouseMove={isLive ? revealControls : undefined}
      onClick={isLive ? revealControls : undefined}
    >
      <video
        ref={videoRef}
        className="stream-video"
        autoPlay
        playsInline
        muted={muted}
        onPlaying={() => setVideoReady(true)}
        onWaiting={() => setVideoReady(false)}
        onLoadedMetadata={(e) => {
          const w = e.target.videoWidth;
          const h = e.target.videoHeight;
          console.log("WEB VIDEO", w, "x", h);
          setVideoDims({ w, h });
        }}
        onResize={(e) => {
          const w = e.target.videoWidth;
          const h = e.target.videoHeight;
          console.log("WEB VIDEO RESIZE", w, "x", h);
          setVideoDims({ w, h });
        }}
      />

      {/* Diagnóstico visible: resolución del video recibido. */}
      {isLive && videoDims && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 8,
            zIndex: 10000,
          }}
        >
          {videoDims.w}×{videoDims.h}
        </span>
      )}

      {/* Spinner mientras el video carga los primeros frames (ya conectado) */}
      {isLive && !videoReady && (
        <div className="stream-status-overlay stream-status-overlay--loading">
          <div className="stream-status-card">
            <div className="stream-spinner" aria-hidden="true" />
            <p className="stream-status-msg">Cargando video…</p>
          </div>
        </div>
      )}

      {/* Overlay de estado (no-live) */}
      {!isLive && (
        <div className="stream-status-overlay">
          <div className="stream-status-card">
            {info.spinner ? (
              <div className="stream-spinner" aria-hidden="true" />
            ) : (
              <div className="stream-status-icon" aria-hidden="true">
                {status === "ended" ? (
                  <IoCheckmark />
                ) : status === "error" ? (
                  <IoClose />
                ) : (
                  <IoEllipse />
                )}
              </div>
            )}
            <p className="stream-status-msg">{info.title}</p>
            {info.subtitle && (
              <p className="stream-status-sub">{info.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Badge EN VIVO */}
      {isLive && (
        <span className={`live-badge ${showControls ? "" : "live-badge--dim"}`}>
          <span className="live-dot" />
          EN VIVO
        </span>
      )}

      {/* Botón para reactivar audio cuando está silenciado */}
      {isLive && muted && (
        <button
          type="button"
          className="stream-unmute-cta"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
        >
          <IoVolumeMute /> Toca para activar el sonido
        </button>
      )}

      {/* Controles inferiores */}
      {isLive && (
        <div className={`stream-controls ${showControls ? "" : "stream-controls--hidden"}`}>
          <button
            type="button"
            className="stream-ctrl-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? <IoVolumeMute /> : <IoVolumeHigh />}
          </button>
          <button
            type="button"
            className="stream-ctrl-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <IoContract /> : <IoExpand />}
          </button>
        </div>
      )}
    </div>
  );
}
