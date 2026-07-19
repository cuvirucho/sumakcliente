// Cobertura geográfica — candado de acceso "solo Cuenca" (web).
//
// SINGLETON: un único estado de cobertura para toda la app, con caché en
// localStorage para evitar re-preguntar/re-consultar en cada carga. Cualquier
// parte consulta el estado con `obtenerEstado()` de forma síncrona, o se
// suscribe con `suscribir()`. Espeja el patrón de `systemConfig.js`.
//
// FAIL-OPEN: el estado solo pasa a `'fuera'` cuando se CONFIRMA que el usuario
// está lejos de Cuenca (por GPS) o en otro país (por IP). Ante cualquier duda
// —permiso negado, IP ambigua, error de red— se deja pasar. Nunca se bloquea a
// un usuario por un estado desconocido.
//
// Detección: GPS del navegador primero (preciso a nivel de ciudad). Si el
// usuario niega el permiso, falla o expira, se cae a un respaldo por IP que
// solo bloquea cuando el país es distinto de Ecuador (la IP no distingue Cuenca
// de otras ciudades de forma fiable).

// Centro de Cuenca, Ecuador. Mismo valor que `CENTRO_DEFECTO` en
// CotizadorWizard.jsx (el mapa del cotizador).
const CUENCA_CENTRO = { lat: -2.9001, lng: -79.0059 };
const RADIO_KM = 20;

const CACHE_KEY = "sumak_cobertura";
const TTL_MS = 6 * 60 * 60 * 1000; // 6 h

// Estados posibles: 'desconocido' (inicial) · 'permitido' · 'fuera'.

// ── Geometría ────────────────────────────────────────────────────────────────
// Distancia en km entre dos coordenadas (fórmula de Haversine).
function distanciaKm(a, b) {
  const R = 6371;
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ── Detección ────────────────────────────────────────────────────────────────
// GPS del navegador. Reutiliza el patrón de `obtenerGPS()` en CotizadorWizard.
// Devuelve 'permitido' | 'fuera' si el usuario concede el permiso, o `null` si
// no se pudo obtener (sin API, permiso negado, timeout o error) → cae a IP.
function detectarPorGPS() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanciaKm(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          CUENCA_CENTRO,
        );
        resolve(d <= RADIO_KM ? "permitido" : "fuera");
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

// Respaldo por IP (geo-IP gratuito, sin API key). Endpoint swappable.
// Solo bloquea cuando el país es distinto de Ecuador; en cualquier otro caso
// (Ecuador, respuesta rara o fallo de red) deja pasar (fail-open).
async function detectarPorIP() {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    if (data && data.success && typeof data.country_code === "string") {
      return data.country_code.toUpperCase() === "EC" ? "permitido" : "fuera";
    }
    return "permitido";
  } catch {
    return "permitido";
  }
}

// ── Estado del singleton ─────────────────────────────────────────────────────
function leerCache() {
  try {
    const raw = window?.localStorage?.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function escribirCache(estado) {
  try {
    window?.localStorage?.setItem(
      CACHE_KEY,
      JSON.stringify({ estado, ts: Date.now() }),
    );
  } catch {
    /* localStorage lleno/no disponible: la caché es best-effort. */
  }
}

function cacheFresca(c) {
  return (
    c &&
    (c.estado === "permitido" || c.estado === "fuera") &&
    Date.now() - c.ts < TTL_MS
  );
}

// Hidratación síncrona desde caché (localStorage es síncrono): si hay un
// veredicto reciente, se usa de inmediato (el overlay puede aparecer sin
// esperar a la red). Un veredicto vencido no bloquea hasta re-confirmar.
const cacheInicial = leerCache();
let estadoActual = cacheFresca(cacheInicial) ? cacheInicial.estado : "desconocido";
const listeners = new Set();
let evaluando = false;

function notificar() {
  for (const fn of listeners) {
    try {
      fn(estadoActual);
    } catch (e) {
      console.error("[cobertura] listener:", e);
    }
  }
}

function aplicarEstado(estado) {
  estadoActual = estado;
  escribirCache(estado);
  notificar();
}

// Ejecuta la detección (GPS → IP) una vez por ventana de TTL. Idempotente: si
// ya hay un veredicto reciente en caché o una evaluación en curso, no hace nada.
export async function evaluarCobertura() {
  if (evaluando) return;
  if (cacheFresca(leerCache())) return;
  evaluando = true;
  try {
    let estado = await detectarPorGPS();
    if (estado == null) estado = await detectarPorIP();
    aplicarEstado(estado);
  } catch (e) {
    // Fail-open: ante un error inesperado no bloqueamos.
    console.error("[cobertura] evaluación falló (fail-open):", e);
  } finally {
    evaluando = false;
  }
}

export function obtenerEstado() {
  return estadoActual;
}

export function suscribir(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
