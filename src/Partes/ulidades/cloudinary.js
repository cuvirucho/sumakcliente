// Optimización de imágenes de Cloudinary sin cambiar el diseño: inyecta
// `f_auto,q_auto` (formato y calidad automáticos → WebP/AVIF cuando el navegador
// los soporta) y un ancho opcional `w_N` justo después de `/upload/`. Cualquier
// URL que no sea de Cloudinary (o ya optimizada) se devuelve intacta.
export function cloudinaryOptimized(url, { w } = {}) {
  if (typeof url !== "string" || !url.includes("/upload/")) return url;
  // Evita duplicar transformaciones si ya se aplicaron.
  if (/\/upload\/[^/]*(f_auto|q_auto)/.test(url)) return url;
  const t = ["f_auto", "q_auto"];
  if (w) t.push(`w_${w}`);
  return url.replace("/upload/", `/upload/${t.join(",")}/`);
}
