import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Limpieza de Hogares",
    description: "Transforma tu hogar en un espacio impecable y acogedor.",
    Precios: [
      { size: "Pequeño (1-4 habitaciones)", price: 35 },
      { size: "Mediano (5-8 habitaciones)", price: 56 },
      { size: "Grande (9-11 habitaciones)", price: 95 },
      { size: "Personalizado (12+ habitaciones)", price: "varia" },
    ],
  },
  {
    id: 2,
    title: "Limpieza de Oficinas",
    description: "Mantén tu oficina limpia y profesional para tu equipo.",
    Precios: [
      { size: "Pequeña (1-5 empleados)", price: 45 },
      { size: "Mediana (6-15 empleados)", price: 68 },
      { size: "Grande (16+ empleados)", price: 150 },
      { size: "Personalizado (20+ empleados)", price: "varia" },
    ],
  },
  {
    id: 3,
    title: "Limpieza de Restaurantes",
    description:
      "Cumple con los estándares de higiene y seguridad alimentaria.",
    Precios: [
      { size: "Pequeño (1-4 mesas)", price: 37 },
      { size: "Mediano (5-8 mesas)", price: 56 },
      { size: "Grande (9+ mesas)", price: 120 },
      { size: "Personalizado (18+ mesas)", price: "varia" },
    ],
  },
];

const extras = [
  { id: 1, name: "Profunda Master", percentage: 0.15 },
  { id: 2, name: "Profunda VIP", percentage: 0.35 },
];

const adicionales = [
  // ── Hogares y Oficinas ──────────────────────────────────────
  {
    id: 1,
    name: "Terras y Balcones",
    price: 10,
    apto: "Hogares y Oficinas",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },
  {
    id: 3,
    name: "Habitación extra",
    price: 15,
    apto: "Hogares y Oficinas",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/habitacion_extra_sumak_ozv6tn.png",
  },

  // ── Solo Hogares ─────────────────────────────────────────────
  {
    id: 4,
    name: "Limpieza de colchones",
    price: 20,
    apto: "Hogares",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/habitacion_extra_sumak_ozv6tn.png",
  },
  {
    id: 5,
    name: "Limpieza de alfombras",
    price: 18,
    apto: "Hogares",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/habitacion_extra_sumak_ozv6tn.png",
  },

  // ── Solo Oficinas ─────────────────────────────────────────────
  {
    id: 6,
    name: "ambientación de espacios",
    price: 15,
    apto: "Oficinas",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },
  {
    id: 7,
    name: "Resposición de suministros de limpieza",
    price: 12,
    apto: "Oficinas",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },

  // ── Solo Restaurantes ─────────────────────────────────────────
  {
    id: 8,
    name: "Desengrasado de campana",
    price: 25,
    apto: "Restaurantes",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },
  {
    id: 9,
    name: "Limpieza de Neveras y vitrinas",
    price: 30,
    apto: "Restaurantes",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },

  // ── Hogares y Restaurantes ────────────────────────────────────
  {
    id: 10,
    name: "Limpieza de ventanas (exterior)",
    price: 15,
    apto: "Hogares y Restaurantes",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/habitacion_extra_sumak_ozv6tn.png",
  },

  // ── Oficinas y Restaurantes ───────────────────────────────────
  {
    id: 11,
    name: "Pulido de pisos",
    price: 30,
    apto: "Oficinas y Restaurantes",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/habitacion_extra_sumak_ozv6tn.png",
  },

  // ── Todos los lugares ─────────────────────────────────────────
  {
    id: 2,
    name: "Aromatización",
    price: 10,
    apto: "Hogares, Oficinas y Restaurantes",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },
  {
    id: 12,
    name: "Limpieza profunda de baños",
    price: 12,
    apto: "Hogares, Oficinas y Restaurantes",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/habitacion_extra_sumak_ozv6tn.png",
  },
  {
    id: 13,
    name: "Retiro de residuos especiales",
    price: 8,
    apto: "Hogares, Oficinas y Restaurantes",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },
];

const tiposLimpieza = [
  {
    id: 1,
    name: "Normal",
    incluye: [
      "Limpieza integral de áreas visibles",
      "Aspirado, barrido y trapeado de pisos",
      "Desinfección básica de superficies de contacto",
      "Retiro de polvo en muebles, equipos y decoraciones accesibles",
      "Limpieza de baños y sanitarios",
      "Limpieza de cocina o área de cafetería",
      "Limpieza de espejos y superficies de vidrio accesibles",
      "Vaciado de basureros y reposición de fundas",
      "Organización básica de espacios",
      "Aromatización de ambientes",
    ],
  },
  {
    id: 2,
    name: "Profunda Master",
    incluye: [
      "Todo lo incluido en el plan Normal",
      "Desinfección reforzada de áreas de alto contacto",
      "Limpieza detallada de puertas, marcos e interruptores",
      "Limpieza de zócalos, esquinas y bordes",
      "Eliminación de polvo acumulado en zonas de difícil acceso",
      "Limpieza profunda de baños",
      "Desengrasado de cocinas y áreas de preparación",
      "Limpieza detallada de mobiliario y superficies de trabajo",
      "Tratamiento para eliminar manchas superficiales",
      "Limpieza detallada de cristales y superficies brillantes",
      "Aromatización premium de larga duración",
    ],
  },
  {
    id: 3,
    name: "Profunda VIP",
    incluye: [
      "Todo lo incluido en el Profunda Master y el plan Normal",
      "Limpieza profunda y detallada de todas las áreas intervenidas",
      "Desinfección intensiva de superficies y puntos críticos de contacto",
      "Eliminación de grasa, polvo y suciedad acumulada",
      "Limpieza interior y exterior de muebles accesibles",
      "Limpieza completa de ventanas, marcos, rieles y superficies de vidrio",
      "Limpieza detrás, debajo y alrededor de muebles accesibles",
      "Tratamiento para neutralización de olores",
      "Limpieza detallada de esquinas, rincones y áreas de difícil acceso",
      "Recuperación del brillo natural de superficies según el material",
      "Acabado profesional para una apariencia impecable",
      "Inspección y control de calidad final",
      "Aromatización premium de larga duración",
      "Atención especial a los detalles para dejar el espacio listo para recibir clientes, visitas o colaboradores",
    ],
  },
];

const CotizadorLandingPro = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedExtras, setSelectedExtras] = useState({});
  const [selectedAdicionales, setSelectedAdicionales] = useState([]);
  const [customPrices, setCustomPrices] = useState({});
  const [errors, setErrors] = useState({});
  const [showServiceModal, setShowServiceModal] = useState(false);

  const handleServiceChange = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!selectedServices.includes(service))
      setSelectedServices([...selectedServices, service]);
  };

  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
    const newSizes = { ...selectedSizes };
    delete newSizes[serviceId];
    setSelectedSizes(newSizes);
    const newExtras = { ...selectedExtras };
    delete newExtras[serviceId];
    setSelectedExtras(newExtras);
    const newCustomPrices = { ...customPrices };
    delete newCustomPrices[serviceId];
    setCustomPrices(newCustomPrices);
    const newErrors = { ...errors };
    delete newErrors[serviceId];
    setErrors(newErrors);
  };

  const handleSizeChange = (serviceId, size) => {
    setSelectedSizes({ ...selectedSizes, [serviceId]: size });
    if (size.toLowerCase().includes("personalizado")) {
      setCustomPrices({ ...customPrices, [serviceId]: "" });
      setErrors({ ...errors, [serviceId]: "Ingrese un precio válido" });
    } else {
      const newCustomPrices = { ...customPrices };
      delete newCustomPrices[serviceId];
      setCustomPrices(newCustomPrices);
      const newErrors = { ...errors };
      delete newErrors[serviceId];
      setErrors(newErrors);
    }
  };

  const handleCustomPriceChange = (serviceId, value) => {
    const price = parseFloat(value);
    if (isNaN(price) || price <= 0) {
      setErrors({
        ...errors,
        [serviceId]: "Ingrese un precio válido mayor que 0",
      });
      setCustomPrices({ ...customPrices, [serviceId]: 0 });
    } else {
      const newErrors = { ...errors };
      delete newErrors[serviceId];
      setErrors(newErrors);
      setCustomPrices({ ...customPrices, [serviceId]: price });
    }
  };

  const handleExtraChange = (serviceId, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    setSelectedExtras({ ...selectedExtras, [serviceId]: extra });
  };

  const handleAdicionalChange = (ad) => {
    if (selectedAdicionales.some((a) => a.id === ad.id))
      setSelectedAdicionales(selectedAdicionales.filter((a) => a.id !== ad.id));
    else setSelectedAdicionales([...selectedAdicionales, ad]);
  };

  const calcularSubtotal = () => {
    let subtotal = 0;
    selectedServices.forEach((service) => {
      const size = selectedSizes[service.id];
      if (!size) return;
      let price = service.Precios.find((p) => p.size === size).price;
      if (size.toLowerCase().includes("personalizado")) {
        price = parseFloat(customPrices[service.id]) || 0;
      }
      const extra = selectedExtras[service.id];
      if (extra) price += price * extra.percentage;
      subtotal += price;
    });
    subtotal += selectedAdicionales.reduce((sum, ad) => sum + ad.price, 0);
    return subtotal;
  };

  const calcularDescuento = () => {
    let descuento = 0;
    const subtotal = calcularSubtotal();
    if (selectedServices.length > 1) descuento += subtotal * 0.1;
    selectedServices.forEach((service) => {
      const size = selectedSizes[service.id];
      const extra = selectedExtras[service.id];
      if (
        size?.toLowerCase().includes("grande") &&
        extra?.name === "Profunda VIP"
      )
        descuento += subtotal * 0.05;
    });
    return descuento;
  };

  const precioFinal = calcularSubtotal() - calcularDescuento();

  const allSizesSelected = selectedServices.every(
    (s) =>
      selectedSizes[s.id] &&
      (!selectedSizes[s.id].toLowerCase().includes("personalizado") ||
        customPrices[s.id] > 0),
  );
  const hasErrors = Object.keys(errors).length > 0;

  const navigate = useNavigate();

  const handleContinuar = () => {
    const orden = {
      servicios: selectedServices.map((s) => ({
        id: s.id,
        titulo: s.title,
        tamaño: selectedSizes[s.id],
        tipoLimpieza: selectedExtras[s.id]?.name || "Normal",
        precioPersonalizado: customPrices[s.id] || null,
      })),
      id: (85 * Math.random()).toFixed(2),
      adicionales: selectedAdicionales,
      subtotal: calcularSubtotal(),
      descuento: calcularDescuento(),
      total: precioFinal,
    };
    console.log(orden);
    localStorage.setItem("ordenLimpieza", JSON.stringify(orden));

    navigate("/agendar");
  };

  return (
    <div className="cotizador-container">
      <h2 className="cotizador-title">Bienvenido</h2>
      <p className="LEYNAD">
        Utiliza nuestro cotizador para calcular el precio de tu servicio de
        limpieza.
      </p>

      {selectedServices.length === 0 ? (
        <div className="cotizador-add-service">
          <button
            className="cotizador-open-modal-btn"
            onClick={() => setShowServiceModal(true)}
          >
            Seleccionar servicio
          </button>
        </div>
      ) : null}

      <AnimatePresence>
        {showServiceModal && (
          <motion.div
            className="service-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowServiceModal(false)}
          >
            <motion.div
              className="service-modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="service-modal-close"
                onClick={() => setShowServiceModal(false)}
              >
                ✕
              </button>
              <h3 className="service-modal-title">¿Qué deseas limpiar?</h3>
              <p className="service-modal-sub">Elige el tipo de servicio</p>
              <div className="service-modal-grid">
                {services.map((service) => (
                  <button
                    key={service.id}
                    className="service-modal-card"
                    onClick={() => {
                      handleServiceChange(service.id);
                      setShowServiceModal(false);
                    }}
                  >
                    <span className="service-modal-card-title">
                      {service.title}
                    </span>
                    <span className="service-modal-card-desc">
                      {service.description}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="cotizador-services">
        <AnimatePresence>
          {selectedServices.map((service) => (
            <motion.div
              key={service.id}
              className="cotizador-service-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="cotizador-service-content">
                <h3 className="cotizador-service-title">{service.title}</h3>
                <p className="cotizador-service-description">
                  {service.description}
                </p>
                <button
                  onClick={() => removeService(service.id)}
                  className="cotizador-remove-btn"
                >
                  ✕
                </button>

                <div className="cotizador-service-select">
                  <label className="labs">Tamaño:</label>
                  <select
                    onChange={(e) =>
                      handleSizeChange(service.id, e.target.value)
                    }
                    value={selectedSizes[service.id] || ""}
                  >
                    <option value="">-- Selecciona tamaño --</option>
                    {service.Precios.map((p) => (
                      <option key={p.size} value={p.size}>
                        {p.size}
                      </option>
                    ))}
                  </select>

                  {selectedSizes[service.id]
                    ?.toLowerCase()
                    .includes("personalizado") && (
                    <>
                      <input
                        type="number"
                        placeholder="Ingresa precio personalizado"
                        value={customPrices[service.id] || ""}
                        onChange={(e) =>
                          handleCustomPriceChange(service.id, e.target.value)
                        }
                        style={{ marginTop: "8px" }}
                      />
                      {errors[service.id] && (
                        <p
                          style={{
                            color: "var(--clr-error)",
                            fontSize: "0.9em",
                            marginTop: "4px",
                          }}
                        >
                          {errors[service.id]}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="cotizador-service-select">
                  <label className="labs">Tipo de limpieza:</label>
                  <select
                    onChange={(e) =>
                      handleExtraChange(service.id, parseInt(e.target.value))
                    }
                    value={selectedExtras[service.id]?.id || ""}
                  >
                    <option value="">Normal</option>
                    {extras.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedServices.length > 0 &&
        (() => {
          const lugaresSeleccionados = selectedServices.map((s) => {
            if (s.title.includes("Hogar")) return "Hogares";
            if (s.title.includes("Oficina")) return "Oficinas";
            if (s.title.includes("Restaurante")) return "Restaurantes";
            return "";
          });
          const adicionalesFiltrados = adicionales.filter((ad) =>
            lugaresSeleccionados.some((lugar) => ad.apto.includes(lugar)),
          );
          return (
            <div className="cotizador-adicionales">
              <h3>Servicios Adicionales</h3>
              <div className="adicionales-grid">
                {adicionalesFiltrados.map((ad) => {
                  const isSelected = selectedAdicionales.some(
                    (a) => a.id === ad.id,
                  );
                  return (
                    <div
                      key={ad.id}
                      className={`adicional-card ${isSelected ? "activo" : ""}`}
                      onClick={() => handleAdicionalChange(ad)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        style={{ display: "none" }}
                      />

                      <span className="adicional-text">
                        {ad.name} <br /> +${ad.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      {selectedServices.length > 0 && (
        <div className="cotizador-resumen">
          <h3>Resumen y Precio Final</h3>

          {!allSizesSelected || hasErrors ? (
            <p
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: "var(--fs-sm)",
              }}
            >
              Por favor, selecciona todos los tamaños y asegúrate de que los
              precios personalizados sean válidos.
            </p>
          ) : (
            <>
              {selectedServices.map((service) => (
                <div className="cardsec" key={service.id}>
                  <p>
                    <strong>Servicio:</strong> {service.title}
                  </p>
                  <p>
                    <strong>Tamaño:</strong> {selectedSizes[service.id]}
                  </p>
                  <p>
                    <strong>Tipo de limpieza:</strong>{" "}
                    {selectedExtras[service.id]?.name || "Normal"}
                  </p>
                  {selectedSizes[service.id]
                    ?.toLowerCase()
                    .includes("personalizado") && (
                    <p>
                      <strong>Precio personalizado:</strong> $
                      {customPrices[service.id]}
                    </p>
                  )}
                  {(() => {
                    const tipoNombre =
                      selectedExtras[service.id]?.name || "Normal";
                    const tipo = tiposLimpieza.find(
                      (t) => t.name === tipoNombre,
                    );
                    return tipo ? (
                      <div className="cardsec-incluye">
                        <p className="cardsec-incluye-label">Incluye</p>
                        <ul>
                          {tipo.incluye.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}
                </div>
              ))}
              {selectedAdicionales.length > 0 && (
                <p className="divbo">
                  <strong>Adicionales:</strong>{" "}
                  {selectedAdicionales.map((a) => a.name).join(", ")}
                </p>
              )}
              <p className="divbo">
                <strong>Subtotal:</strong> ${calcularSubtotal().toFixed(2)}
              </p>
              <p className="divbo">
                <strong>Descuento aplicado:</strong> $
                {calcularDescuento().toFixed(2)}
              </p>
              <p className="divbofin">
                Precio final: ${precioFinal.toFixed(2)}
              </p>
              <button className="tmconti" onClick={handleContinuar}>
                Agendar servicio
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CotizadorLandingPro;
