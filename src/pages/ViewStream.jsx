import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
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
];

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
};

export default function ViewStream() {
  const { turnoId } = useParams();
  const [status, setStatus] = useState("waiting");
  const [videoReady, setVideoReady] = useState(false);
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

  // --- WebRTC ---
  useEffect(() => {
    let cancelled = false;
    const streamDocRef = doc(db, "streams", turnoId);

    // Procesa un offer nuevo (de una sesión que aún no hemos atendido) creando
    // una RTCPeerConnection fresca y respondiendo con un answer de esa sesión.
    async function answerOffer(data) {
      const { offer, session } = data;

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

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
        setStatus("live");
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(
            collection(db, "streams", turnoId, "calleeCandidates"),
            event.candidate.toJSON(),
          );
        }
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          setStatus("connecting");
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
        collection(db, "streams", turnoId, "callerCandidates"),
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
      // una sesión nueva escribiendo viewerWants.
      try {
        await updateDoc(streamDocRef, {
          viewerWants: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        });
      } catch (_) {
        // El doc puede no existir todavía (emisor sin iniciar); el snapshot lo maneja.
      }

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
      />

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
                {status === "ended" ? "✓" : "●"}
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
          🔇 Toca para activar el sonido
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
            {muted ? "🔇" : "🔊"}
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
            {isFullscreen ? "⤡" : "⤢"}
          </button>
        </div>
      )}
    </div>
  );
}
