import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { IoCheckmarkCircle, IoStar, IoSparklesOutline } from "react-icons/io5";
import { db } from "../Firebase/Firebase";
import { useAuth } from "../Partes/ulidades/AuthContext";
import { useSystemConfig } from "../Partes/ulidades/SystemConfigContext";
import AuthGate from "../Partes/Agenda/AuthGate";
import {
  planesMensuales,
  PLAN_DESTACADO,
  elegirPlanActivo,
} from "../data/cotizador";

// Texto humano para el estado de un plan ya solicitado. "aprobando" es el
// sinónimo de aprobado que escribe el dashboard al cobrar.
const textoEstado = (estado) => {
  const e = String(estado || "").toLowerCase();
  if (e === "aprobado" || e === "aprobando") return "Ya tienes un plan activo.";
  if (e === "recibido") return "Tienes un plan en revisión.";
  return "";
};

const testimonios = [
  {
    nombre: "María López",
    texto:
      "Contraté el plan premium y mi casa nunca había estado tan impecable. ¡Vale cada centavo!",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    nombre: "Carlos Pérez",
    texto:
      "El servicio es excelente, puntuales y muy cuidadosos. 100% recomendados.",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    nombre: "Andrea Gómez",
    texto:
      "Desde que uso el plan Esencial, tengo más tiempo libre y mi hogar brilla.",
    img: "https://randomuser.me/api/portraits/women/48.jpg",
  },
];

const Homeplamensual = () => {
  const { user, perfil } = useAuth();
  const { flags } = useSystemConfig();
  // Protección de costos: contratar un plan se pausa en mantenimiento (≥90).
  const reservasHabilitadas = flags.reservationsEnabled !== false;

  const [confirmPlan, setConfirmPlan] = useState(null); // plan pendiente de confirmar
  const [guardando, setGuardando] = useState(false);
  const [authAbierto, setAuthAbierto] = useState(false);
  const [modal, setModal] = useState(null); // { tipo, texto }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Plan activo del usuario (si lo hay) para bloquear la contratación de uno
  // nuevo. Cacheado con React Query (stale-while-revalidate) y solo con sesión.
  // `planExistente` = plan aprobado/recibido | null.
  const {
    data: planExistente = null,
    isLoading: cargando,
    refetch: refetchPlan,
  } = useQuery({
    queryKey: ["planActivo", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      const snap = await getDocs(
        query(
          collection(db, "planesMensuales"),
          where("clienteId", "==", user.uid),
        ),
      );
      return elegirPlanActivo(snap.docs.map((d) => d.data()));
    },
  });

  // Al iniciar sesión desde el gate, cerrarlo automáticamente.
  useEffect(() => {
    if (user) setAuthAbierto(false);
  }, [user]);

  const bloqueado = !!planExistente;

  const scrollToPlanes = () => {
    document
      .getElementById("planes-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // "Adquirir Plan": sin sesión abre el gate; con sesión abre la confirmación.
  const adquirir = (plan) => {
    if (bloqueado) return;
    // Protección de costos: contratación pausada durante el mantenimiento.
    if (!reservasHabilitadas) {
      setModal({
        tipo: "mantenimiento",
        texto:
          "Estamos realizando un mantenimiento temporal y la contratación de planes está pausada. Vuelve a intentarlo en unos minutos.",
      });
      return;
    }
    if (!user) {
      setAuthAbierto(true);
      return;
    }
    setConfirmPlan(plan);
  };

  // Guarda el plan en Firestore con la misma estructura que la app móvil
  // (SumakApp/src/screens/PlanesMensualesScreen.js). La Cloud Function
  // `onPlanCreado` verifica precio/servicios contra el catálogo servidor.
  const confirmarCompra = async () => {
    if (!confirmPlan || !user) return;
    // Protección de costos: doble comprobación por si el nivel cambió mientras
    // el modal de confirmación estaba abierto.
    if (!reservasHabilitadas) {
      setConfirmPlan(null);
      setModal({
        tipo: "mantenimiento",
        texto:
          "Estamos realizando un mantenimiento temporal y la contratación de planes está pausada. Vuelve a intentarlo en unos minutos.",
      });
      return;
    }
    setGuardando(true);
    try {
      await addDoc(collection(db, "planesMensuales"), {
        clienteId: user.uid,
        clienteNombre: perfil?.nombre ?? "",
        clienteEmail: perfil?.correo ?? user.email ?? "",
        clienteCelular: perfil?.celular ?? "",
        planId: confirmPlan.id,
        nombrePlan: confirmPlan.nombre,
        precio: confirmPlan.precio,
        serviciosTotales: confirmPlan.serviciosTotales,
        serviciosUsados: 0,
        tipoServicios: confirmPlan.tipoServicios,
        fechaSolicitud: serverTimestamp(),
        estado: "recibido",
      });
      setConfirmPlan(null);
      await refetchPlan(); // deja la página en estado "bloqueado"
      setModal({
        tipo: "exito",
        texto:
          "¡Solicitud enviada! Tu plan está en revisión. Te avisaremos cuando sea aprobado.",
      });
    } catch (e) {
      console.error(e);
      setConfirmPlan(null);
      setModal({
        tipo: "error",
        texto: "No se pudo enviar la solicitud. Intenta de nuevo.",
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="homeplan-wrapper">
      {/* HERO */}
      <motion.section
        className="homeplan-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Tu lugar impecable,
          <br /> sin esfuerzo.
        </motion.h1>
        <p className="hero-subtitle">
          Elige un plan mensual y relájate mientras cuidamos cada rincón de tu
          espacio.
        </p>
        <motion.button
          className="hero-btn"
          onClick={scrollToPlanes}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Ver planes
        </motion.button>
      </motion.section>

      {/* PLANES */}
      <motion.section
        id="planes-section"
        className="homeplan-contenedor"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="homeplan-titulo">Elige tu Plan Mensual</h2>
        <p className="homeplan-descripcion">
          Contrata un plan y ahorra manteniendo tu espacio impecable todo el
          mes. Elige el que más se adapte a ti.
        </p>

        {bloqueado && (
          <div className="homeplan-aviso">
            <IoStar />
            <span>{textoEstado(planExistente.estado)}</span>
          </div>
        )}

        <div className="homeplan-lista">
          {planesMensuales.map((plan) => {
            const destacado = plan.id === PLAN_DESTACADO;
            return (
              <motion.div
                key={plan.id}
                className={`homeplan-card${destacado ? " destacado" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                {destacado && (
                  <div className="homeplan-badge">
                    <IoStar /> RECOMENDADO
                  </div>
                )}

                <div className="homeplan-top">
                  <div>
                    <h3>{plan.nombre}</h3>
                    <p className="homeplan-des">{plan.descripcion}</p>
                  </div>
                </div>

                <div className="homeplan-precio">
                  <span>${plan.precio}</span>
                  <small>/mes</small>
                </div>

                <ul className="homeplan-incluye">
                  {plan.incluye.map((item, i) => (
                    <li key={i}>
                      <IoCheckmarkCircle />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="homeplan-chip">
                  <IoSparklesOutline />
                  {plan.serviciosTotales} servicios incluidos
                </div>

                <button
                  type="button"
                  className={`homeplan-btn-continuar${
                    destacado ? " gold" : ""
                  }`}
                  onClick={() => adquirir(plan)}
                  disabled={bloqueado || cargando}
                >
                  {bloqueado ? "No disponible" : "Adquirir Plan"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* TESTIMONIOS */}
      <section className="testimonios-section">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="testimonios-grid">
          {testimonios.map((t, i) => (
            <motion.div
              key={i}
              className="testimonio-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <img src={t.img} alt={t.nombre} />
              <p>"{t.texto}"</p>
              <h4>{t.nombre}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2>¿Listo para transformar tu espacio?</h2>
          <p>
            Elige tu plan ideal y deja que nuestro equipo se encargue del resto.
          </p>
          <button onClick={scrollToPlanes}>Comenzar ahora</button>
        </motion.div>
      </section>

      {/* Modal de confirmación de compra */}
      <AnimatePresence>
        {confirmPlan && (
          <motion.div
            className="tm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !guardando && setConfirmPlan(null)}
          >
            <motion.div
              className="tm-modal tm-modal--turno"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="tm-modal__title">Confirmar plan</h3>
              <p className="tm-modal__text">
                ¿Deseas adquirir el {confirmPlan.nombre} por $
                {confirmPlan.precio}/mes? Tu solicitud quedará en revisión.
              </p>
              <button
                className="tm-modal__btn"
                onClick={confirmarCompra}
                disabled={guardando}
              >
                {guardando ? "Enviando…" : "Confirmar"}
              </button>
              <button
                className="tm-modal__btn tm-modal__btn--sec"
                onClick={() => setConfirmPlan(null)}
                disabled={guardando}
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de resultado (éxito / error) */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="tm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
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
                {modal.tipo === "exito"
                  ? "¡Solicitud enviada!"
                  : modal.tipo === "mantenimiento"
                    ? "Servicio en mantenimiento"
                    : "Algo salió mal"}
              </h3>
              <p className="tm-modal__text">{modal.texto}</p>
              <button className="tm-modal__btn" onClick={() => setModal(null)}>
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gate de sesión: iniciar sesión / registrarse para contratar */}
      <AnimatePresence>
        {authAbierto && (
          <motion.div
            className="tm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthAbierto(false)}
          >
            <motion.div
              className="homeplan-auth-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="homeplan-auth-intro">
                Inicia sesión o regístrate para contratar tu plan.
              </p>
              <AuthGate />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homeplamensual;
