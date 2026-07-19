import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { evaluarCobertura, obtenerEstado, suscribir } from "./coberturaService";

// Candado de acceso a pantalla completa que cubre la web cuando se CONFIRMA que
// el usuario está fuera de Cuenca (ver `coberturaService.js`). Calca el patrón
// de `MaintenancePanel.jsx`.
//
// FAIL-OPEN: solo se muestra cuando el estado es `'fuera'`. En el arranque
// (`'desconocido'`) o cuando no se puede confirmar la ubicación NO bloquea.
//
// El STAFF (admin/trabajador) NUNCA es bloqueado: puede operar desde cualquier
// lugar (igual que en el modo mantenimiento).
export default function CoberturaGate() {
  const { perfil } = useAuth();
  const [estado, setEstado] = useState(obtenerEstado);

  useEffect(() => {
    setEstado(obtenerEstado());
    const off = suscribir(setEstado);
    // Dispara la detección en segundo plano; la app se renderiza normalmente
    // mientras tanto (no daña el LCP).
    evaluarCobertura();
    return off;
  }, []);

  const esStaff = perfil?.admin === true || perfil?.trabajador === true;
  if (estado !== "fuera" || esStaff) return null;

  return (
    <div style={estilos.overlay} role="alertdialog" aria-modal="true">
      <div style={estilos.card}>
        <div style={estilos.iconWrap}>
          <span style={estilos.icon}>📍</span>
        </div>
        <h1 style={estilos.title}>Sumak no llega todavía a tu ciudad</h1>
        <p style={estilos.message}>
          Por ahora nuestro servicio está disponible únicamente en Cuenca,
          Ecuador. Estamos ampliando nuestra cobertura y muy pronto podríamos
          llegar a tu zona. ¡Gracias por tu interés en Sumak!
        </p>
      </div>
    </div>
  );
}

const estilos = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--space-5)",
    background: "var(--clr-obsidian)",
  },
  card: {
    maxWidth: 460,
    width: "100%",
    textAlign: "center",
    background: "var(--clr-charcoal)",
    border: "1px solid var(--clr-border)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-7) var(--space-6)",
    boxShadow: "var(--shadow-lg)",
  },
  iconWrap: {
    width: 84,
    height: 84,
    margin: "0 auto var(--space-5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-full)",
    border: "2px solid var(--clr-gold)",
    background: "var(--clr-slate)",
  },
  icon: { fontSize: 38, lineHeight: 1 },
  title: {
    fontFamily: "var(--ff-display)",
    fontSize: "var(--fs-2xl)",
    color: "var(--clr-pearl)",
    margin: "0 0 var(--space-4)",
    letterSpacing: "var(--ls-tight)",
  },
  message: {
    fontFamily: "var(--ff-body)",
    fontSize: "var(--fs-sm)",
    lineHeight: "var(--lh-normal)",
    color: "var(--clr-text-muted)",
    margin: 0,
  },
};
