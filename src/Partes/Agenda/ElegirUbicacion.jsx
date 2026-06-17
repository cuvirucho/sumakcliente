import React, { useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { db } from "../../Firebase/Firebase";
import { getDeviceId } from "../ulidades/deviceId";
import { useAuth } from "../ulidades/AuthContext";
import { reverseGeocode, buscarDirecciones } from "../ulidades/geocoding";

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

// Centro por defecto: Cuenca, Ecuador
const CENTRO_DEFECTO = { lat: -2.9001, lng: -79.0059 };
const CIUDAD_DEFECTO = "Cuenca";

const generarHoras = () => {
  const horas = [];
  for (let i = 8; i <= 18; i++) {
    horas.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return horas;
};

const SelectorMapa = ({ posicion, onSeleccion }) => {
  useMapEvents({
    click(e) {
      onSeleccion(e.latlng.lat, e.latlng.lng);
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
          onSeleccion(lat, lng);
        },
      }}
    />
  );
};

// Recentra el mapa con una animación suave cuando cambia la posición,
// sin remontar el MapContainer (mapa más dinámico).
const RecenterMapa = ({ posicion }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([posicion.lat, posicion.lng], map.getZoom(), {
      duration: 0.8,
    });
  }, [posicion, map]);
  return null;
};

const ElegirUbicacion = ({ coti }) => {
  const { user, perfil } = useAuth();
  const navigate = useNavigate();

  const [posicion, setPosicion] = useState(CENTRO_DEFECTO);
  const [referencia, setReferencia] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [modo, setModo] = useState(null); // null | "actual" | "mapa"
  const [ciudadUsuario, setCiudadUsuario] = useState(CIUDAD_DEFECTO);
  const [direccionTexto, setDireccionTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [cargandoUbic, setCargandoUbic] = useState(false);

  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const reverseTimer = useRef(null);
  const buscarTimer = useRef(null);

  // Obtiene la ubicación GPS actual como promesa.
  const obtenerGPS = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("sin geolocalización"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });

  // Fija la posición y actualiza la dirección de texto (reverse geocoding con debounce).
  const actualizarPosicion = (lat, lng) => {
    setPosicion({ lat, lng });
    if (reverseTimer.current) clearTimeout(reverseTimer.current);
    reverseTimer.current = setTimeout(async () => {
      const { direccion, ciudad } = await reverseGeocode(lat, lng);
      if (direccion) setDireccionTexto(direccion);
      if (ciudad) setCiudadUsuario(ciudad);
    }, 600);
  };

  // Modo "usar mi ubicación actual": GPS -> centra + resuelve calle + ciudad.
  const usarUbicacionActual = async () => {
    setCargandoUbic(true);
    try {
      const { lat, lng } = await obtenerGPS();
      setPosicion({ lat, lng });
      const { direccion, ciudad } = await reverseGeocode(lat, lng);
      setDireccionTexto(direccion);
      setCiudadUsuario(ciudad || CIUDAD_DEFECTO);
    } catch {
      setPosicion(CENTRO_DEFECTO);
      setCiudadUsuario(CIUDAD_DEFECTO);
      setMensaje(
        "No pudimos obtener tu ubicación. Selecciónala en el mapa, por favor.",
      );
    } finally {
      setCargandoUbic(false);
      setModo("actual");
    }
  };

  // Modo "seleccionar en el mapa": deriva la ciudad del GPS en segundo plano.
  const seleccionarEnMapa = () => {
    setModo("mapa");
    obtenerGPS()
      .then(async ({ lat, lng }) => {
        const { ciudad } = await reverseGeocode(lat, lng);
        if (ciudad) setCiudadUsuario(ciudad);
      })
      .catch(() => setCiudadUsuario(CIUDAD_DEFECTO));
  };

  // Búsqueda de calles acotada a la ciudad del usuario (con debounce).
  const onBuscar = (texto) => {
    setBusqueda(texto);
    if (buscarTimer.current) clearTimeout(buscarTimer.current);
    if (texto.trim().length < 3) {
      setSugerencias([]);
      return;
    }
    buscarTimer.current = setTimeout(async () => {
      const res = await buscarDirecciones(texto, ciudadUsuario);
      setSugerencias(res);
    }, 400);
  };

  const elegirSugerencia = (s) => {
    setPosicion({ lat: s.lat, lng: s.lng });
    setDireccionTexto(s.display_name);
    setBusqueda(s.display_name);
    setSugerencias([]);
  };

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
          direccion: direccionTexto,
          ciudad: ciudadUsuario,
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
            {modo === null
              ? "¿Cómo quieres indicarnos dónde realizaremos el servicio?"
              : "Busca tu calle o toca el mapa para ajustar el punto exacto."}
          </p>

          {modo === null && (
            <div className="ubic-modo">
              <button
                type="button"
                className="ubic-modo-btn"
                onClick={usarUbicacionActual}
                disabled={cargandoUbic}
              >
                <span className="ubic-modo-icon">📍</span>
                {cargandoUbic ? "Localizando..." : "Usar mi ubicación actual"}
              </button>
              <button
                type="button"
                className="ubic-modo-btn"
                onClick={seleccionarEnMapa}
              >
                <span className="ubic-modo-icon">🗺️</span>
                Seleccionar en el mapa
              </button>
            </div>
          )}

          {modo !== null && (
          <form className="tomdatos-form" onSubmit={handleSubmit}>
            <button
              type="button"
              className="ubic-volver"
              onClick={() => {
                setModo(null);
                setSugerencias([]);
              }}
            >
              ← Cambiar método
            </button>

            {modo === "mapa" && (
              <div className="ubic-buscador">
                <input
                  type="text"
                  className="tomdatos-input"
                  placeholder={`Buscar una calle en ${ciudadUsuario}`}
                  value={busqueda}
                  onChange={(e) => onBuscar(e.target.value)}
                  autoComplete="off"
                />
                {sugerencias.length > 0 && (
                  <ul className="ubic-sugerencias">
                    {sugerencias.map((s, i) => (
                      <li
                        key={`${s.lat}-${s.lng}-${i}`}
                        className="ubic-sugerencia"
                        onClick={() => elegirSugerencia(s)}
                      >
                        {s.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mapa-ubicacion">
              <MapContainer
                center={[posicion.lat, posicion.lng]}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMapa posicion={posicion} />
                <SelectorMapa
                  posicion={posicion}
                  onSeleccion={actualizarPosicion}
                />
              </MapContainer>
            </div>

            {direccionTexto && (
              <div className="ubic-direccion">
                <span className="ubic-direccion-label">
                  Ubicación seleccionada
                </span>
                <span className="ubic-direccion-text">{direccionTexto}</span>
              </div>
            )}

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
          )}

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
