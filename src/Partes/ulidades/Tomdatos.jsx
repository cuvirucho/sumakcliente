import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDeviceId } from "./deviceId";

const Tomdatos = ({ coti }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    correo: "",
    fecha: "",
    hora: "",
    deviceId: getDeviceId(),
    estado: "aprobado",
  });

  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // { tipo: "exito" | "error" | "turno", texto: "" }

  const navidate = useNavigate();

  const generarHoras = () => {
    const horas = [];
    for (let i = 8; i <= 18; i++) {
      horas.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return horas;
  };

  useEffect(() => {
    const cargarFechas = async () => {
      const snapshot = await getDocs(collection(db, "turnos"));
      const data = snapshot.docs.map((doc) => doc.data());
      const fechas = data.map((t) => t.fecha);
      setFechasOcupadas([...new Set(fechas)]);
    };
    cargarFechas();
  }, []);

  useEffect(() => {
    const cargarHorarios = async () => {
      if (!formData.fecha) return;
      const q = query(
        collection(db, "turnos"),
        where("fecha", "==", formData.fecha),
      );
      const snapshot = await getDocs(q);
      const ocupadas = snapshot.docs.map((doc) => doc.data().hora);
      const todas = generarHoras();
      const libres = todas.filter((h) => !ocupadas.includes(h));
      setHorariosDisponibles(libres);
    };
    cargarHorarios();
  }, [formData.fecha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBorrarCotizacion = () => {
    localStorage.removeItem("ordenLimpieza");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const { nombre, apellido, celular, correo, fecha, hora } = formData;

    if (!nombre || !apellido || !celular) {
      setMensaje("⚠️ Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "turnos"),
        where("fecha", "==", fecha),
        where("hora", "==", hora),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setModal({
          tipo: "turno",
          texto:
            "Ese turno ya fue reservado por otra persona. Por favor elige otra fecha u hora.",
        });
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "turnos"), {
        ...formData,
        creadoEn: new Date(),
        cotizacion: coti,
      });

      setModal({
        tipo: "exito",
        texto: `¡Reserva confirmada, ${nombre}! nos vemos el ${fecha} a las ${hora}.`,
      });
      handleBorrarCotizacion();
      setFormData({
        nombre: "",
        apellido: "",
        celular: "",
        correo: "",
        fecha: "",
        hora: "",
        deviceId: getDeviceId(),
        estado: "aprobado",
      });
      setHorariosDisponibles([]);
    } catch (error) {
      console.error(error);
      setModal({
        tipo: "error",
        texto:
          "Ocurrió un error al registrar tu turno. Por favor inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    if (modal?.tipo === "exito") {
      navidate("/miscitas");
    }
    setModal(null);
  };

  const generarFechasDisponibles = () => {
    const hoy = new Date();
    const fechas = [];
    for (let i = 0; i < 10; i++) {
      const f = new Date();
      f.setDate(hoy.getDate() + i);
      const fechaStr = f.toISOString().split("T")[0];
      fechas.push(fechaStr);
    }
    return fechas.filter((f) => !fechasOcupadas.includes(f));
  };

  return (
    <>
      <div className="tomdatos-container">
        <div className="tomdatos-card">
          <h2 className="tomdatos-title">Completa tus datos</h2>
          <p className="tomdatos-subtitle">
            Agenda tu servicio de limpieza fácil y rápido
          </p>

          <form className="tomdatos-form" onSubmit={handleSubmit}>
            {["nombre", "apellido", "celular", "correo"].map((campo) => (
              <div className="tomdatos-field" key={campo}>
                <label className="tomdatos-label">
                  {campo.charAt(0).toUpperCase() + campo.slice(1)}
                </label>
                <input
                  type={
                    campo === "correo"
                      ? "email"
                      : campo === "celular"
                        ? "tel"
                        : "text"
                  }
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  className="tomdatos-input"
                  placeholder={`Ingrese su ${campo}`}
                />
              </div>
            ))}

            <div className="tomdatos-field">
              <label className="tomdatos-label">Fecha del servicio</label>
              <select
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="tomdatos-select"
              >
                <option value="">Selecciona una fecha</option>
                {generarFechasDisponibles().map((fecha) => (
                  <option key={fecha} value={fecha}>
                    {fecha}
                  </option>
                ))}
              </select>
            </div>

            {formData.fecha && (
              <div className="tomdatos-field">
                <label className="tomdatos-label">Hora disponible</label>
                {horariosDisponibles.length > 0 ? (
                  <select
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="tomdatos-select"
                  >
                    <option value="">Selecciona una hora</option>
                    {horariosDisponibles.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="tomdatos-no-horarios">
                    No hay horarios disponibles este día.
                  </p>
                )}
              </div>
            )}

            <button type="submit" className="tomdatos-btn" disabled={loading}>
              {loading ? "Procesando..." : "Confirmar turno"}
            </button>
          </form>

          {mensaje && (
            <p
              className={`tomdatos-msg ${
                mensaje.includes("⚠️") ? "warn" : "err"
              }`}
            >
              {mensaje}
            </p>
          )}
        </div>
      </div>

      {/* Modal de resultado */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="tm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarModal}
          >
            <motion.div
              className={`tm-modal tm-modal--${modal.tipo}`}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="tm-modal__icon">
                {modal.tipo === "exito" && (
                  <svg viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="26" r="25" strokeWidth="2" />
                    <path
                      d="M14 27l9 9 15-17"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {modal.tipo === "error" && (
                  <svg viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="26" r="25" strokeWidth="2" />
                    <path
                      d="M18 18l16 16M34 18L18 34"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {modal.tipo === "turno" && (
                  <svg viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="26" r="25" strokeWidth="2" />
                    <path
                      d="M26 16v12M26 34v2"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              <h3 className="tm-modal__title">
                {modal.tipo === "exito" && "¡Reserva exitosa!"}
                {modal.tipo === "error" && "Algo salió mal"}
                {modal.tipo === "turno" && "Turno no disponible"}
              </h3>

              <p className="tm-modal__text">{modal.texto}</p>

              <button className="tm-modal__btn" onClick={cerrarModal}>
                {modal.tipo === "exito" ? "Ver mis citas" : "Entendido"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Tomdatos;
