import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img
          className="navbar__logo-img"
          src="https://res.cloudinary.com/db8e98ggo/image/upload/v1760676135/web_indeitidad_digitla_videos_ads_servison_plkukt.png"
          alt="Sumak Clean Logo"
        />
      </div>
      <div className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/agendar"
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
        >
          Agendar
        </NavLink>
        <NavLink
          to="/miscitas"
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
        >
          Mis citas
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
