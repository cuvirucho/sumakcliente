// src/Partes/ulidades/geocoding.js
// Geocodificación con Nominatim (OpenStreetMap). Gratuito, sin API key.
// Política de uso: máx ~1 req/seg. Las llamadas desde la UI usan debounce.

const BASE = "https://nominatim.openstreetmap.org";

// Toma de un resultado de Nominatim el nombre de la ciudad,
// probando los distintos campos donde OSM la puede colocar.
const extraerCiudad = (address = {}) =>
  address.city ||
  address.town ||
  address.village ||
  address.county ||
  address.state_district ||
  address.state ||
  "";

// coordenadas -> { direccion, ciudad }
export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `${BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es&zoom=18&addressdetails=1`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return { direccion: "", ciudad: "" };
    const data = await res.json();
    return {
      direccion: data.display_name || "",
      ciudad: extraerCiudad(data.address),
    };
  } catch {
    return { direccion: "", ciudad: "" };
  }
};

// texto + { lat, lng, ciudad } -> [{ display_name, lat, lng, ciudad }]
// Búsqueda de texto libre (q=) acotada a Ecuador, con recuadro de proximidad
// alrededor del usuario y filtro de ciudad de refuerzo.
export const buscarDirecciones = async (texto, opciones = {}) => {
  const q = texto.trim();
  if (q.length < 3) return [];
  const { lat, lng, ciudad } = opciones;
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      addressdetails: "1",
      limit: "8",
      countrycodes: "ec",
      "accept-language": "es",
      q,
    });
    // Recuadro de proximidad (~±0.12° ≈ 13 km) alrededor del usuario si lo tenemos.
    if (lat != null && lng != null) {
      const d = 0.12;
      params.set("viewbox", `${lng - d},${lat + d},${lng + d},${lat - d}`);
      params.set("bounded", "1");
    }
    const res = await fetch(`${BASE}/search?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    let resultados = data.map((d) => ({
      display_name: d.display_name,
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
      ciudad: extraerCiudad(d.address),
    }));
    // Refuerzo por ciudad, solo si deja >=1 resultado.
    if (ciudad) {
      const c = ciudad.trim().toLowerCase();
      const filtrados = resultados.filter(
        (r) =>
          (r.ciudad && r.ciudad.toLowerCase().includes(c)) ||
          r.display_name.toLowerCase().includes(c),
      );
      if (filtrados.length > 0) resultados = filtrados;
    }
    return resultados;
  } catch {
    return [];
  }
};
