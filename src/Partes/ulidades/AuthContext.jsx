import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../Firebase/Firebase";
import { LEGAL_UPDATED } from "../../data/legalContent";
import { puedeOperar } from "./systemConfig";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, "usuarios", u.uid));
          setPerfil(snap.exists() ? snap.data() : null);
        } catch (error) {
          console.error("Error al cargar perfil:", error);
          setPerfil(null);
        }
      } else {
        setPerfil(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const registrar = async ({ nombre, apellido, correo, celular, password }) => {
    // Protección de costos: en emergencia/crítico (≥95%) se pausa el alta de
    // nuevas cuentas. Se corta antes de crear el usuario en Auth.
    if (!puedeOperar("allowNewUsers")) {
      const err = new Error("Registro pausado por mantenimiento.");
      err.code = "app/maintenance";
      throw err;
    }
    const cred = await createUserWithEmailAndPassword(auth, correo, password);
    await updateProfile(cred.user, {
      displayName: `${nombre} ${apellido}`.trim(),
    });
    const datos = {
      nombre,
      apellido,
      correo,
      celular,
      uid: cred.user.uid,
      creadoEn: serverTimestamp(),
      // El registro solo es posible tras aceptar los términos (ver AuthGate),
      // por eso dejamos constancia de la aceptación, su fecha y la versión.
      aceptaTerminos: true,
      terminosAceptadosEn: serverTimestamp(),
      terminosVersion: LEGAL_UPDATED,
    };
    await setDoc(doc(db, "usuarios", cred.user.uid), datos);
    setPerfil(datos);
    return cred.user;
  };

  const iniciarSesion = (correo, password) =>
    signInWithEmailAndPassword(auth, correo, password);

  const cerrarSesion = () => signOut(auth);

  const actualizarPerfil = async (datos) => {
    if (!user) return;
    await updateDoc(doc(db, "usuarios", user.uid), datos);
    setPerfil((prev) => ({ ...prev, ...datos }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        loading,
        registrar,
        iniciarSesion,
        cerrarSesion,
        actualizarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
