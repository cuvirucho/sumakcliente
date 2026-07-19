// Protección de costos (FinOps) — servicio de configuración compartido (web).
//
// SINGLETON: un único onSnapshot sobre `config/system` para toda la app, con
// caché en localStorage para primer pintado y modo offline. Cualquier parte de
// la app consulta el estado con `obtenerConfig()` de forma síncrona, o se
// suscribe a los cambios con `suscribir()`.
//
// El documento `config/system` guarda `nivel` (0..100, lo pone el bot del
// presupuesto) y `overrides` (mapa, lo pone el admin). Los flags EFECTIVOS se
// derivan con `resolverConfig` — la MISMA lógica que corre en el servidor
// (functions/src/systemConfig.js) y en la app móvil (SumakApp). Mantener las
// tres copias en sincronía.
//
// FAIL-OPEN: hasta que el primer snapshot confirme lo contrario, se asume TODO
// habilitado y SIN mantenimiento. Nunca se bloquea la app por un estado
// desconocido ni por un fallo de lectura.

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

const CACHE_KEY = "sumak_systemConfig";

export const NIVELES = {
  NORMAL: 0,
  AVISO: 80,
  MANTENIMIENTO: 90,
  EMERGENCIA: 95,
  CRITICO: 100,
};

export const FLAGS_HABILITADOS = {
  maintenance: false,
  reservationsEnabled: true,
  streamingEnabled: true,
  notificationsEnabled: true,
  allowNewUsers: true,
  aiEnabled: true,
  storageUploadsEnabled: true,
  schedulerEnabled: true,
  reportsEnabled: true,
  allowPayments: true,
};

// Política pura nivel → flags. Monótona. DEBE coincidir con el servidor.
export function politicaDeNivel(nivel) {
  const f = { ...FLAGS_HABILITADOS };
  const n = Number(nivel) || 0;
  if (n >= NIVELES.MANTENIMIENTO) {
    f.maintenance = true;
    f.reservationsEnabled = false;
    f.streamingEnabled = false;
    f.allowNewUsers = false;
  }
  if (n >= NIVELES.EMERGENCIA) {
    f.notificationsEnabled = false;
    f.aiEnabled = false;
    f.storageUploadsEnabled = false;
    f.schedulerEnabled = false;
    f.reportsEnabled = false;
  }
  if (n >= NIVELES.CRITICO) {
    f.allowPayments = false;
  }
  return f;
}

export function resolverConfig(nivel, overrides) {
  const base = politicaDeNivel(nivel);
  const ov = overrides && typeof overrides === "object" ? overrides : {};
  return { ...base, ...ov, nivel: Number(nivel) || 0 };
}

function derivarPresentacion(raw, flags) {
  const nivel = flags.nivel || 0;
  const critico = nivel >= NIVELES.CRITICO;
  return {
    nivel,
    maintenance: flags.maintenance === true,
    title:
      raw?.maintenanceTitle ||
      (critico ? "Servicio temporalmente limitado" : "Estamos en mantenimiento"),
    message:
      raw?.maintenanceMessage ||
      (critico
        ? "El servicio está temporalmente limitado. Puedes seguir consultando tu perfil e historial; las operaciones nuevas se reanudarán muy pronto."
        : "Estamos realizando mantenimiento temporal para garantizar la estabilidad del servicio. Volveremos enseguida."),
    image: raw?.maintenanceImage || null,
    color: raw?.maintenanceColor || null,
  };
}

// ── Estado del singleton ────────────────────────────────────────────────────
function leerCache() {
  try {
    const raw = window?.localStorage?.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function escribirCache(raw) {
  try {
    window?.localStorage?.setItem(CACHE_KEY, JSON.stringify(raw));
  } catch (_) {
    /* localStorage lleno/no disponible: la caché es best-effort. */
  }
}

// Hidratación síncrona desde caché (localStorage es síncrono).
const cacheInicial = leerCache();
let flagsActuales = cacheInicial
  ? resolverConfig(cacheInicial.nivel, cacheInicial.overrides)
  : resolverConfig(0, {});
let presentacionActual = derivarPresentacion(cacheInicial, flagsActuales);
const listeners = new Set();
let unsub = null;
let iniciado = false;

function notificar() {
  for (const fn of listeners) {
    try {
      fn(flagsActuales, presentacionActual);
    } catch (e) {
      console.error("[systemConfig] listener:", e);
    }
  }
}

function aplicarDoc(raw) {
  flagsActuales = resolverConfig(raw?.nivel, raw?.overrides);
  presentacionActual = derivarPresentacion(raw, flagsActuales);
  notificar();
}

export function iniciarSystemConfig() {
  if (iniciado) return;
  iniciado = true;
  unsub = onSnapshot(
    doc(db, "config", "system"),
    (snap) => {
      const raw = snap.exists() ? snap.data() : {};
      aplicarDoc(raw);
      escribirCache(raw);
    },
    (e) => {
      // Fail-open: conservamos el último bueno conocido.
      console.error("[systemConfig] no se pudo leer config/system:", e);
    },
  );
}

export function obtenerConfig() {
  return flagsActuales;
}

export function obtenerPresentacion() {
  return presentacionActual;
}

export function puedeOperar(flag) {
  return flagsActuales[flag] !== false;
}

export function suscribir(fn) {
  iniciarSystemConfig();
  listeners.add(fn);
  return () => listeners.delete(fn);
}
