import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoChevronBack,
  IoChevronForward,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { tiposLimpieza } from "../../data/cotizador";
import { cloudinaryOptimized } from "../ulidades/cloudinary";

const services = [
  {
    id: 1,
    title: "Limpieza de Hogares",
    Precios: [
      { size: "Pequeño (1-3 habitaciones)", price: 38 },
      { size: "Mediano (3-5 habitaciones)", price: 56 },
      { size: "Grande (5+ habitaciones)", price: 95 },
    ],
    description:
      "Espacios que respiran, hogares que brillan. Tú eliges el nivel de limpieza, nosotros nos encargamos del resto.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760686760/hermano_Miguel_y_calle_larga_jvad5k.png",
    priceRange: "$38 – $125",
  },
  {
    id: 2,
    title: "Limpieza de Oficinas",
    Precios: [
      { size: "Pequeña (1-5 empleados)", price: 45 },
      { size: "Mediana (6-15 empleados)", price: 68 },
      { size: "Grande (16+ empleados)", price: 150 },
    ],
    description:
      "Espacios de trabajo limpios que impulsan la productividad de tu equipo.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760687049/hermano_Miguel_y_calle_larga_1_w4m8lt.png",
    priceRange: "$45 – $210",
  },
  {
    id: 3,
    title: "Limpieza de Restaurantes",
    Precios: [
      { size: "Pequeño (1-3 mesas)", price: 36 },
      { size: "Mediano (4-6 mesas)", price: 56 },
      { size: "Grande (7+ mesas)", price: 120 },
    ],
    description:
      "Protocolos rigurosos, resultados impecables. La higiene que tu negocio necesita.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1783377622/Dise%C3%B1o_sin_t%C3%ADtulo_3_xl5uhp.png",
    priceRange: "$38 – $170",
  },
  {
    id: 4,
    title: "Limpieza de Airbnb",
    Precios: [
      { size: "Estudio / 1 habitación", price: 40 },
      { size: "2-3 habitaciones", price: 65 },
      { size: "4+ habitaciones", price: 100 },
    ],
    description:
      "Impresiona a tus huéspedes con un espacio impecable. Limpieza rápida y detallada ",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760687287/hermano_Miguel_y_calle_larga_2_ex0sql.png",
    priceRange: "$40 – $140",
  },
];

// Presentación local de los tipos de limpieza (imagen + descripción corta).
// La lista `incluye` viene de `tiposLimpieza` (cotizador.js), fuente única de
// verdad compartida con la app móvil; aquí solo añadimos lo visual.
// TODO: reemplazar imágenes por las definitivas del cliente.
const tipoMeta = {
  1: {
    descCorta: "Mantenimiento fresco y ordenado para el día a día.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760686760/hermano_Miguel_y_calle_larga_jvad5k.png",
  },
  2: {
    descCorta: "Limpieza a fondo de cada rincón, esquinas y detalles.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760687049/hermano_Miguel_y_calle_larga_1_w4m8lt.png",
  },
  3: {
    descCorta: "Nivel premium: cristales, abrillantado y aromatización.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1783377622/Dise%C3%B1o_sin_t%C3%ADtulo_3_xl5uhp.png",
  },
};

const tipos = tiposLimpieza.map((t) => ({ ...t, ...tipoMeta[t.id] }));

const Home = () => {
  const [selectedService, setSelectedService] = useState(null);

  // Carrusel coverflow de tipos de limpieza.
  const [tipoActivo, setTipoActivo] = useState(1); // arranca en el central
  const [tipoModal, setTipoModal] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Avanza / retrocede con wrap-around dentro del carrusel.
  const irA = (i) => setTipoActivo((i + tipos.length) % tipos.length);
  const siguiente = () => setTipoActivo((i) => (i + 1) % tipos.length);
  const anterior = () =>
    setTipoActivo((i) => (i - 1 + tipos.length) % tipos.length);

  // Auto-avance cada 6s; se pausa mientras el modal está abierto.
  useEffect(() => {
    if (tipoModal) return;
    const id = setInterval(siguiente, 6000);
    return () => clearInterval(id);
  }, [tipoModal]);

  return (
    <section className="sumak-container">
      {/* Hero */}
      <div className="sumak-hero">
        <div className="sumak-hero-overlay">
          <h1 className="sumak-title">Bienvenido a Sumak</h1>
          <p className="sumak-subtitle">
            Limpieza profesional , rápida y confiable. Tu espacio impecable en
            tiempo récord.
          </p>

          <div className="sumak-hero-buttons">
            <Link to="/agendar" className="sumak-button">
              Reserva Ahora
            </Link>
            <Link to="/pacmesual" className="sumak-button-secondary">
              Planes Mensuales
            </Link>
          </div>
        </div>
      </div>

      {/* Servicios destacados */}
      <div className="sumak-sectionserv fade-in">
        <h2 className="sumak-section-title">Nuestros servicios</h2>
        <div className="sumak-cards">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              className="sumak-card"
              onClick={() => setSelectedService(service)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="conimg">
                <img
                  className="imgse"
                  src={cloudinaryOptimized(service.image)}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3>{service.title}</h3>

              <span className="service-card__price-badge">
                {service.priceRange}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tipos de limpieza — carrusel coverflow */}
      <div className="tipos-section fade-in">
        <h2 className="sumak-section-title">
          Conoce nuestros tipos de limpieza
        </h2>
        <p className="tipos-subtitle">
          Elige el nivel de detalle perfecto para tu espacio.
        </p>

        <div className="tipos-carousel">
          <button
            type="button"
            className="tipo-nav tipo-nav--prev"
            onClick={anterior}
            aria-label="Tipo anterior"
          >
            <IoChevronBack />
          </button>

          <motion.div
            className="tipos-coverflow"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(e, info) => {
              if (info.offset.x < -60) siguiente();
              else if (info.offset.x > 60) anterior();
            }}
          >
            {tipos.map((tipo, index) => {
              const offset = index - tipoActivo;
              const activa = offset === 0;
              return (
                <motion.article
                  key={tipo.id}
                  className={`tipo-card${activa ? " tipo-card--activa" : ""}`}
                  animate={{
                    x: `${offset * 62}%`,
                    scale: activa ? 1 : 0.82,
                    opacity: Math.abs(offset) > 1 ? 0 : activa ? 1 : 0.45,
                    zIndex: activa ? 3 : 1,
                    filter: activa ? "blur(0px)" : "blur(1.5px)",
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  onClick={() => (activa ? setTipoModal(tipo) : irA(index))}
                  style={{
                    pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
                  }}
                >
                  <div className="tipo-card__img-wrap">
                    <img
                      className="tipo-card__img"
                      src={cloudinaryOptimized(tipo.image)}
                      alt={tipo.name}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="tipo-card__body">
                    <h3 className="tipo-card__title">{tipo.name}</h3>
                    <p className="tipo-card__desc">{tipo.descCorta}</p>
                    <span className="tipo-card__cta">Ver detalles</span>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <button
            type="button"
            className="tipo-nav tipo-nav--next"
            onClick={siguiente}
            aria-label="Siguiente tipo"
          >
            <IoChevronForward />
          </button>
        </div>

        <div className="tipos-dots">
          {tipos.map((tipo, index) => (
            <button
              key={tipo.id}
              type="button"
              className={`tipos-dot${index === tipoActivo ? " activo" : ""}`}
              onClick={() => irA(index)}
              aria-label={`Ver ${tipo.name}`}
            />
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="sumak-stats-strip">
        {[
          { number: "+500", label: "Clientes felices" },
          { number: "15%", label: "Descuento primera cita" },
          { number: "100%", label: "Satisfacción garantizada" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="stat-item"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            <span className="stat-number">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Modal con animación */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div
            className="modal-content animate"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="modal-img"
              src={cloudinaryOptimized(selectedService.image)}
              alt={selectedService.title}
              decoding="async"
            />
            <div className="modal-body">
              <h2 className="tilicar">{selectedService.title}</h2>
              <p className="descar">{selectedService.description}</p>

              <Link
                to="/agendar"
                className="sumton2"
                onClick={() => setSelectedService(null)}
              >
                Agendar
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle de tipo de limpieza */}
      <AnimatePresence>
        {tipoModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTipoModal(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                className="modal-img"
                src={cloudinaryOptimized(tipoModal.image)}
                alt={tipoModal.name}
                decoding="async"
              />
              <div className="modal-body">
                <h2 className="tilicar">Limpieza {tipoModal.name}</h2>
                <p className="descar">{tipoModal.descCorta}</p>

                <p className="tilicar2">Este servicio incluye</p>
                <ul className="tipo-incluye">
                  {tipoModal.incluye.map((item, i) => (
                    <li key={i}>
                      <IoCheckmarkCircle />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/agendar"
                  className="sumton2"
                  onClick={() => setTipoModal(null)}
                >
                  Agendar
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA final */}
      <motion.div
        className="sumak-cta fade-in"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>¿Listo para un espacio impecable?</h2>
        <p>
          Reserva hoy y obtén un <strong>descuento exclusivo del 15%</strong> en
          tu primera limpieza.
        </p>
        <Link to="/agendar" className="sumak-button">
          Reserva Ahora
        </Link>
      </motion.div>

      {/* CTA Final Premium */}
      <motion.section
        className="sumak-cta-premium"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="sumak-cta-content">
          <h2>La limpieza profesional que tu espacio merece</h2>

          <p>
            Descarga la aplicación de Sumak Clean y reserva tus servicios de
            limpieza en segundos. Administra tus citas, recibe notificaciones en
            tiempo real y accede a beneficios y promociones exclusivas desde tu
            celular.
          </p>

          <div className="sumak-cta-buttons">
            {/*
            <a
              href="https://play.google.com/store/apps/details?id=TU_APP"
              target="_blank"
              rel="noopener noreferrer"
              className="sumak-button-secondary"
            >
              Descargar la App
            </a>
            */}
            <p className="sumak-button-secondary">Próximamente</p>
          </div>
        </div>
      </motion.section>
    </section>
  );
};

export default Home;
