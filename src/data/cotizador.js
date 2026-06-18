// src/data/cotizador.js
// Datos y helpers del cotizador. Compartidos por el asistente de agendamiento.
// Mismos catálogos que usa la app móvil (servicios, extras, adicionales, tipos).

export const services = [
  {
    id: 1,
    title: "Limpieza de Hogares",
    description: "Transforma tu hogar en un espacio impecable y acogedor.",
    Precios: [
      { size: "Pequeño (1-4 habitaciones)", price: 38 },
      { size: "Mediano (5-8 habitaciones)", price: 56 },
      { size: "Grande (9-12 habitaciones)", price: 95 },
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
      { size: "Grande (16-19 empleados)", price: 150 },
      { size: "Personalizado (20+ empleados)", price: "varia" },
    ],
  },
  {
    id: 3,
    title: "Limpieza de Restaurantes",
    description:
      "Cumple con los estándares de higiene y seguridad alimentaria.",
    Precios: [
      { size: "Pequeño (1-4 mesas)", price: 38 },
      { size: "Mediano (5-8 mesas)", price: 56 },
      { size: "Grande (9-13 mesas)", price: 120 },
      { size: "Personalizado (18+ mesas)", price: "varia" },
    ],
  },
  {
    id: 4,
    title: "Limpieza de Airbnb",
    description:
      "Deja tu propiedad lista para recibir nuevos huéspedes, impecable y acogedora.",
    Precios: [
      { size: "Estudio / 1 habitación", price: 40 },
      { size: "2-3 habitaciones", price: 65 },
      { size: "4-6 habitaciones", price: 100 },
      { size: "Personalizado (7+ habitaciones)", price: "varia" },
    ],
  },
];

export const extras = [
  { id: 1, name: "Profunda Master", percentage: 0.2 },
  { id: 2, name: "Profunda VIP", percentage: 0.38 },
];

export const adicionales = [
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

  // ── Solo Airbnb ───────────────────────────────────────────────
  {
    id: 14,
    name: "Cambio de sábanas y toallas",
    price: 15,
    apto: "Airbnb",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/habitacion_extra_sumak_ozv6tn.png",
  },
  {
    id: 15,
    name: "Reposición de amenities (jabón, papel, etc.)",
    price: 12,
    apto: "Airbnb",
    image:
      "https://res.cloudinary.com/db8e98ggo/image/upload/v1766896351/aromatizacion_sumak_uxyqzq.png",
  },
  {
    id: 16,
    name: "Lavado de ropa de cama y blancos",
    price: 20,
    apto: "Airbnb",
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

export const tiposLimpieza = [
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

// Estados de turnos que NO ocupan agenda (ya no cuentan para solapamientos).
export const ESTADOS_INACTIVOS = [
  "cancelada",
  "completada",
  "cancelado",
  "completado",
];

// Jornada del operario (horas en punto): 08:00 a 17:00.
export const HORA_INICIO = 8;
export const HORA_FIN = 17;

// Duración (en horas) de un servicio según su tipo de limpieza.
export function duracionDeTipo(nombreTipo) {
  if (nombreTipo === "Profunda VIP") return 4;
  if (nombreTipo === "Profunda Master") return 3;
  return 2; // Normal
}

// Convierte 'HH:MM' a la hora en punto (entero). Ignora los minutos.
export function horaANumero(hora) {
  const h = parseInt(String(hora || "").split(":")[0], 10);
  return isNaN(h) ? null : h;
}

// Mapea el título de un servicio al "lugar" usado para filtrar adicionales.
export function lugarDeServicio(title = "") {
  if (title.includes("Hogar")) return "Hogares";
  if (title.includes("Oficina")) return "Oficinas";
  if (title.includes("Restaurante")) return "Restaurantes";
  if (title.includes("Airbnb")) return "Airbnb";
  return "";
}

// Claves del horario de cada trabajador, indexadas por Date.getDay() (0 = dom).
export const DIAS_SEMANA = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];

// ¿Cabe un turno en el bloque [inicio, inicio+dur) según la capacidad de
// trabajadores? Comparte la misma fórmula que usa la app móvil.
//   - inicio: hora de inicio (entero, en punto)
//   - dur: duración del turno en horas
//   - diaKey: clave del día ("lun", "mar", …) de la fecha elegida
//   - ocupadas: intervalos ocupados [{ inicio, fin, asignadoA }]
//   - trabajadores: [{ uid, horario }] (vacío => fallback de solape simple)
export function bloqueTieneCupo({ inicio, dur, diaKey, ocupadas, trabajadores }) {
  const fin = inicio + dur;
  const solapados = ocupadas.filter((o) => inicio < o.fin && o.inicio < fin);

  // Fallback: sin datos de trabajadores, cualquier turno solapado ocupa.
  if (!trabajadores || trabajadores.length === 0) {
    return solapados.length === 0;
  }

  // Trabajadores en jornada ese día/hora (el bloque cabe en su horario).
  const enTurno = trabajadores.filter((w) => {
    const h = w.horario?.[diaKey];
    const iW = horaANumero(h?.inicio);
    const fW = horaANumero(h?.fin);
    return h?.activo && iW != null && fW != null && inicio >= iW && fin <= fW;
  });

  // Cuántos de ellos ya tienen un turno asignado solapado.
  const ocupadosAsignados = enTurno.filter((w) =>
    solapados.some((o) => o.asignadoA === w.uid),
  ).length;

  // Turnos solapados sin asignar (o asignados a alguien que no es trabajador):
  // cada uno consume un cupo genérico.
  const sinAsignar = solapados.filter(
    (o) => !o.asignadoA || !trabajadores.some((w) => w.uid === o.asignadoA),
  ).length;

  return enTurno.length - ocupadosAsignados - sinAsignar > 0;
}
