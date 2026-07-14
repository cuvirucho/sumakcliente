import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Partes/Pantalpirciapl/Home';
import Navbar from './Partes/ulidades/Navbar';
import Footer from './Partes/ulidades/Footer';

// Rutas cargadas bajo demanda (code-splitting): sacan del bundle inicial las
// dependencias pesadas que solo usa cada pantalla — Leaflet (CotizadorWizard),
// WebRTC (ViewStream), qrcode + confetti (Appointments) y el contenido legal.
// Home queda eager por ser la landing (mejor LCP).
const Booking = lazy(() => import('./Partes/Agenda/Booking'));
const Appointments = lazy(() => import('./Partes/Agenda/Appointments'));
const CotizadorWizard = lazy(() => import('./Partes/Agenda/CotizadorWizard'));
const Homeplamensual = lazy(() => import('./Planmseual/Homeplamensual'));
const ViewStream = lazy(() => import('./pages/ViewStream'));
const Perfil = lazy(() => import('./Partes/Perfil/Perfil'));
const PoliticaPrivacidad = lazy(() => import('./Partes/Legal/PoliticaPrivacidad'));
const Terminos = lazy(() => import('./Partes/Legal/Terminos'));

// Fallback ligero mientras carga el chunk de la ruta. Ocupa el alto de la
// ventana para evitar saltos de layout (CLS) y no dejar la pantalla en blanco.
const RutaCargando = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <p className="empty">Cargando…</p>
  </div>
);

function App() {
  return (
    <div className='contemaster'   >
      {/* Navbar siempre visible */}
      <Navbar />

      {/* Aquí van solo las rutas */}
      <Suspense fallback={<RutaCargando />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendar" element={<Booking />} />
          <Route path="/pacmesual" element={<Homeplamensual />} />
          <Route path="/cotisamanual" element={<CotizadorWizard />} />

          <Route path="/miscitas" element={<Appointments />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/view/:turnoId" element={<ViewStream />} />
        </Routes>
      </Suspense>

      {/* Footer siempre visible */}
      <Footer />
    </div>
  );
}

export default App;
