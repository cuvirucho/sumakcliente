import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AuthGate from "./AuthGate";
import { useAuth } from "../ulidades/AuthContext";
import { cloudinaryOptimized } from "../ulidades/cloudinary";

// Selector de entrada: el usuario elige entre un plan mensual o agendar una
// cita puntual. "Agendar cita" lleva al asistente de cotización (/cotisamanual).
const Booking = () => {
  const { user } = useAuth();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return <AuthGate />;
  }

  return (
    <section className="booking-section">
      <article className="sin-cotizacion">
        <img
          className="imgservioct2"
          src={cloudinaryOptimized(
            "https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png",
            { w: 480 },
          )}
          alt="Sumak Clean Logo"
          decoding="async"
        />
        <h2>Genial, ¡empecemos!</h2>
        <h3>Paso 1: Elige tu servicio</h3>

        <div className="opciones-cotizacion">
          <Link to="/pacmesual" className="pimrcoti">
            <img
              className="imgservioct"
              src={cloudinaryOptimized(
                "https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png",
                { w: 320 },
              )}
              alt="Sumak Clean Logo"
              loading="lazy"
              decoding="async"
            />
            <p>Cotizar plan mensual</p>
          </Link>
          <Link to="/cotisamanual" className="pimrcoti">
            <img
              className="imgservioct"
              src={cloudinaryOptimized(
                "https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png",
                { w: 320 },
              )}
              alt="Sumak Clean Logo"
              loading="lazy"
              decoding="async"
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
