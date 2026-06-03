import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Limpieza de Hogares",
    Precios: [
      { size: "Pequeño (1-3 habitaciones)", price: 35 },
      { size: "Mediano (3-5 habitaciones)", price: 56 },
      { size: "Grande (5+ habitaciones)", price: 85 },
    ],
    description:
      "Transforma tu espacio en un oasis: limpiezas rápidas o profundas, hechas solo para ti.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760686760/hermano_Miguel_y_calle_larga_jvad5k.png",
    priceRange: "$35 – $112",
  },
  {
    id: 2,
    title: "Limpieza de Oficinas",
    Precios: [
      { size: "Pequeña (1-5 empleados)", price: 45 },
      { size: "Mediana (6-15 empleados)", price: 68 },
      { size: "Grande (16+ empleados)", price: 150 },
    ],
    description: "Ambientes impecables para trabajar con productividad.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760687049/hermano_Miguel_y_calle_larga_1_w4m8lt.png",
    priceRange: "$45 – $150",
  },
  {
    id: 3,
    title: "Limpieza de Restaurantes",
    Precios: [
      { size: "Pequeño (1-3 mesas)", price: 36 },
      { size: "Mediano (4-6 mesas)", price: 56 },
      { size: "Grande (7+ mesas)", price: 120 },
    ],
    description: "Cumplimos con los estándares de higiene más exigentes.",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1760687287/hermano_Miguel_y_calle_larga_2_ex0sql.png",
    priceRange: "$37 – $120",
  },
];

const Home = () => {
  const [selectedService, setSelectedService] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="sumak-container">
      {/* Hero */}
      <div className="sumak-hero">
        <div className="sumak-hero-overlay">
          <h1 className="sumak-title">Bienvenido a Sumak</h1>
          <p className="sumak-subtitle">
            Limpieza profesional y de lujo, rápida y confiable. Tu espacio
            impecable en tiempo récord.
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
                  src={service.image}
                  alt={service.title}
                />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-card__price-badge">
                {service.priceRange}
              </span>
            </motion.button>
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
              src={selectedService.image}
              alt={selectedService.title}
            />
            <div className="modal-body">
              <h2 className="tilicar">{selectedService.title}</h2>
              <p className="descar">{selectedService.description}</p>
              <h3 className="tilicar2">Rango de precios:</h3>
              <ul className="cotepersli">
                {selectedService.Precios.map((option, index) => (
                  <li className="PRCIITAM" key={index}>
                    {option.size}: ${option.price}
                  </li>
                ))}
              </ul>
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
    </section>
  );
};

export default Home;
