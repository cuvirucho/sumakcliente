import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { db } from "../../Firebase/Firebase";
import { getDeviceId } from "../ulidades/deviceId";
import { useAuth } from "../ulidades/AuthContext";

// Arreglo del icono por defecto de Leaflet con bundlers (Vite)
const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Centro por defecto: Quito, Ecuador
const CENTRO_DEFECTO = { lat: -0.1807, lng: -78.4678 };

const generarHoras = () => {
  const horas = [];
  for (let i = 8; i <= 18; i++) {
    horas.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return horas;
};

const SelectorMapa = ({ posicion, setPosicion }) => {
  useMapEvents({
    click(e) {
      setPosicion({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return (
    <Marker
      position={[posicion.lat, posicion.lng]}
      icon={defaultIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          setPosicion({ lat, lng });
        },
      }}
    />
  );
};

const ElegirUbicacion = ({ coti }) => {
  const { user, perfil } = useAuth();
  const navigate = useNavigate();

  const [posicion, setPosicion] = useState(CENTRO_DEFECTO);
  const [referencia, setReferencia] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  // Intentar centrar en la ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosicion({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
      );
    }
  }, []);

  useEffect(() => {
    const cargarFechas = async () => {
      const snapshot = await getDocs(collection(db, "turnos"));
      const fechas = snapshot.docs.map((d) => d.data().fecha);
      setFechasOcupadas([...new Set(fechas)]);
    };
    cargarFechas();
  }, []);

  useEffect(() => {
    const cargarHorarios = async () => {
      if (!fecha) return;
      const q = query(collection(db, "turnos"), where("fecha", "==", fecha));
      const snapshot = await getDocs(q);
      const ocupadas = snapshot.docs.map((d) => d.data().hora);
      setHorariosDisponibles(generarHoras().filter((h) => !ocupadas.includes(h)));
    };
    cargarHorarios();
  }, [fecha]);

  const generarFechasDisponibles = () => {
    const hoy = new Date();
    const fechas = [];
    for (let i = 0; i < 10; i++) {
      const f = new Date();
      f.setDate(hoy.getDate() + i);
      fechas.push(f.toISOString().split("T")[0]);
    }
    return fechas.filter((f) => !fechasOcupadas.includes(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!fecha || !hora) {
      setMensaje("⚠️ Selecciona una fecha y una hora.");
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
        uid: user.uid,
        nombre: perfil?.nombre || "",
        apellido: perfil?.apellido || "",
        celular: perfil?.celular || "",
        correo: perfil?.correo || user.email || "",
        ubicacion: {
          lat: posicion.lat,
          lng: posicion.lng,
          referencia,
        },
        fecha,
        hora,
        deviceId: getDeviceId(),
        estado: "Recibido",
        creadoEn: new Date(),
        cotizacion: coti,
      });

      setModal({
        tipo: "exito",
        texto: `¡Reserva confirmada${
          perfil?.nombre ? ", " + perfil.nombre : ""
        }! nos vemos el ${fecha} a las ${hora}.`,
      });
      localStorage.removeItem("ordenLimpieza");
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
      navigate("/miscitas");
    }
    setModal(null);
  };

  return (
    <>
      <div className="tomdatos-container">
        <div className="tomdatos-card">
          <h2 className="tomdatos-title">Elige tu ubicación</h2>
          <p className="tomdatos-subtitle">
            Toca el mapa o arrastra el marcador para indicar dónde realizaremos
            el servicio.
          </p>

          <form className="tomdatos-form" onSubmit={handleSubmit}>
            <div className="mapa-ubicacion">
              <MapContainer
                center={[posicion.lat, posicion.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                key={`${posicion.lat}-${posicion.lng}`}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <SelectorMapa posicion={posicion} setPosicion={setPosicion} />
              </MapContainer>
            </div>

            <div className="tomdatos-field">
              <label className="tomdatos-label">Referencia / indicaciones</label>
              <input
                type="text"
                className="tomdatos-input"
                placeholder="Ej: edificio azul, timbre 3, junto al parque"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
              />
            </div>

            <div className="tomdatos-field">
              <label className="tomdatos-label">Fecha del servicio</label>
              <select
                className="tomdatos-select"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setHora("");
                }}
              >
                <option value="">Selecciona una fecha</option>
                {generarFechasDisponibles().map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {fecha && (
              <div className="tomdatos-field">
                <label className="tomdatos-label">Hora disponible</label>
                {horariosDisponibles.length > 0 ? (
                  <select
                    className="tomdatos-select"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
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

          {mensaje && <p className="tomdatos-msg warn">{mensaje}</p>}
        </div>
      </div>

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

export default ElegirUbicacion;
