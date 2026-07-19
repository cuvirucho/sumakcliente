import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../ulidades/AuthContext";

// Correo con formato básico válido.
const esCorreoValido = (correo) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

// Normaliza el celular quitando espacios, guiones y paréntesis.
const normalizarCelular = (v) => v.replace(/[\s\-().]/g, "");

// Celular móvil de Ecuador: 09XXXXXXXX (local) o +5939XXXXXXXX / 5939XXXXXXXX.
const esCelularEcuador = (v) =>
  /^(?:\+?593|0)9\d{8}$/.test(normalizarCelular(v));

const traducirError = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ese correo ya está registrado. Inicia sesión.";
    case "auth/invalid-email":
      return "El correo no es válido.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "app/maintenance":
      return "Estamos en mantenimiento temporal y el registro está pausado. Vuelve a intentarlo en unos minutos.";
    default:
      return "Ocurrió un error. Inténtalo de nuevo.";
  }
};

const AuthGate = () => {
  const { iniciarSesion, registrar } = useAuth();

  const [login, setLogin] = useState({ correo: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [reg, setReg] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    celular: "",
    password: "",
  });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!login.correo || !login.password) {
      setLoginError("Completa correo y contraseña.");
      return;
    }
    setLoginLoading(true);
    try {
      await iniciarSesion(login.correo, login.password);
    } catch (error) {
      setLoginError(traducirError(error.code));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setRegError("");
    const { nombre, apellido, correo, celular, password } = reg;
    if (!nombre || !apellido || !correo || !celular || !password) {
      setRegError("Completa todos los campos.");
      return;
    }
    if (!esCorreoValido(correo)) {
      setRegError(
        "Ingresa un correo electrónico válido (ej. nombre@correo.com).",
      );
      return;
    }
    if (!esCelularEcuador(celular)) {
      setRegError("Ingresa un celular válido de Ecuador.");
      return;
    }
    if (!aceptaTerminos) {
      setRegError(
        "Debes aceptar los Términos y Condiciones y la Política de Privacidad para crear tu cuenta.",
      );
      return;
    }
    setRegLoading(true);
    try {
      await registrar({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correo.trim().toLowerCase(),
        celular: normalizarCelular(celular),
        password,
      });
      setModalAbierto(false);
    } catch (error) {
      setRegError(traducirError(error.code));
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Inicia sesión</h2>
          <p className="auth-subtitle">
            Accede a tu cuenta para agendar tu servicio.
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label className="auth-label">Correo</label>
              <input
                type="email"
                className="auth-input"
                placeholder="tucorreo@ejemplo.com"
                value={login.correo}
                onChange={(e) => setLogin({ ...login, correo: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                type="password"
                className="auth-input"
                placeholder="Tu contraseña"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
              />
            </div>

            {loginError && <p className="auth-error">{loginError}</p>}

            <button type="submit" className="auth-btn" disabled={loginLoading}>
              {loginLoading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="auth-divider">
            <span>¿No tienes cuenta?</span>
          </div>

          <button
            className="auth-btn auth-btn--secondary"
            onClick={() => {
              setRegError("");
              setAceptaTerminos(false);
              setModalAbierto(true);
            }}
          >
            Crear cuenta
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalAbierto && (
          <motion.div
            className="tm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalAbierto(false)}
          >
            <motion.div
              className="tm-modal auth-modal"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="tm-modal__title">Crear cuenta</h3>

              <form className="auth-form" onSubmit={handleRegistro}>
                {[
                  { name: "nombre", label: "Nombre", type: "text" },
                  { name: "apellido", label: "Apellido", type: "text" },
                  { name: "correo", label: "Correo", type: "email" },
                  {
                    name: "celular",
                    label: "Celular",
                    type: "tel",
                    inputMode: "numeric",
                    placeholder: "0991234567",
                  },
                  { name: "password", label: "Contraseña", type: "password" },
                ].map((f) => (
                  <div className="auth-field" key={f.name}>
                    <label className="auth-label">{f.label}</label>
                    <input
                      type={f.type}
                      className="auth-input"
                      inputMode={f.inputMode}
                      placeholder={
                        f.placeholder || `Ingrese su ${f.label.toLowerCase()}`
                      }
                      value={reg[f.name]}
                      onChange={(e) =>
                        setReg({ ...reg, [f.name]: e.target.value })
                      }
                    />
                  </div>
                ))}

                <label className="auth-terms">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                  />
                  <span>
                    Acepto los{" "}
                    <a href="/terminos" target="_blank" rel="noreferrer">
                      Términos y Condiciones y la Política de Privacidad
                    </a>
                  </span>
                </label>

                {regError && <p className="auth-error">{regError}</p>}

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={regLoading}
                >
                  {regLoading ? "Creando..." : "Crear cuenta e iniciar"}
                </button>
                <button
                  type="button"
                  className="auth-btn auth-btn--secondary"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthGate;
