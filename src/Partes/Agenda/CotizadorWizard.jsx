import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  IoCheckmark,
  IoAdd,
  IoArrowBack,
  IoArrowForward,
  IoSparklesOutline,
  IoOptionsOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoLocateOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoSearchOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { MdCleaningServices } from "react-icons/md";
import { db, functions } from "../../Firebase/Firebase";
import { getDeviceId } from "../ulidades/deviceId";
import { useAuth } from "../ulidades/AuthContext";
import { useSystemConfig } from "../ulidades/SystemConfigContext";
import { reverseGeocode, buscarDirecciones } from "../ulidades/geocoding";
import CalendarioMes from "../ulidades/CalendarioMes";
import AuthGate from "./AuthGate";
import {
  services,
  extras,
  adicionales,
  tiposLimpieza,
  HORA_INICIO,
  HORA_FIN,
  duracionDeTipo,
  horaANumero,
  lugarDeServicio,
  DIAS_SEMANA,
  bloqueTieneCupo,
} from "../../data/cotizador";

// Ocupación por fecha SIN PII: la calcula la Cloud Function `obtenerDisponibilidad`
// con el Admin SDK. Antes el cliente leía TODOS los turnos de la fecha (incluida
// la PII de otros clientes) solo para derivar la ocupación. Devuelve intervalos
// { inicio, fin, asignadoA }.
async function obtenerIntervalos(fechaStr) {
  const fn = httpsCallable(functions, "obtenerDisponibilidad");
  const { data } = await fn({ fecha: fechaStr });
  return (Array.isArray(data?.intervalos) ? data.intervalos : [])
    .map((i) => ({
      inicio: Number(i?.inicio),
      fin: Number(i?.fin),
      asignadoA: i?.asignadoA ?? null,
    }))
    .filter((i) => Number.isFinite(i.inicio) && Number.isFinite(i.fin));
}

// Arreglo del icono por defecto de Leaflet con bundlers (Vite).
const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Centro por defecto del mapa: Cuenca, Ecuador.
const CENTRO_DEFECTO = { lat: -2.9001, lng: -79.0059 };
const CIUDAD_DEFECTO = "Cuenca";

// Pasos del asistente de agendamiento.
const PASOS = [
  { titulo: "Servicio", Icon: MdCleaningServices },
  { titulo: "Detalles", Icon: IoOptionsOutline },
  { titulo: "Extras", Icon: IoSparklesOutline },
  { titulo: "Fecha", Icon: IoCalendarOutline },
  { titulo: "Ubicación", Icon: IoLocationOutline },
  { titulo: "Resumen", Icon: IoDocumentTextOutline },
];

// Selecciona el punto en el mapa al tocar o arrastrar el marcador.
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

// Recentra el mapa con una animación suave al cambiar la posición.
const RecenterMapa = ({ posicion }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([posicion.lat, posicion.lng], map.getZoom(), { duration: 0.8 });
  }, [posicion, map]);
  return null;
};

const CotizadorWizard = () => {
  const { user, perfil } = useAuth();
  const { flags } = useSystemConfig();
  // Protección de costos: las reservas se pausan en mantenimiento (nivel ≥90).
  const reservasHabilitadas = flags.reservationsEnabled !== false;
  const navigate = useNavigate();

  // ── Estado del cotizador (selección única de servicio) ──────────
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedExtra, setSelectedExtra] = useState(null); // null = Normal
  const [selectedAdicionales, setSelectedAdicionales] = useState([]);
  const [customPrice, setCustomPrice] = useState("");
  const [error, setError] = useState("");

  // ── Fecha / hora ────────────────────────────────────────────────
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // ── Código de descuento ─────────────────────────────────────────
  const [codigoInput, setCodigoInput] = useState("");
  const [codigoAplicado, setCodigoAplicado] = useState(null); // { codigo, porcentaje }
  const [validandoCodigo, setValidandoCodigo] = useState(false);
  const [codigoError, setCodigoError] = useState("");

  // ── Ubicación ───────────────────────────────────────────────────
  const [ubicacion, setUbicacion] = useState(null); // { lat, lng }
  const [referencia, setReferencia] = useState("");
  const [direccionTexto, setDireccionTexto] = useState("");
  const [ciudadUsuario, setCiudadUsuario] = useState(CIUDAD_DEFECTO);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [buscandoDir, setBuscandoDir] = useState(false);
  const [obteniendoUbic, setObteniendoUbic] = useState(false);

  // ── Asistente ───────────────────────────────────────────────────
  const [paso, setPaso] = useState(0);
  const [direccionPaso, setDireccionPaso] = useState(1); // 1 adelante, -1 atrás
  const [guardando, setGuardando] = useState(false);
  const [modal, setModal] = useState(null);

  const reverseTimer = useRef(null);
  const buscarTimer = useRef(null);
  const buscarGenRef = useRef(0);
  const autoUbicIntentada = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Trabajadores (usuarios con trabajador:true) y su horario, para calcular
  // cuántos cupos hay por hora. Cacheado con React Query (stale-while-revalidate):
  // cambian poco, así que se comparten entre montajes y se persisten entre
  // recargas. Si falla o está vacío, se mantiene el fallback (cualquier turno
  // solapado ocupa la hora).
  const { data: trabajadores = [] } = useQuery({
    queryKey: ["trabajadores"],
    queryFn: async () => {
      const q = query(
        collection(db, "usuarios"),
        where("trabajador", "==", true),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({
        uid: d.data().uid ?? d.id,
        horario: d.data().horario || {},
      }));
    },
    staleTime: 30 * 60 * 1000,
  });

  // ── Selección de servicio (única) ──────────────────────────────
  const elegirServicio = (service) => {
    const yaActivo = selectedService?.id === service.id;
    setSelectedService(yaActivo ? null : service);
    setSelectedSize("");
    setSelectedExtra(null);
    setSelectedAdicionales([]);
    setCustomPrice("");
    setError("");
  };

  const elegirTamano = (size) => {
    setSelectedSize(size);
    if (size.toLowerCase().includes("personalizado")) {
      setCustomPrice("");
      setError("Ingrese un precio válido");
    } else {
      setCustomPrice("");
      setError("");
    }
  };

  const cambiarCustomPrice = (value) => {
    const price = parseFloat(value);
    if (isNaN(price) || price <= 0) {
      setError("Ingrese un precio válido mayor que 0");
      setCustomPrice(value);
    } else {
      setError("");
      setCustomPrice(value);
    }
  };

  // Toca el mismo tipo => vuelve a Normal (sin extra).
  const elegirExtra = (extra) => {
    if (selectedExtra?.id === extra?.id) setSelectedExtra(null);
    else setSelectedExtra(extra);
  };

  const toggleAdicional = (ad) => {
    if (selectedAdicionales.some((a) => a.id === ad.id))
      setSelectedAdicionales(selectedAdicionales.filter((a) => a.id !== ad.id));
    else setSelectedAdicionales([...selectedAdicionales, ad]);
  };

  // ── Código de descuento ─────────────────────────────────────────
  const validarCodigo = async () => {
    const valor = codigoInput.trim().toUpperCase();
    if (!valor) return;
    setValidandoCodigo(true);
    setCodigoError("");
    try {
      const q = query(collection(db, "codigos"), where("codigo", "==", valor));
      const snap = await getDocs(q);
      if (snap.empty) {
        setCodigoAplicado(null);
        setCodigoError("Código no válido");
        return;
      }
      const data = snap.docs[0].data();
      const bruto = data.porcentaje || 0;
      const porcentaje = bruto > 1 ? bruto / 100 : bruto;
      if (!porcentaje || porcentaje <= 0) {
        setCodigoAplicado(null);
        setCodigoError("Código no válido");
        return;
      }
      // Uso único por usuario: si el uid ya está en `usos`, se rechaza.
      const usos = Array.isArray(data.usos) ? data.usos : [];
      if (user?.uid && usos.includes(user.uid)) {
        setCodigoAplicado(null);
        setCodigoError("Ya usaste este código.");
        return;
      }
      setCodigoAplicado({ codigo: valor, porcentaje, docId: snap.docs[0].id });
    } catch (e) {
      console.warn("Error validando código:", e);
      setCodigoError("No se pudo validar el código. Intenta de nuevo.");
    } finally {
      setValidandoCodigo(false);
    }
  };

  const quitarCodigo = () => {
    setCodigoAplicado(null);
    setCodigoInput("");
    setCodigoError("");
  };

  // ── Cálculos ────────────────────────────────────────────────────
  const calcularPrecioServicio = () => {
    if (!selectedService || !selectedSize) return 0;
    let price =
      selectedService.Precios.find((p) => p.size === selectedSize)?.price ?? 0;
    if (selectedSize.toLowerCase().includes("personalizado")) {
      price = parseFloat(customPrice) || 0;
    }
    if (typeof price !== "number") price = 0;
    if (selectedExtra) price += price * selectedExtra.percentage;
    return price;
  };

  const calcularSubtotal = () => {
    let subtotal = calcularPrecioServicio();
    subtotal += selectedAdicionales.reduce((sum, ad) => sum + ad.price, 0);
    return subtotal;
  };

  const calcularDescuento = () => {
    let descuento = 0;
    const subtotal = calcularSubtotal();
    if (
      selectedSize?.toLowerCase().includes("grande") &&
      selectedExtra?.name === "Profunda VIP"
    ) {
      descuento += subtotal * 0.05;
    }
    if (codigoAplicado) descuento += subtotal * codigoAplicado.porcentaje;
    return descuento;
  };

  const precioFinal = calcularSubtotal() - calcularDescuento();

  const sizeValido =
    !!selectedSize &&
    (!selectedSize.toLowerCase().includes("personalizado") ||
      parseFloat(customPrice) > 0);

  // Adicionales filtrados por el lugar del servicio elegido.
  const lugar = lugarDeServicio(selectedService?.title);
  const adicionalesFiltrados = adicionales.filter(
    (ad) => lugar && ad.apto.includes(lugar),
  );

  // Tipo de limpieza seleccionado (para "incluye" en el resumen).
  const tipoNombre = selectedExtra?.name || "Normal";
  const tipoLimpieza = tiposLimpieza.find((t) => t.name === tipoNombre);

  // ── Ubicación ───────────────────────────────────────────────────
  const posicionMapa = ubicacion || CENTRO_DEFECTO;

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

  // Fija la posición y resuelve la calle (reverse geocoding con debounce).
  const actualizarPosicion = (lat, lng) => {
    setUbicacion({ lat, lng });
    if (reverseTimer.current) clearTimeout(reverseTimer.current);
    reverseTimer.current = setTimeout(async () => {
      const { direccion, ciudad } = await reverseGeocode(lat, lng);
      if (direccion) setDireccionTexto(direccion);
      if (ciudad) setCiudadUsuario(ciudad);
    }, 600);
  };

  const usarMiUbicacion = async () => {
    setObteniendoUbic(true);
    try {
      const { lat, lng } = await obtenerGPS();
      setUbicacion({ lat, lng });
      const { direccion, ciudad } = await reverseGeocode(lat, lng);
      if (direccion) setDireccionTexto(direccion);
      if (ciudad) setCiudadUsuario(ciudad || CIUDAD_DEFECTO);
    } catch {
      setModal({
        tipo: "error",
        texto:
          "No pudimos obtener tu ubicación. Selecciónala tocando el mapa, por favor.",
      });
    } finally {
      setObteniendoUbic(false);
    }
  };

  // Auto-centra en la ubicación del usuario al entrar al paso (una vez).
  useEffect(() => {
    if (paso === 4 && !ubicacion && !autoUbicIntentada.current) {
      autoUbicIntentada.current = true;
      usarMiUbicacion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  // Buscador de direcciones con debounce + guarda de generación (descarta
  // respuestas viejas) y sesgo de proximidad a la ubicación actual.
  const onBuscar = (texto) => {
    setBusqueda(texto);
    if (buscarTimer.current) clearTimeout(buscarTimer.current);
    const gen = ++buscarGenRef.current;
    if (texto.trim().length < 3) {
      setSugerencias([]);
      setBuscandoDir(false);
      return;
    }
    setBuscandoDir(true);
    buscarTimer.current = setTimeout(async () => {
      const res = await buscarDirecciones(texto, {
        lat: ubicacion?.lat,
        lng: ubicacion?.lng,
        ciudad: ciudadUsuario,
      });
      if (buscarGenRef.current !== gen) return; // respuesta vieja: descartar
      setSugerencias(res);
      setBuscandoDir(false);
    }, 600);
  };

  const elegirSugerencia = (s) => {
    setUbicacion({ lat: s.lat, lng: s.lng });
    setDireccionTexto(s.display_name);
    if (s.ciudad) setCiudadUsuario(s.ciudad);
    setBusqueda("");
    setSugerencias([]);
    setBuscandoDir(false);
  };

  const limpiarBusqueda = () => {
    buscarGenRef.current += 1; // invalida respuestas en vuelo
    setBusqueda("");
    setSugerencias([]);
    setBuscandoDir(false);
  };

  const onBusquedaKeyDown = (e) => {
    if (e.key === "Enter" && sugerencias.length > 0) {
      e.preventDefault();
      elegirSugerencia(sugerencias[0]);
    } else if (e.key === "Escape") {
      limpiarBusqueda();
    }
  };

  // ── Disponibilidad de horas (según duración del servicio) ────────
  const duracionActual = duracionDeTipo(tipoNombre);
  const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha.trim());

  // Al cambiar la fecha se descarta la hora elegida (podría ya no estar libre).
  useEffect(() => {
    setHora("");
  }, [fecha]);

  // Ocupación de la fecha elegida para MOSTRAR las horas libres. Cacheada por
  // fecha (staleTime corto): evita re-consultar la CF al navegar entre pasos.
  // Solo se pide al llegar al paso 3 con una fecha válida. La verificación final
  // en `guardarCita` hace su propia lectura fresca (sin caché) para exactitud.
  const { data: horasOcupadas = [], isLoading: cargandoHoras } = useQuery({
    queryKey: ["disponibilidad", fecha.trim()],
    queryFn: () => obtenerIntervalos(fecha.trim()),
    // No consultar la CF si las reservas están deshabilitadas (respondería 503).
    enabled: paso === 3 && fechaValida && reservasHabilitadas,
    staleTime: 30 * 1000,
  });

  // Bloques de inicio libres: caben en la jornada y queda al menos un
  // trabajador capaz de cubrir el turno (según su horario y sin otro turno
  // asignado). Sin datos de trabajadores, cualquier turno solapado ocupa.
  const horasDisponibles = [];
  // Con reservas deshabilitadas no se ofrecen horarios (la ocupación vacía haría
  // aparecer TODOS los bloques como libres — justo lo que hay que evitar).
  if (fechaValida && reservasHabilitadas) {
    const ahora = new Date();
    const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(ahora.getDate()).padStart(2, "0")}`;
    const esHoy = fecha.trim() === hoy;
    const ahoraDecimal = ahora.getHours() + ahora.getMinutes() / 60;
    // Día de semana (local) de la fecha elegida, mapeado a las claves del horario.
    const [yy, mm, dd] = fecha.trim().split("-").map(Number);
    const diaKey = DIAS_SEMANA[new Date(yy, mm - 1, dd).getDay()];
    for (let s = HORA_INICIO; s + duracionActual <= HORA_FIN; s++) {
      if (esHoy && s <= ahoraDecimal) continue;
      const fin = s + duracionActual;
      const hayCupo = bloqueTieneCupo({
        inicio: s,
        dur: duracionActual,
        diaKey,
        ocupadas: horasOcupadas,
        trabajadores,
      });
      if (hayCupo) {
        horasDisponibles.push({
          valor: `${String(s).padStart(2, "0")}:00`,
          etiqueta: `${String(s).padStart(2, "0")}:00–${String(fin).padStart(
            2,
            "0",
          )}:00`,
        });
      }
    }
  }

  // ── Navegación entre pasos ──────────────────────────────────────
  const puedeAvanzar = (() => {
    switch (paso) {
      case 0:
        return !!selectedService;
      case 1:
        return sizeValido && !error;
      case 3:
        return !!fecha.trim() && !!hora;
      default:
        return true;
    }
  })();

  const avanzar = () => {
    setDireccionPaso(1);
    setPaso((p) => Math.min(p + 1, PASOS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const retroceder = () => {
    setDireccionPaso(-1);
    setPaso((p) => Math.max(p - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Guardar turno ───────────────────────────────────────────────
  const guardarCita = async () => {
    // Protección de costos: durante el mantenimiento (nivel ≥90) no se aceptan
    // reservas nuevas. Cortamos antes de leer la CF o escribir en Firestore.
    if (!reservasHabilitadas) {
      setModal({
        tipo: "mantenimiento",
        texto:
          "Estamos realizando un mantenimiento temporal y las reservas están pausadas. Vuelve a intentarlo en unos minutos.",
      });
      return;
    }
    if (!selectedService || !sizeValido || error) {
      setModal({
        tipo: "error",
        texto: "Selecciona un servicio con su tamaño y un precio válido.",
      });
      return;
    }
    if (!fecha.trim() || !hora.trim()) {
      setModal({ tipo: "error", texto: "Selecciona la fecha y la hora." });
      return;
    }
    setGuardando(true);
    try {
      // Verifica que el bloque siga con cupo (otro pudo reservarlo), usando la
      // misma lógica de capacidad que mostró las horas disponibles. La ocupación
      // la entrega la CF (sin leer la PII de los turnos ajenos).
      const inicioSel = horaANumero(hora);
      const ocupadas = await obtenerIntervalos(fecha.trim());
      const [yy, mm, dd] = fecha.trim().split("-").map(Number);
      const diaKey = DIAS_SEMANA[new Date(yy, mm - 1, dd).getDay()];
      const ocupado = !bloqueTieneCupo({
        inicio: inicioSel,
        dur: duracionActual,
        diaKey,
        ocupadas,
        trabajadores,
      });
      if (ocupado) {
        setModal({
          tipo: "turno",
          texto:
            "Ese horario acaba de ocuparse. Por favor elige otra fecha u hora.",
        });
        setGuardando(false);
        return;
      }

      await addDoc(collection(db, "turnos"), {
        uid: user.uid,
        nombre: perfil?.nombre || "",
        apellido: perfil?.apellido || "",
        celular: perfil?.celular || "",
        correo: perfil?.correo || user.email || "",
        duracionEstimada: duracionActual,
        cotizacion: {
          id: `${Date.now()}`,
          servicios: [
            {
              id: selectedService.id,
              titulo: selectedService.title,
              tamaño: selectedSize,
              tipoLimpieza: tipoNombre,
              precioPersonalizado: selectedSize
                .toLowerCase()
                .includes("personalizado")
                ? parseFloat(customPrice) || null
                : null,
            },
          ],
          adicionales: selectedAdicionales.map((a) => ({
            id: a.id,
            name: a.name,
            price: a.price,
          })),
          subtotal: calcularSubtotal(),
          descuento: calcularDescuento(),
          total: precioFinal,
          codigoDescuento: codigoAplicado?.codigo ?? null,
        },
        fecha: fecha.trim(),
        hora: hora.trim(),
        ubicacion: {
          lat: ubicacion?.lat ?? null,
          lng: ubicacion?.lng ?? null,
          referencia: referencia.trim(),
          direccion: direccionTexto,
          ciudad: ciudadUsuario,
        },
        deviceId: getDeviceId(),
        estado: "Recibido",
        creadoEn: serverTimestamp(),
      });

      // Registrar que este usuario ya usó el código (uso único por usuario).
      // Best-effort: un fallo aquí no debe afectar la reserva ya creada.
      if (codigoAplicado?.docId && user?.uid) {
        try {
          await updateDoc(doc(db, "codigos", codigoAplicado.docId), {
            usos: arrayUnion(user.uid),
          });
        } catch (e) {
          console.warn("No se pudo registrar el uso del código:", e);
        }
      }

      setModal({
        tipo: "exito",
        texto: `¡Reserva Recibida${
          perfil?.nombre ? ", " + perfil.nombre : ""
        }! para ${fecha} a las ${hora}.
        realiza el pago para confirmar tu turno.
        `,
      });
    } catch (e) {
      console.error(e);
      setModal({
        tipo: "error",
        texto: "Ocurrió un error al registrar tu turno. Inténtalo de nuevo.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const cerrarModal = () => {
    if (modal?.tipo === "exito") navigate("/miscitas");
    setModal(null);
  };

  const variantes = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -28 : 28 }),
  };

  return (
    <div className="wiz-container">
      <div className="wiz-card">
        {/* Cabecera con progreso */}
        <div className="wiz-header">
          <div className="wiz-header-top">
            <div>
              <span className="wiz-overline">
                PASO {paso + 1} DE {PASOS.length}
              </span>
              <h2 className="wiz-titulo">{PASOS[paso].titulo}</h2>
            </div>
          </div>

          <div className="wiz-progress-track">
            <motion.div
              className="wiz-progress-fill"
              initial={false}
              animate={{ width: `${((paso + 1) / PASOS.length) * 100}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          <div className="wiz-dots">
            {PASOS.map((p, i) => (
              <div
                key={p.titulo}
                className={`wiz-dot${i === paso ? " activo" : ""}${
                  i < paso ? " hecho" : ""
                }`}
              >
                <span>{i < paso ? <IoCheckmark /> : <p.Icon />}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido animado por paso */}
        <div className="wiz-body">
          <AnimatePresence mode="wait" custom={direccionPaso}>
            <motion.div
              key={paso}
              custom={direccionPaso}
              variants={variantes}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {/* ── Paso 0: Servicio ── */}
              {paso === 0 && (
                <>
                  <h3 className="wiz-seccion">¿Qué deseas limpiar?</h3>
                  <p className="wiz-ayuda">
                    Elige el servicio que deseas agendar.
                  </p>
                  <div className="wiz-servicios">
                    {services.map((service) => {
                      const activo = selectedService?.id === service.id;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          className={`wiz-servicio-card${activo ? " activo" : ""}`}
                          onClick={() => elegirServicio(service)}
                        >
                          <div className="wiz-servicio-top">
                            <span className="wiz-servicio-title">
                              {service.title}
                            </span>
                            <span className={`wiz-check${activo ? " on" : ""}`}>
                              {activo ? <IoCheckmark /> : <IoAdd />}
                            </span>
                          </div>
                          <span className="wiz-servicio-desc">
                            {service.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ── Paso 1: Detalles ── */}
              {paso === 1 && selectedService && (
                <div className="wiz-config">
                  <h3 className="wiz-seccion">{selectedService.title}</h3>

                  <label className="wiz-label">Tamaño</label>
                  <div className="wiz-chips">
                    {selectedService.Precios.map((p) => {
                      const sel = selectedSize === p.size;
                      const precioMostrado =
                        typeof p.price === "number"
                          ? Math.round(
                              p.price * (1 + (selectedExtra?.percentage || 0)),
                            )
                          : null;
                      return (
                        <button
                          key={p.size}
                          type="button"
                          className={`wiz-chip${sel ? " sel" : ""}`}
                          onClick={() => elegirTamano(p.size)}
                        >
                          {p.size}
                          {precioMostrado != null
                            ? ` · $${precioMostrado}`
                            : ""}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSize.toLowerCase().includes("personalizado") && (
                    <>
                      <input
                        type="number"
                        className="wiz-input"
                        placeholder="Ingresa el precio personalizado"
                        value={customPrice}
                        onChange={(e) => cambiarCustomPrice(e.target.value)}
                      />
                      {error && <p className="wiz-error">{error}</p>}
                    </>
                  )}

                  <label className="wiz-label">Tipo de limpieza</label>
                  <div className="wiz-chips">
                    <button
                      type="button"
                      className={`wiz-chip${!selectedExtra ? " sel" : ""}`}
                      onClick={() => setSelectedExtra(null)}
                    >
                      Normal
                    </button>
                    {extras.map((ex) => {
                      const sel = selectedExtra?.id === ex.id;
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          className={`wiz-chip${sel ? " sel" : ""}`}
                          onClick={() => elegirExtra(ex)}
                        >
                          {ex.name}
                        </button>
                      );
                    })}
                  </div>

                  {tipoLimpieza && (
                    <div className="wiz-incluye">
                      <p className="wiz-incluye-label">Incluye</p>
                      <ul>
                        {tipoLimpieza.incluye.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ── Paso 2: Extras ── */}
              {paso === 2 &&
                (adicionalesFiltrados.length > 0 ? (
                  <>
                    <h3 className="wiz-seccion">Servicios adicionales</h3>
                    <p className="wiz-ayuda">
                      Dale un plus a tu limpieza (opcional).
                    </p>
                    <div className="wiz-adicionales">
                      {adicionalesFiltrados.map((ad) => {
                        const sel = selectedAdicionales.some(
                          (a) => a.id === ad.id,
                        );
                        return (
                          <button
                            key={ad.id}
                            type="button"
                            className={`wiz-adicional${sel ? " activo" : ""}`}
                            onClick={() => toggleAdicional(ad)}
                          >
                            <span className="wiz-adicional-nombre">
                              {ad.name}
                            </span>
                            <span className="wiz-adicional-precio">
                              +${ad.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="wiz-vacio">
                    <span className="wiz-vacio-icono">
                      <IoSparklesOutline />
                    </span>
                    <p>
                      No hay servicios adicionales para tu selección. ¡Continúa!
                    </p>
                  </div>
                ))}

              {/* ── Paso 3: Fecha y hora ── */}
              {paso === 3 && (
                <>
                  <h3 className="wiz-seccion">¿Cuándo te visitamos?</h3>
                  <p className="wiz-ayuda">
                    Elige el día y la hora que prefieras.
                  </p>

                  <label className="wiz-label">Fecha</label>
                  <CalendarioMes value={fecha} onChange={setFecha} />

                  <label className="wiz-label">Hora</label>
                  <p className="wiz-ayuda">
                    Duración estimada del servicio: ~{duracionActual}h.
                  </p>
                  {!fechaValida ? (
                    <p className="wiz-ayuda">Elige primero una fecha.</p>
                  ) : cargandoHoras ? (
                    <p className="wiz-ayuda">Cargando horarios…</p>
                  ) : horasDisponibles.length === 0 ? (
                    <p className="wiz-ayuda">
                      No hay horarios disponibles ese día.
                    </p>
                  ) : (
                    <div className="wiz-chips">
                      {horasDisponibles.map((h) => {
                        const sel = hora === h.valor;
                        return (
                          <button
                            key={h.valor}
                            type="button"
                            className={`wiz-chip${sel ? " sel" : ""}`}
                            onClick={() => setHora(h.valor)}
                          >
                            {h.etiqueta}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* ── Paso 4: Ubicación ── */}
              {paso === 4 && (
                <>
                  <h3 className="wiz-seccion">¿Dónde es el servicio?</h3>
                  <p className="wiz-ayuda">
                    Busca tu calle, o toca/arrastra el marcador en el mapa.
                  </p>

                  <div className="wiz-buscador">
                    <div className="wiz-buscador-campo">
                      <IoSearchOutline className="wiz-buscador-icono" />
                      <input
                        type="text"
                        className="wiz-input wiz-buscador-input"
                        placeholder={`Buscar una calle en ${ciudadUsuario}`}
                        value={busqueda}
                        onChange={(e) => onBuscar(e.target.value)}
                        onKeyDown={onBusquedaKeyDown}
                        autoComplete="off"
                      />
                      {busqueda && (
                        <button
                          type="button"
                          className="wiz-buscador-limpiar"
                          onClick={limpiarBusqueda}
                          aria-label="Limpiar búsqueda"
                        >
                          <IoCloseOutline />
                        </button>
                      )}
                    </div>
                    {sugerencias.length > 0 && (
                      <ul className="wiz-sugerencias">
                        {sugerencias.map((s, i) => {
                          const [principal, ...resto] =
                            s.display_name.split(", ");
                          return (
                            <li
                              key={`${s.lat}-${s.lng}-${i}`}
                              className="wiz-sugerencia"
                              onClick={() => elegirSugerencia(s)}
                            >
                              <IoLocationOutline className="wiz-sugerencia-icono" />
                              <span className="wiz-sugerencia-texto">
                                <span className="wiz-sugerencia-principal">
                                  {principal}
                                </span>
                                {resto.length > 0 && (
                                  <span className="wiz-sugerencia-secundaria">
                                    {resto.join(", ")}
                                  </span>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {buscandoDir && sugerencias.length === 0 && (
                      <div className="wiz-sugerencias">
                        <div className="wiz-buscando">Buscando…</div>
                      </div>
                    )}
                    {!buscandoDir &&
                      sugerencias.length === 0 &&
                      busqueda.trim().length >= 3 && (
                        <div className="wiz-sugerencias">
                          <div className="wiz-buscando">Sin resultados</div>
                        </div>
                      )}
                  </div>

                  <div className="wiz-mapa">
                    <MapContainer
                      center={[posicionMapa.lat, posicionMapa.lng]}
                      zoom={16}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap &copy; CARTO"
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                        subdomains="abcd"
                        maxZoom={20}
                      />
                      <RecenterMapa posicion={posicionMapa} />
                      <SelectorMapa
                        posicion={posicionMapa}
                        onSeleccion={actualizarPosicion}
                      />
                    </MapContainer>
                    <span className="wiz-mapa-hint">
                      Toca el mapa o arrastra el pin para ajustar
                    </span>
                    <button
                      type="button"
                      className="wiz-mapa-fab"
                      onClick={(e) => {
                        e.stopPropagation();
                        usarMiUbicacion();
                      }}
                      disabled={obteniendoUbic}
                    >
                      <IoLocateOutline />{" "}
                      {obteniendoUbic ? "Localizando…" : "Mi ubicación"}
                    </button>
                  </div>

                  {direccionTexto && (
                    <div className="wiz-direccion">
                      <span className="wiz-direccion-label">
                        <IoLocationOutline /> Ubicación seleccionada
                      </span>
                      <span className="wiz-direccion-text">
                        {direccionTexto}
                      </span>
                    </div>
                  )}

                  <label className="wiz-label">Referencia / indicaciones</label>
                  <input
                    type="text"
                    className="wiz-input"
                    placeholder="Ej: edificio azul, timbre 3, junto al parque"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                  />
                </>
              )}

              {/* ── Paso 5: Resumen ── */}
              {paso === 5 && (
                <>
                  <h3 className="wiz-seccion">Resumen de tu servicio</h3>

                  <div className="wiz-resumen-card">
                    {fecha && hora && (
                      <p>
                        <strong>Fecha y hora:</strong> {fecha} · {hora}
                      </p>
                    )}
                    <p>
                      <strong>Servicio:</strong> {selectedService?.title}
                    </p>
                    <p>
                      <strong>Tamaño:</strong> {selectedSize}
                    </p>
                    <p>
                      <strong>Tipo de limpieza:</strong> {tipoNombre}
                    </p>
                    {selectedSize.toLowerCase().includes("personalizado") && (
                      <p>
                        <strong>Precio personalizado:</strong> ${customPrice}
                      </p>
                    )}
                    {tipoLimpieza && (
                      <div className="wiz-incluye">
                        <p className="wiz-incluye-label">Incluye</p>
                        <ul>
                          {tipoLimpieza.incluye.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedAdicionales.length > 0 && (
                      <p>
                        <strong>Adicionales:</strong>{" "}
                        {selectedAdicionales.map((a) => a.name).join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Código de descuento */}
                  <label className="wiz-label">Código de descuento</label>
                  {codigoAplicado ? (
                    <div className="wiz-codigo-aplicado">
                      <span>
                        <IoCheckmarkCircle /> {codigoAplicado.codigo} (−
                        {Math.round(codigoAplicado.porcentaje * 100)}%)
                      </span>
                      <button
                        type="button"
                        className="wiz-codigo-quitar"
                        onClick={quitarCodigo}
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <div className="wiz-codigo-row">
                      <input
                        type="text"
                        className="wiz-input"
                        placeholder="Ingresa tu código"
                        value={codigoInput}
                        onChange={(e) => setCodigoInput(e.target.value)}
                      />
                      <button
                        type="button"
                        className="wiz-codigo-btn"
                        onClick={validarCodigo}
                        disabled={validandoCodigo || !codigoInput.trim()}
                      >
                        {validandoCodigo ? "…" : "Aplicar"}
                      </button>
                    </div>
                  )}
                  {codigoError && <p className="wiz-error">{codigoError}</p>}

                  {/* Totales */}
                  <div className="wiz-totales">
                    <p>
                      <span>Subtotal</span>
                      <span>${calcularSubtotal().toFixed(2)}</span>
                    </p>
                    <p>
                      <span>Descuento</span>
                      <span>−${calcularDescuento().toFixed(2)}</span>
                    </p>
                    <p className="wiz-total-final">
                      <span>Total</span>
                      <span>${precioFinal.toFixed(2)}</span>
                    </p>
                  </div>

                  {/* Confirmación (requiere sesión) */}
                  {user ? (
                    <button
                      type="button"
                      className="wiz-confirmar"
                      onClick={guardarCita}
                      disabled={guardando}
                    >
                      {guardando ? "Procesando…" : "Confirmar turno"}
                    </button>
                  ) : (
                    <div className="wiz-auth">
                      <p className="wiz-ayuda">
                        Inicia sesión o regístrate para confirmar tu turno.
                      </p>
                      <AuthGate />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navegación */}
        <div className="wiz-nav">
          <button
            type="button"
            className="wiz-nav-btn atras"
            onClick={retroceder}
            disabled={paso === 0}
          >
            <IoArrowBack /> Atrás
          </button>
          {paso < PASOS.length - 1 && (
            <button
              type="button"
              className="wiz-nav-btn siguiente"
              onClick={avanzar}
              disabled={!puedeAvanzar}
            >
              Siguiente <IoArrowForward />
            </button>
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
              <h3 className="tm-modal__title">
                {modal.tipo === "exito" && "¡Reserva exitosa!"}
                {modal.tipo === "error" && "Algo salió mal"}
                {modal.tipo === "turno" && "Horario no disponible"}
                {modal.tipo === "mantenimiento" && "Servicio en mantenimiento"}
              </h3>
              <p className="tm-modal__text">{modal.texto}</p>
              <button className="tm-modal__btn" onClick={cerrarModal}>
                {modal.tipo === "exito" ? "Ver mis citas" : "Entendido"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CotizadorWizard;
