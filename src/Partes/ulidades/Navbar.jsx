import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  IoHomeOutline,
  IoCalendarNumberOutline,
  IoListOutline,
  IoPersonOutline,
  IoMenu,
  IoClose,
} from "react-icons/io5";
import { cloudinaryOptimized } from "./cloudinary";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img
          className="navbar__logo-img"
          src={cloudinaryOptimized(
            "https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png",
            { w: 240 },
          )}
          alt="Sumak Clean"
          decoding="async"
        />
      </div>

      <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <IoClose /> : <IoMenu />}
      </button>

      <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            `navbar__link${isActive ? " navbar__link--active" : ""}`
          }
        >
          <IoHomeOutline className="navbar__link-icon" />
          Inicio
        </NavLink>

        <NavLink
          to="/agendar"
          onClick={closeMenu}
          className={({ isActive }) =>
            `navbar__link${isActive ? " navbar__link--active" : ""}`
          }
        >
          <IoCalendarNumberOutline className="navbar__link-icon" />
          Agendar
        </NavLink>

        <NavLink
          to="/miscitas"
          onClick={closeMenu}
          className={({ isActive }) =>
            `navbar__link${isActive ? " navbar__link--active" : ""}`
          }
        >
          <IoListOutline className="navbar__link-icon" />
          Mis citas
        </NavLink>

        <NavLink
          to="/perfil"
          onClick={closeMenu}
          className={({ isActive }) =>
            `navbar__link${isActive ? " navbar__link--active" : ""}`
          }
        >
          <IoPersonOutline className="navbar__link-icon" />
          Perfil
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
