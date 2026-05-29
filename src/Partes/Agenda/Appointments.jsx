import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { getDeviceId } from "../ulidades/deviceId";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import Confetti from "react-confetti";

const ESTADOS = ["Aprobado", "En proceso", "Finalizado"];

const Appointments = () => {
  const [citas, setCitas] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const deviceId = getDeviceId();

  useEffect(() => {
    const q = query(collection(db, "turnos"), where("deviceId", "==", deviceId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const citasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCitas(citasData);
    });
    return () => unsubscribe();
  }, [deviceId]);

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

  return (
    <section className="appointments-container">
      <AnimatePresence>
        {citas.length === 0 ? (
          <motion.p className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            No hay citas registradas en este dispositivo.
          </motion.p>
        ) : (
          <div className="cards-grid">
            {citas.map((cita) => (
              <motion.div
                key={cita.id}
                className="card"
                onClick={() => openModal(cita)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h3 className="cartitli">{cita.cotizacion.servicios?.[0]?.titulo}</h3>
                <p className="tcasrservi"><strong>Para:</strong> {cita.nombre} {cita.apellido}</p>
                <p className="tcasrservi"><strong>Fecha:</strong> {cita.fecha}</p>
                <p className="tcasrservi"><strong>Hora:</strong> {cita.hora}</p>
                <p className="estado">
                  <strong>Estado:</strong> {cita.estado || "Aprobado"}
                </p>
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
              {showConfetti && <Confetti className="modal-conti" recycle={false} numberOfPieces={8000} />}
              <motion.div
                className="apt-modal-content"
                initial={{ y: 80, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 80, opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 250, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="modtulo">{selectedCita.cotizacion.servicios?.[0]?.titulo}</h2>

                <div className="modal-info">
                  <p><strong>Cliente:</strong> {selectedCita.nombre} {selectedCita.apellido}</p>
                  <p><strong>Celular:</strong> {selectedCita.celular}</p>
                  <p><strong>Correo:</strong> {selectedCita.correo}</p>
                </div>

                {(() => {
                  const { fechaFormateada, horaFormateada } = formatFechaHora(selectedCita.fecha, selectedCita.hora);
                  return (
                    <motion.div className="condats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <h3 className="fechahora-titulo">Tu cita programada</h3>
                      <p><strong>{fechaFormateada}</strong></p>
                      <p><strong>{horaFormateada}</strong></p>
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

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Appointments;
