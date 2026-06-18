import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Calendario de mes simple. Devuelve la fecha como 'AAAA-MM-DD'.
// Equivalente web del CalendarioMes de la app móvil.

const DIAS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// 'AAAA-MM-DD' local (sin desfase de zona horaria).
const aISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const CalendarioMes = ({ value, onChange }) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Mes mostrado: el de la fecha elegida, o el actual.
  const inicial = value ? new Date(`${value}T00:00:00`) : hoy;
  const [cursor, setCursor] = useState(
    new Date(inicial.getFullYear(), inicial.getMonth(), 1),
  );

  const anio = cursor.getFullYear();
  const mes = cursor.getMonth();

  // Día de semana del 1 del mes con Lunes = 0.
  const primerDia = new Date(anio, mes, 1).getDay(); // Dom=0
  const offset = (primerDia + 6) % 7; // Lun=0
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();

  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

  const irMes = (delta) => setCursor(new Date(anio, mes + delta, 1));

  const mesActual =
    anio === hoy.getFullYear() && mes === hoy.getMonth();

  return (
    <div className="cal-mes">
      <div className="cal-mes-head">
        <button
          type="button"
          className="cal-mes-nav"
          onClick={() => irMes(-1)}
          disabled={mesActual}
          aria-label="Mes anterior"
        >
          <IoChevronBack />
        </button>
        <span className="cal-mes-titulo">
          {MESES[mes]} {anio}
        </span>
        <button
          type="button"
          className="cal-mes-nav"
          onClick={() => irMes(1)}
          aria-label="Mes siguiente"
        >
          <IoChevronForward />
        </button>
      </div>

      <div className="cal-mes-grid cal-mes-dows">
        {DIAS.map((d) => (
          <span key={d} className="cal-mes-dow">
            {d}
          </span>
        ))}
      </div>

      <div className="cal-mes-grid">
        {celdas.map((d, i) => {
          if (d === null) return <span key={`e-${i}`} className="cal-mes-dia vacio" />;
          const fecha = new Date(anio, mes, d);
          const iso = aISO(fecha);
          const pasado = fecha < hoy;
          const sel = value === iso;
          return (
            <button
              key={iso}
              type="button"
              className={`cal-mes-dia${sel ? " sel" : ""}`}
              disabled={pasado}
              onClick={() => onChange(iso)}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarioMes;
