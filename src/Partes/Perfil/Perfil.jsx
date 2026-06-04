import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../ulidades/AuthContext";
import AuthGate from "../Agenda/AuthGate";

const SOPORTE_WSP = "593963200325";

const Perfil = () => {
  const { user, perfil, loading, cerrarSesion, actualizarPerfil } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: "", apellido: "", celular: "" });
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modal, setModal] = useState(null); // { tipo: 'exito' | 'error', texto }

  useEffect(() => {
    if (perfil) {
      setForm({
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "",
        celular: perfil.celular || "",
      });
    }
  }, [perfil]);

  if (loading) {
    return (
      <div className="tomdatos-container">
        <p className="tomdatos-msg">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthGate />;
  }

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.celular) {
      setModal({ tipo: "error", texto: "Completa todos los campos." });
      return;
    }
    setGuardando(true);
    try {
      await actualizarPerfil(form);
      setEditando(false);
      setModal({ tipo: "exito", texto: "Tus datos se actualizaron correctamente." });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setModal({ tipo: "error", texto: "No se pudo guardar. Inténtalo de nuevo." });
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    navigate("/");
  };

  const handleCancelar = () => {
    if (perfil) {
      setForm({
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "",
        celular: perfil.celular || "",
      });
    }
    setEditando(false);
  };

  const handleSoporte = () => {
    const texto = encodeURIComponent("Hola, necesito ayuda con mi cuenta Sumak");
    window.open(`https://wa.me/${SOPORTE_WSP}?text=${texto}`, "_blank");
  };

  return (
    <div className="tomdatos-container">
      <div className="tomdatos-card">
        <h2 className="tomdatos-title">Mi perfil</h2>
        <p className="tomdatos-subtitle">
          Revisa y actualiza tus datos personales.
        </p>

        <form className="tomdatos-form" onSubmit={handleGuardar}>
          <div className="tomdatos-field">
            <label className="tomdatos-label">Nombre</label>
            {editando ? (
              <input
                type="text"
                className="tomdatos-input"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            ) : (
              <p className="perfil-valor">{form.nombre || "—"}</p>
            )}
          </div>

          <div className="tomdatos-field">
            <label className="tomdatos-label">Apellido</label>
            {editando ? (
              <input
                type="text"
                className="tomdatos-input"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
            ) : (
              <p className="perfil-valor">{form.apellido || "—"}</p>
            )}
          </div>

          <div className="tomdatos-field">
            <label className="tomdatos-label">Celular</label>
            {editando ? (
              <input
                type="tel"
                className="tomdatos-input"
                value={form.celular}
                onChange={(e) => setForm({ ...form, celular: e.target.value })}
              />
            ) : (
              <p className="perfil-valor">{form.celular || "—"}</p>
            )}
          </div>

          <div className="tomdatos-field">
            <label className="tomdatos-label">Correo</label>
            <p className="perfil-valor">{perfil?.correo || "—"}</p>
          </div>

          {editando ? (
            <>
              <button type="submit" className="auth-btn" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="auth-btn auth-btn--secondary"
                onClick={handleCancelar}
                disabled={guardando}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              className="auth-btn"
              onClick={() => setEditando(true)}
            >
              Actualizar datos
            </button>
          )}
        </form>

        <div className="perfil-actions">
          <button
            type="button"
            className="auth-btn auth-btn--secondary"
            onClick={handleSoporte}
          >
            Contactar soporte
          </button>
          <button
            type="button"
            className="auth-btn auth-btn--secondary"
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="tm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              className={`tm-modal tm-modal--${modal.tipo}`}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="tm-modal__title">
                {modal.tipo === "exito" ? "¡Listo!" : "Atención"}
              </h3>
              <p className="tm-modal__text">{modal.texto}</p>
              <button className="auth-btn" onClick={() => setModal(null)}>
                Aceptar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Perfil;
