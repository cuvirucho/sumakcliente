import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tomdatos from "../ulidades/Tomdatos";

const Booking = () => {
  const [cotizacion, setCotizacion] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Cargar la cotización guardada al montar el componente
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("ordenLimpieza"));
    if (data) {
      setCotizacion(data);
    }
  }, []);

  // 🧹 Borrar la cotización guardada
  const handleBorrarCotizacion = () => {
    localStorage.removeItem("ordenLimpieza");
    setCotizacion(null);
    alert("🧹 Cotización eliminada correctamente.");
  };

  console.log("Cotización cargada:", cotizacion);

  const [vecot, setvecot] = useState(false);

  const vercotisacion = () => {
    setvecot(!vecot);
  };

  return (
    <section className="booking-section">
      {cotizacion ? (
        <div className="contefuldarotom">
          <h3 className="cotizacion-paso">Paso 2: Llena tus datos </h3>

          <Tomdatos coti={cotizacion} />

          <article className="cotizacion-card">
            <div className="cotizacion-header">
              <p className="cotizacion-creada">
                ✅ Cotización creada correctamente
              </p>
              <button className="btn-ver-cotizacion" onClick={vercotisacion}>
                {vecot ? "Ocultar resumen" : "Ver cotización"}
              </button>
            </div>

            {vecot && (
              <div className="cotizacion-resumen">
                <h3 className="cotizacion-subtitulo">
                  Servicios seleccionados:
                </h3>

                {cotizacion.servicios.map((s, index) => (
                  <div key={index} className="servicio-item">
                    <p>
                      <strong>{s.titulo}</strong>
                    </p>
                    <p>
                      Tamaño: <span>{s.tamaño}</span>
                    </p>
                    <p>
                      Tipo de limpieza: <span>{s.tipoLimpieza}</span>
                    </p>
                    {s.precioPersonalizado && (
                      <p>
                        Precio personalizado:{" "}
                        <span>${s.precioPersonalizado}</span>
                      </p>
                    )}
                  </div>
                ))}

                {cotizacion.adicionales.length > 0 && (
                  <>
                    <h3 className="cotizacion-subtitulo">Adicionales:</h3>
                    <ul className="cotizacion-lista">
                      {cotizacion.adicionales.map((a, i) => (
                        <li key={i}>
                          {a.name} <span>(+${a.price})</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="cotizacion-totales">
                  <h3>Totales:</h3>
                  <p>
                    Subtotal: <span>${cotizacion.subtotal.toFixed(2)}</span>
                  </p>
                  <p>
                    Descuento: <span>-${cotizacion.descuento.toFixed(2)}</span>
                  </p>
                  <p className="cotizacion-total">
                    Total: <strong>${cotizacion.total.toFixed(2)}</strong>
                  </p>
                </div>

                <button className="btn-borrar" onClick={handleBorrarCotizacion}>
                  🗑️ Borrar cotización
                </button>
              </div>
            )}
          </article>
        </div>
      ) : (
        <article className="sin-cotizacion">
          <img
            className="imgservioct2"
            src="https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png"
            alt="Sumak Clean Logo"
          />
          <h2>Genial, ¡empecemos!</h2>
          <h3>Paso 1: Elige tu servicio</h3>

          <div className="opciones-cotizacion">
            <Link to="/pacmesual" className="pimrcoti">
              <img
                className="imgservioct"
                src="https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png"
                alt="Sumak Clean Logo"
              />

              <p>Cotizar plan mesual</p>
            </Link>
            <Link to="/cotisamanual" className="pimrcoti">
              <img
                className="imgservioct"
                src="https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png"
                alt="Sumak Clean Logo"
              />

              <p>Cotizar cita</p>
            </Link>
          </div>

          <p className="nota-cotizacion">
            Todos nuestros servicios son personalizados. Para obtener un
            presupuesto preciso, por favor completa el formulario de cotización.
            ¡Gracias por elegir Sumak!
          </p>
        </article>
      )}
    </section>
  );
};

export default Booking;
