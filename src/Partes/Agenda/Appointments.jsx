import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { getDeviceId } from "../ulidades/deviceId";
import { useAuth } from "../ulidades/AuthContext";
import CalendarioMes from "../ulidades/CalendarioMes";
import AuthGate from "./AuthGate";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { IoVideocam, IoStar, IoSparkles } from "react-icons/io5";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const ESTADOS = ["Aprobado", "En proceso", "Finalizado"];

const FILTROS = [
  { key: "todos", label: "Todos", match: null },
  { key: "recibido", label: "Recibido", match: "recib" },
  { key: "aprobado", label: "Aprobado", match: "aprob" },
  { key: "proceso", label: "En proceso", match: "proceso" },
  { key: "completado", label: "Completado", match: "complet" },
  { key: "cancelado", label: "Cancelado", match: "cancel" },
];

// Modos del filtro por fecha. "recientes" (por defecto) = últimos 7 días + futuro.
const FECHA_MODOS = [
  { key: "recientes", label: "Recientes" },
  { key: "dia", label: "Día" },
  { key: "semana", label: "Semana" },
  { key: "mes", label: "Mes" },
  { key: "rango", label: "Rango" },
];

const MS_DIA = 24 * 60 * 60 * 1000;

// Fecha de hoy como 'AAAA-MM-DD'.
function hoyCadena() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

// Parsea 'AAAA-MM-DD' a Date local (inicio del día) o null.
function aFecha(str) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str || ""));
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3]);
}

function inicioDiaMs(str) {
  const d = aFecha(str);
  return d ? d.getTime() : -Infinity;
}
function finDiaMs(str) {
  const d = aFecha(str);
  return d ? d.getTime() + MS_DIA - 1 : Infinity;
}

// Ventana { desdeMs, hastaMs } para el filtro del lado del cliente (defensivo).
function rangoDeModo(modo, ancla, desde, hasta) {
  if (modo === "dia") {
    return { desdeMs: inicioDiaMs(ancla), hastaMs: finDiaMs(ancla) };
  }
  if (modo === "semana") {
    const base = aFecha(ancla) || new Date();
    const offset = (base.getDay() + 6) % 7; // 0 = lunes
    const lunes = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() - offset,
    );
    return { desdeMs: lunes.getTime(), hastaMs: lunes.getTime() + 7 * MS_DIA - 1 };
  }
  if (modo === "mes") {
    const base = aFecha(ancla) || new Date();
    const ini = new Date(base.getFullYear(), base.getMonth(), 1);
    const fin = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    return { desdeMs: ini.getTime(), hastaMs: fin.getTime() + MS_DIA - 1 };
  }
  if (modo === "rango") {
    return {
      desdeMs: desde ? inicioDiaMs(desde) : -Infinity,
      hastaMs: hasta ? finDiaMs(hasta) : Infinity,
    };
  }
  // "recientes": últimos 7 días + todo el futuro.
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return { desdeMs: inicioHoy.getTime() - 7 * MS_DIA, hastaMs: Infinity };
}

// Límites 'AAAA-MM-DD' para la CONSULTA a Firestore. hastaStr=null => sin tope.
function limitesConsulta(modo, ancla, desde, hasta) {
  const iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  if (modo === "dia") return { desdeStr: ancla, hastaStr: ancla };
  if (modo === "semana") {
    const base = aFecha(ancla) || new Date();
    const offset = (base.getDay() + 6) % 7;
    const lunes = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() - offset,
    );
    const dom = new Date(
      lunes.getFullYear(),
      lunes.getMonth(),
      lunes.getDate() + 6,
    );
    return { desdeStr: iso(lunes), hastaStr: iso(dom) };
  }
  if (modo === "mes") {
    const base = aFecha(ancla) || new Date();
    const ini = new Date(base.getFullYear(), base.getMonth(), 1);
    const fin = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    return { desdeStr: iso(ini), hastaStr: iso(fin) };
  }
  if (modo === "rango") return { desdeStr: desde || null, hastaStr: hasta || null };
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 7);
  return { desdeStr: iso(inicio), hastaStr: null };
}

// Texto corto que resume el filtro de fecha activo.
function resumenFiltroFecha(modo, ancla, desde, hasta) {
  const corto = (str) => {
    const d = aFecha(str);
    if (!d) return "—";
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };
  if (modo === "dia") return `Día ${corto(ancla)}`;
  if (modo === "semana") {
    const { desdeMs, hastaMs } = rangoDeModo("semana", ancla);
    const d1 = new Date(desdeMs);
    const d2 = new Date(hastaMs);
    return `Semana ${d1.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })}–${d2.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`;
  }
  if (modo === "mes") {
    const base = aFecha(ancla) || new Date();
    return base.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  }
  if (modo === "rango") return `${corto(desde)} – ${corto(hasta)}`;
  return "Recientes";
}

// Día mínimo seleccionable en el calendario del filtro (permite fechas pasadas).
const MIN_FECHA_FILTRO = new Date(2000, 0, 1);

const Appointments = () => {
  const [citas, setCitas] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeStreams, setActiveStreams] = useState(new Set());
  const [nudgeCita, setNudgeCita] = useState(null);
  const [ratingCita, setRatingCita] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [filtro, setFiltro] = useState("todos");
  // Filtro por fecha. Por defecto "recientes" = últimos 7 días + futuros.
  const [fechaModo, setFechaModo] = useState("recientes");
  const [fechaAncla, setFechaAncla] = useState(() => hoyCadena());
  const [rangoDesde, setRangoDesde] = useState("");
  const [rangoHasta, setRangoHasta] = useState("");
  const [rangoEditando, setRangoEditando] = useState("desde");
  const [cargandoCitas, setCargandoCitas] = useState(true);
  const streamUnsubsRef = useRef({});
  const nudgedRef = useRef(
    new Set(
      (() => {
        try {
          return JSON.parse(localStorage.getItem("sumak_nudged_calif") || "[]");
        } catch {
          return [];
        }
      })(),
    ),
  );
  const deviceId = getDeviceId();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Ventana de consulta (strings 'AAAA-MM-DD'); cambia solo cuando cambia el
  // periodo, no al elegir distintos días dentro del mismo mes/semana.
  const { desdeStr, hastaStr } = user
    ? limitesConsulta(fechaModo, fechaAncla, rangoDesde, rangoHasta)
    : { desdeStr: null, hastaStr: null };

  // Turnos en tiempo real, acotados a la ventana de fecha del filtro. Por
  // defecto trae últimos 7 días + futuros; al cambiar el periodo se re-suscribe.
  // Requiere índice compuesto en Firestore: turnos (uid ASC, fecha ASC).
  useEffect(() => {
    let q;
    if (user) {
      const restricciones = [where("uid", "==", user.uid)];
      if (desdeStr) restricciones.push(where("fecha", ">=", desdeStr));
      if (hastaStr) restricciones.push(where("fecha", "<=", hastaStr));
      q = query(collection(db, "turnos"), ...restricciones);
    } else {
      // Sin sesión (queda tras AuthGate, no se renderiza): sin cambios.
      q = query(collection(db, "turnos"), where("deviceId", "==", deviceId));
    }
    setCargandoCitas(true);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const citasData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCitas(citasData);
        setCargandoCitas(false);
      },
      (e) => {
        console.warn("Error escuchando turnos:", e);
        setCargandoCitas(false);
      },
    );
    return () => unsubscribe();
  }, [deviceId, user, desdeStr, hastaStr]);

  useEffect(() => {
    // Un stream en vivo solo existe mientras el servicio está activo. Nos
    // suscribimos solo a citas NO terminales (ni completadas ni canceladas),
    // evitando abrir listeners de Firestore sobre todo el historial. Esto
    // recorta drásticamente las conexiones y lecturas a escala.
    const esTerminal = (c) => {
      const e = (c.estado || "Aprobado").toLowerCase();
      if (e.includes("complet")) return true;
      if (e.includes("cancel") && !e.includes("proceso")) return true;
      return false;
    };
    const conStream = citas.filter((c) => !esTerminal(c));
    const currentIds = new Set(conStream.map((c) => c.id));
    // Limpiar suscripciones de turnos que ya no aplican (removidos o terminales)
    Object.keys(streamUnsubsRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        streamUnsubsRef.current[id]();
        delete streamUnsubsRef.current[id];
      }
    });
    // Suscribir a streams de los turnos activos nuevos
    conStream.forEach((cita) => {
      if (!streamUnsubsRef.current[cita.id]) {
        streamUnsubsRef.current[cita.id] = onSnapshot(
          doc(db, "streams", cita.id),
          (snap) => {
            setActiveStreams((prev) => {
              const next = new Set(prev);
              if (snap.exists() && snap.data().offer) {
                next.add(cita.id);
              } else {
                next.delete(cita.id);
              }
              return next;
            });
          },
        );
      }
    });
    return () => {
      Object.values(streamUnsubsRef.current).forEach((unsub) => unsub());
      streamUnsubsRef.current = {};
    };
  }, [citas]);

  const estadoEfectivo = (c) => (c.estado || "Aprobado").toLowerCase();
  const esCompletada = (c) => estadoEfectivo(c).includes("complet");
  const enProceso = (c) => estadoEfectivo(c).includes("proceso");
  const yaCalificada = (c) => c.calificacion != null;
  const esRecibido = (c) => estadoEfectivo(c).includes("recib");
  const esCancelado = (c) => {
    const e = estadoEfectivo(c);
    return e.includes("cancel") && !e.includes("proceso");
  };
  const esEnCancelacion = (c) => {
    const e = estadoEfectivo(c);
    return e.includes("cancel") && e.includes("proceso");
  };
  const precioTurno = (c) => {
    const v = c?.cotizacion?.total ?? c?.total ?? c?.precio;
    return typeof v === "number" ? v : Number(v);
  };

  // Detectar cuando una cita pasa a "Completado" (lo actualiza otra app) y
  // avisar una sola vez para que califique.
  useEffect(() => {
    const pendiente = citas.find(
      (c) =>
        esCompletada(c) && !yaCalificada(c) && !nudgedRef.current.has(c.id),
    );
    if (pendiente) {
      nudgedRef.current.add(pendiente.id);
      try {
        localStorage.setItem(
          "sumak_nudged_calif",
          JSON.stringify([...nudgedRef.current]),
        );
      } catch {
        /* ignore */
      }
      setNudgeCita(pendiente);
    }
  }, [citas]);

  // Una fecha elegida en el calendario del filtro: para "rango" alterna entre
  // desde/hasta; para los demás modos es el ancla del periodo.
  const manejarFechaElegida = (str) => {
    if (fechaModo === "rango") {
      if (rangoEditando === "desde") {
        setRangoDesde(str);
        if (rangoHasta && str > rangoHasta) setRangoHasta("");
        setRangoEditando("hasta");
      } else if (rangoDesde && str < rangoDesde) {
        setRangoDesde(str);
        setRangoHasta("");
        setRangoEditando("hasta");
      } else {
        setRangoHasta(str);
      }
      return;
    }
    setFechaAncla(str);
  };

  const restablecerFiltroFecha = () => {
    setFechaModo("recientes");
    setFechaAncla(hoyCadena());
    setRangoDesde("");
    setRangoHasta("");
    setRangoEditando("desde");
  };

  const abrirCalificacion = (cita) => {
    setNudgeCita(null);
    setRatingCita(cita);
    setNota(0);
    setComentario("");
  };

  const enviarCalificacion = async () => {
    if (!ratingCita || nota === 0 || enviando) return;
    setEnviando(true);
    try {
      await updateDoc(doc(db, "turnos", ratingCita.id), {
        calificacion: nota,
        comentario: comentario.trim(),
        calificadoEn: new Date(),
      });
      setRatingCita(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } catch (err) {
      console.error("Error al guardar la calificación:", err);
    } finally {
      setEnviando(false);
    }
  };

  const openModal = (cita) => {
    setSelectedCita(cita);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  };

  const formatFechaHora = (fechaStr, horaStr) => {
    const fecha = new Date(`${fechaStr}T${horaStr}`);
    const opcionesFecha = { weekday: "long", day: "numeric", month: "long" };
    const opcionesHora = { hour: "numeric", minute: "2-digit", hour12: true };
    return {
      fechaFormateada: fecha.toLocaleDateString("es-ES", opcionesFecha),
      horaFormateada: fecha.toLocaleTimeString("es-ES", opcionesHora),
    };
  };

  if (loading) {
    return (
      <section className="appointments-container">
        <p className="empty">Cargando...</p>
      </section>
    );
  }

  if (!user) {
    return <AuthGate />;
  }

  const matchActivo = FILTROS.find((f) => f.key === filtro)?.match ?? null;
  const filtroFechaActivo = fechaModo !== "recientes";
  const hayFiltroActivo = filtroFechaActivo || filtro !== "todos";
  const { desdeMs: ventanaDesde, hastaMs: ventanaHasta } = rangoDeModo(
    fechaModo,
    fechaAncla,
    rangoDesde,
    rangoHasta,
  );

  const tiempoCita = (c) => {
    const t = new Date(`${c.fecha}T${c.hora}`).getTime();
    return Number.isNaN(t) ? Infinity : t;
  };

  const citasOrdenadas = citas
    .filter((c) => {
      const t = tiempoCita(c);
      if (t < ventanaDesde || t > ventanaHasta) return false; // ventana de fecha
      return !matchActivo || estadoEfectivo(c).includes(matchActivo);
    })
    .sort((a, b) => {
      const ca = esCompletada(a);
      const cb = esCompletada(b);
      if (ca !== cb) return ca ? 1 : -1; // completadas al final
      return tiempoCita(a) - tiempoCita(b); // más cercana primero
    });

  return (
    <section className="appointments-container">
      {/* Filtro por fecha (siempre visible: permite consultar periodos pasados
          aunque la ventana actual esté vacía) */}
      <div className="filtros-fecha">
        <div className="filtros-estado filtros-fecha-modos">
          {FECHA_MODOS.map((m) => (
            <button
              key={m.key}
              className={`filtro-chip${fechaModo === m.key ? " activo" : ""}`}
              onClick={() => setFechaModo(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {filtroFechaActivo && (
          <div className="filtro-fecha-panel">
            {(fechaModo === "semana" || fechaModo === "mes") && (
              <p className="filtro-fecha-ayuda">
                Elige cualquier día: se mostrará{" "}
                {fechaModo === "semana" ? "la semana" : "el mes"} de esa fecha.
              </p>
            )}

            {fechaModo === "rango" && (
              <div className="filtro-fecha-rango">
                <button
                  type="button"
                  className={`filtro-rango-campo${
                    rangoEditando === "desde" ? " activo" : ""
                  }`}
                  onClick={() => setRangoEditando("desde")}
                >
                  <span>Desde</span>
                  <strong>{rangoDesde || "—"}</strong>
                </button>
                <button
                  type="button"
                  className={`filtro-rango-campo${
                    rangoEditando === "hasta" ? " activo" : ""
                  }`}
                  onClick={() => setRangoEditando("hasta")}
                >
                  <span>Hasta</span>
                  <strong>{rangoHasta || "—"}</strong>
                </button>
              </div>
            )}

            <CalendarioMes
              value={
                fechaModo === "rango"
                  ? rangoEditando === "desde"
                    ? rangoDesde
                    : rangoHasta
                  : fechaAncla
              }
              onChange={manejarFechaElegida}
              minDate={MIN_FECHA_FILTRO}
            />

            <div className="filtro-fecha-acciones">
              <span className="filtro-fecha-resumen">
                {resumenFiltroFecha(
                  fechaModo,
                  fechaAncla,
                  rangoDesde,
                  rangoHasta,
                )}
              </span>
              <button
                type="button"
                className="filtro-fecha-reset"
                onClick={restablecerFiltroFecha}
              >
                Restablecer
              </button>
            </div>
          </div>
        )}
      </div>

      {citas.length > 0 && (
        <div className="filtros-estado">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              className={`filtro-chip${filtro === f.key ? " activo" : ""}`}
              onClick={() => setFiltro(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {cargandoCitas ? (
          <motion.p
            className="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Cargando...
          </motion.p>
        ) : citasOrdenadas.length === 0 ? (
          <motion.p
            className="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {hayFiltroActivo
              ? "No hay citas en este periodo o estado"
              : "No hay citas registradas"}
          </motion.p>
        ) : (
          <div className="cards-grid">
            {citasOrdenadas.map((cita) => (
              <motion.div
                key={cita.id}
                className={`card${esCompletada(cita) ? " card--completado" : ""}${
                  enProceso(cita) ? " card--proceso" : ""
                }`}
                onClick={() => openModal(cita)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h3 className="cartitli">
                  {cita.cotizacion.servicios?.[0]?.titulo}
                </h3>
                <p className="tcasrservi">
                  <strong>Para:</strong> {cita.nombre} {cita.apellido}
                </p>
                <p className="tcasrservi">
                  <strong>Fecha:</strong> {cita.fecha}
                </p>
                <p className="tcasrservi">
                  <strong>Hora:</strong> {cita.hora}
                </p>
                <p className="estado">
                  <strong>Estado:</strong> {cita.estado || "Aprobado"}
                </p>
                {activeStreams.has(cita.id) && (
                  <button
                    className="btn-live"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/view/${cita.id}`);
                    }}
                  >
                    <IoVideocam /> Ver en vivo
                  </button>
                )}
                {esCompletada(cita) && !yaCalificada(cita) && (
                  <button
                    className="btn-calificar"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirCalificacion(cita);
                    }}
                  >
                    <IoStar /> Calificar el servicio
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {selectedCita && (
          <>
            <motion.div
              className="apt-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCita(null)}
            >
              {showConfetti && (
                <Confetti
                  className="modal-conti"
                  recycle={false}
                  numberOfPieces={400}
                />
              )}
              <motion.div
                className="apt-modal-content"
                initial={{ y: 80, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 80, opacity: 0, scale: 0.85 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="modtulo">
                  {selectedCita.cotizacion.servicios?.[0]?.titulo}
                </h2>

                <div className="modal-info">
                  <p>
                    <strong>Cliente:</strong> {selectedCita.nombre}{" "}
                    {selectedCita.apellido}
                  </p>
                  <p>
                    <strong>Celular:</strong> {selectedCita.celular}
                  </p>
                  <p>
                    <strong>Correo:</strong> {selectedCita.correo}
                  </p>
                </div>

                {(() => {
                  const { fechaFormateada, horaFormateada } = formatFechaHora(
                    selectedCita.fecha,
                    selectedCita.hora,
                  );
                  return (
                    <motion.div
                      className="condats"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="fechahora-titulo">Tu cita programada</h3>
                      <p>
                        <strong>{fechaFormateada}</strong>
                      </p>
                      <p>
                        <strong>{horaFormateada}</strong>
                      </p>
                    </motion.div>
                  );
                })()}

                {esRecibido(selectedCita) ? (
                  <div className="deposito-aviso">
                    <h4>Para aprobar tu turno realiza la transferencia</h4>
                    {Number.isFinite(precioTurno(selectedCita)) && (
                      <p className="deposito-monto">
                        Monto a transferir: ${precioTurno(selectedCita).toFixed(2)}
                      </p>
                    )}
                    <p className="deposito-nota">
                      Envía tu comprobante para agilizar la aprobación.
                    </p>
                  </div>
                ) : esCompletada(selectedCita) ? (
                  <div className="completado-aviso">
                    <h4>
                      Servicio completado <IoSparkles />
                    </h4>
                    <p>¡Gracias por confiar en SUMAK!</p>
                  </div>
                ) : esCancelado(selectedCita) || esEnCancelacion(selectedCita) ? (
                  <div className="cancelado-aviso">
                    <h4>
                      {esEnCancelacion(selectedCita)
                        ? "Cancelación en proceso"
                        : "Este pedido fue cancelado"}
                    </h4>
                    {esEnCancelacion(selectedCita) && (
                      <p>Tu reembolso se procesará en un máximo de 48 horas.</p>
                    )}
                  </div>
                ) : (
                  <div className="qr-section">
                    <h4>Código QR del pedido</h4>
                    <QRCodeCanvas
                      value={selectedCita.id}
                      size={180}
                      bgColor="#fff"
                      fgColor="#2D6A62"
                      includeMargin={true}
                    />
                    <p className="qr-id">ID: {selectedCita.id}</p>
                  </div>
                )}

                {activeStreams.has(selectedCita.id) && (
                  <button
                    className="btn-live"
                    onClick={() => navigate(`/view/${selectedCita.id}`)}
                  >
                    <IoVideocam /> Ver en vivo
                  </button>
                )}
                {esCompletada(selectedCita) && !yaCalificada(selectedCita) && (
                  <button
                    className="btn-calificar"
                    onClick={() => {
                      setSelectedCita(null);
                      abrirCalificacion(selectedCita);
                    }}
                  >
                    <IoStar /> Calificar el servicio
                  </button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Aviso automático: servicio completado */}
      <AnimatePresence>
        {nudgeCita && (
          <motion.div
            className="tm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNudgeCita(null)}
          >
            <motion.div
              className="tm-modal tm-modal--exito"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="tm-modal__title">
                ¡Servicio completado! <IoSparkles />
              </h3>
              <p className="tm-modal__text">
                Por favor califica el servicio cuando puedas.
              </p>
              <button
                className="tm-modal__btn"
                onClick={() => abrirCalificacion(nudgeCita)}
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de calificación */}
      <AnimatePresence>
        {ratingCita && (
          <motion.div
            className="apt-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !enviando && setRatingCita(null)}
          >
            <motion.div
              className="apt-modal-content"
              initial={{ y: 80, opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.85 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 250,
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modtulo">¿Qué tal estuvo tu servicio?</h2>
              <p className="tm-modal__text">Califícalo del 1 al 10</p>

              <div className="calif-nums">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`calif-num${n <= nota ? " activo" : ""}`}
                    onClick={() => setNota(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <textarea
                className="calif-textarea"
                placeholder="Algún detalle extra (opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
              />

              <button
                className="calif-finalizar"
                onClick={enviarCalificacion}
                disabled={nota === 0 || enviando}
              >
                {enviando ? "Enviando..." : "Finalizar"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Appointments;
