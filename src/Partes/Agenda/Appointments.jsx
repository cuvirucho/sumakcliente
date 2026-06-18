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

  useEffect(() => {
    const q = user
      ? query(collection(db, "turnos"), where("uid", "==", user.uid))
      : query(collection(db, "turnos"), where("deviceId", "==", deviceId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const citasData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setCitas(citasData);
    });
    return () => unsubscribe();
  }, [deviceId, user]);

  useEffect(() => {
    const currentIds = new Set(citas.map((c) => c.id));
    // Limpiar suscripciones de turnos que ya no existen
    Object.keys(streamUnsubsRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        streamUnsubsRef.current[id]();
        delete streamUnsubsRef.current[id];
      }
    });
    // Suscribir a streams de nuevos turnos
    citas.forEach((cita) => {
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

  const tiempoCita = (c) => {
    const t = new Date(`${c.fecha}T${c.hora}`).getTime();
    return Number.isNaN(t) ? Infinity : t;
  };

  const citasOrdenadas = citas
    .filter((c) => !matchActivo || estadoEfectivo(c).includes(matchActivo))
    .sort((a, b) => {
      const ca = esCompletada(a);
      const cb = esCompletada(b);
      if (ca !== cb) return ca ? 1 : -1; // completadas al final
      return tiempoCita(a) - tiempoCita(b); // más cercana primero
    });

  return (
    <section className="appointments-container">
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
        {citas.length === 0 ? (
          <motion.p
            className="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No hay citas registradas
          </motion.p>
        ) : citasOrdenadas.length === 0 ? (
          <motion.p
            className="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No hay citas en este estado
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
                  numberOfPieces={8000}
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
