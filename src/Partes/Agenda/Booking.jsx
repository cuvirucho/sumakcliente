import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// Selector de entrada: el usuario elige entre un plan mensual o agendar una
// cita puntual. "Agendar cita" lleva al asistente de cotización (/cotisamanual).
const Booking = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="booking-section">
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
            <p>Cotizar plan mensual</p>
          </Link>
          <Link to="/cotisamanual" className="pimrcoti">
            <img
              className="imgservioct"
              src="https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png"
              alt="Sumak Clean Logo"
            />
            <p>Agendar cita</p>
          </Link>
        </div>

        <p className="nota-cotizacion">
          Todos nuestros servicios son personalizados. Para obtener un
          presupuesto preciso, por favor completa el formulario de cotización.
          ¡Gracias por elegir Sumak!
        </p>
      </article>
    </section>
  );
};

export default Booking;
