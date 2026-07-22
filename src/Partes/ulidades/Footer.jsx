import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import {
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { cloudinaryOptimized } from "./cloudinary";
import { useAuth } from "./AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img
            className="footer__logo"
            src={cloudinaryOptimized(
              "https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png",
              { w: 240 },
            )}
            alt="Sumak Clean"
            loading="lazy"
            decoding="async"
          />
          <p className="footer__tagline">
            Limpieza profesional para tu espacio.
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="footer__social-link" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <FaFacebookF />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Servicios</h4>
          <ul className="footer__list">
            <li>
              <Link to="/agendar" className="footer__list-link">
                Limpieza de Hogares
              </Link>
            </li>
            <li>
              <Link to="/agendar" className="footer__list-link">
                Limpieza de Oficinas
              </Link>
            </li>
            <li>
              <Link to="/agendar" className="footer__list-link">
                Limpieza de Restaurantes
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Empresa</h4>
          <ul className="footer__list">
            <li>
              <Link to="/" className="footer__list-link">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/cotisamanual" className="footer__list-link">
                Cotizador
              </Link>
            </li>
            <li>
              <Link to="/pacmesual" className="footer__list-link">
                Planes Mensuales
              </Link>
            </li>
            <li>
              <Link to="/miscitas" className="footer__list-link">
                Mis Citas
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Contacto</h4>
          <p className="footer__contact-item">
            <IoCallOutline /> +593 963 200 325
          </p>
          <p className="footer__contact-item">
            <IoMailOutline /> sumakclean@gmail.com
          </p>
          <p className="footer__contact-item">
            <IoLocationOutline /> Ecuador
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © 2025 Sumak Clean. Todos los derechos reservados.
        </p>
        <Link to="/terminos" className="footer__legal-link">
          Términos y Condiciones
        </Link>
        <Link to="/politica-privacidad" className="footer__legal-link">
          Política de Privacidad
        </Link>
        {user && (
          <Link to="/eliminar-cuenta" className="footer__legal-link">
            Eliminar mi cuenta
          </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
