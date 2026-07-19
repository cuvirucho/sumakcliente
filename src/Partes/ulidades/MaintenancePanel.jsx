import React from "react";
import { useSystemConfig } from "./SystemConfigContext";
import { useAuth } from "./AuthContext";

// Panel profesional a pantalla completa que cubre la web cuando el sistema entra
// en mantenimiento (nivel ≥ 90 del presupuesto, o un override manual del admin).
//
// Conservador (FAIL-OPEN): solo se muestra cuando `config/system` CONFIRMA
// `maintenance:true`. En el estado de arranque (todo habilitado) o ante un fallo
// de lectura NO bloquea, evitando dejar fuera a los usuarios por un estado
// desconocido.
//
// El STAFF (admin/trabajador) NUNCA es bloqueado: necesita entrar para
// desactivar el mantenimiento y operar durante la ventana.
export default function MaintenancePanel() {
  const { presentacion } = useSystemConfig();
  const { perfil } = useAuth();

  const esStaff = perfil?.admin === true || perfil?.trabajador === true;
  if (!presentacion.maintenance || esStaff) return null;

  const accent = presentacion.color || "var(--clr-gold)";

  return (
    <div style={estilos.overlay} role="alertdialog" aria-modal="true">
      <div style={estilos.card}>
        <div style={{ ...estilos.iconWrap, borderColor: accent }}>
          <span style={{ ...estilos.icon, color: accent }}>🛠️</span>
        </div>
        <h1 style={estilos.title}>{presentacion.title}</h1>
        <p style={estilos.message}>{presentacion.message}</p>
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
