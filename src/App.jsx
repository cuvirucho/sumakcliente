import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Partes/Pantalpirciapl/Home';
import Booking from './Partes/Agenda/Booking';
import Appointments from './Partes/Agenda/Appointments';
import Navbar from './Partes/ulidades/Navbar';
import Footer from './Partes/ulidades/Footer';
import Homeia from './ia/Homeia';
import CotizadorWizard from './Partes/Agenda/CotizadorWizard';
import Homeplamensual from './Planmseual/Homeplamensual';
import ViewStream from './pages/ViewStream';
import Perfil from './Partes/Perfil/Perfil';

function App() {
  const [appointments, setAppointments] = useState([]);

  const addAppointment = (appointment) => {
    setAppointments([...appointments, appointment]);
  };

  return (
    <div className='contemaster'   >   
      {/* Navbar siempre visible */}
      <Navbar />

      {/* Aquí van solo las rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendar" element={<Booking addcita={addAppointment} />} />
        <Route path="/pacmesual" element={<Homeplamensual addcita={addAppointment} />} />
        <Route path="/cotisamanual" element={<CotizadorWizard />} />

        <Route path="/miscitas" element={<Appointments appointments={appointments} />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/view/:turnoId" element={<ViewStream />} />
      </Routes>

      {/* Footer siempre visible */}
      <Footer />
    </div>
  );
}

export default App;
