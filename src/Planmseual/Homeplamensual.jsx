import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Homeplamensual = () => {
  const navigate = useNavigate();

  const planes = [
    {
      id: 1,
      nombre: "Plan Básico",
      descripcion:
        "Perfecto para mantener espacios limpios y organizados semanalmente, ya sea tu hogar, oficina o restaurante.",
      frecuencia: "1 vez por semana",
      precio: 85,
      beneficios: [
        "Limpieza y Desinfección general",
        "Aromatización",
        "Lavado de platos o utensilios simples",
      ],
      color: "#00BFA6",
    },
    {
      id: 2,
      nombre: "Plan Premium",
      descripcion:
        "No esperes más: transforma tu hogar, oficina o restaurante con un servicio que combina lujo y eficiencia.",
      frecuencia: "2 veces por semana",
      precio: 165,
      beneficios: [
        "Todo el plan básico",
        "Limpieza profunda",
        "Limpieza de vehiculos",
        "Reposición de artículos de baño",
        "Control de plagas básico",
      ],
      color: "#00BFA6",
    },
    {
      id: 3,
      nombre: "Plan Deluxe",
      descripcion: "Máximo confort y limpieza sin preocupaciones.",
      frecuencia: "3 veces por semana",
      precio: 220,
      beneficios: [
        "Todo el plan básico",
        "Todo el plan Premium",
        "Lavado y cuidado express de textiles, tapicería y uniformes",
        "Limpieza de vehículos",
        "Cuidado de plantas y jardines internos o exteriores",
        "Preparación de rincones de relajación o productividad",
      ],
      color: "#00BFA6",
    },
  ];

  const multiplicadores = {
    pequeño: 1,
    mediano: 1.6,
    grande: 2.1,
  };

  const lugares = {
    Casa: "Casa",
    oficina: "Oficina",
    restaurante: "Restaurante",
  };

  const testimonios = [
    {
      nombre: "María López",
      texto:
        "Contraté el plan Deluxe y mi casa nunca había estado tan impecable. ¡Vale cada centavo!",
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
        "Desde que uso el plan Premium, tengo más tiempo libre y mi hogar brilla.",
      img: "https://randomuser.me/api/portraits/women/48.jpg",
    },
  ];

  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState("pequeño");
  const [lugar, setLugar] = useState("Casa");
  const handleSeleccionar = (plan) => {
    setPlanSeleccionado(plan);
    setTamanoSeleccionado("pequeño");
    setLugar("Casa");
  };

  const handleContinuar = () => {
    if (!planSeleccionado) {
      alert("Selecciona un plan antes de continuar.");
      return;
    }

    const precioFinal =
      planSeleccionado.precio * multiplicadores[tamanoSeleccionado];

    const orden = {
      id: `PLAN-${(Math.random() * 1000).toFixed(0)}`,
      ...planSeleccionado,
      tamano: tamanoSeleccionado,
      precioFinal,
      lugar: lugar,
      fechaSeleccion: new Date().toISOString(),
    };

    const mensaje = `Hola! Me gustaría contratar el *${planSeleccionado.nombre}* (${tamanoSeleccionado}) para  ${lugar} con un precio de *$${precioFinal.toFixed(
      2,
    )}/mes*.

Frecuencia: ${planSeleccionado.frecuencia}
Beneficios:
${planSeleccionado.beneficios.map((b) => `• ${b}`).join("\n")}

¿Podrían ayudarme con más información?`;

    const numero = "593963200325";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  const scrollToPlanes = () => {
    document
      .getElementById("planes-section")
      .scrollIntoView({ behavior: "smooth" });
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
          Diseñado para tu comodidad. Disfruta de un espacio limpio sin
          esfuerzo, elige el plan que más se adapte a ti.
        </p>

        <div className="homeplan-lista">
          {planes.map((plan) => {
            const esSeleccionado = planSeleccionado?.id === plan.id;
            const precioFinal = (
              plan.precio * multiplicadores[tamanoSeleccionado]
            ).toFixed(2);

            return (
              <motion.div
                key={plan.id}
                className={`homeplan-card ${esSeleccionado ? "seleccionado" : ""}`}
                style={{ "--accent": plan.color }}
                onClick={() => handleSeleccionar(plan)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="homeplan-top">
                  <div>
                    <h3>{plan.nombre}</h3>
                    <p className="homeplan-des">{plan.descripcion}</p>
                  </div>
                </div>

                <div className="homeplan-precio">
                  <span>${precioFinal}</span>
                  <small>/mes</small>
                </div>

                <p className="homeplan-frecuencia">
                  <strong>Frecuencia:</strong> {plan.frecuencia}
                </p>

                <ul className="homeplan-beneficios">
                  {plan.beneficios.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                {/* Selector de tamaño */}
                {esSeleccionado && (
                  <div className="homeplan-tamanos">
                    <label>Selecciona el tamaño:</label>
                    <div className="tamanos-opciones">
                      {Object.keys(multiplicadores).map((tam) => (
                        <button
                          key={tam}
                          className={`tamano-btn ${tamanoSeleccionado === tam ? "activo" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTamanoSeleccionado(tam);
                          }}
                        >
                          {tam.charAt(0).toUpperCase() + tam.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/*elige par que seria entr restaurrtan csa o foicna*/}

                    <label className="lugtar">Selecciona un lugar:</label>
                    <div className="tamanos-opciones">
                      {Object.keys(lugares).map((tam) => (
                        <button
                          key={tam}
                          className={`tamano-btn ${lugar === tam ? "activo" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLugar(tam);
                          }}
                        >
                          {lugares[tam]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {esSeleccionado && (
                    <motion.div
                      className="homeplan-seleccionado"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <motion.button
                        className="homeplan-btn-continuar"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContinuar();
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Continuar
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
    </div>
  );
};

export default Homeplamensual;
