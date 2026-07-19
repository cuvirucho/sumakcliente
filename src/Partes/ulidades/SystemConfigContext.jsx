import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  suscribir,
  obtenerConfig,
  obtenerPresentacion,
} from "./systemConfig";

// Envoltura React del singleton `systemConfig`. Expone los flags efectivos y los
// textos de la pantalla de mantenimiento, y re-renderiza cuando `config/system`
// cambia en Firestore (en caliente, sin recargar). El listener real es único y
// vive en el servicio; aquí solo nos suscribimos.
const SystemConfigContext = createContext({
  flags: obtenerConfig(),
  presentacion: obtenerPresentacion(),
});

export function SystemConfigProvider({ children }) {
  const [flags, setFlags] = useState(obtenerConfig);
  const [presentacion, setPresentacion] = useState(obtenerPresentacion);

  useEffect(() => {
    setFlags(obtenerConfig());
    setPresentacion(obtenerPresentacion());
    const off = suscribir((nuevosFlags, nuevaPresentacion) => {
      setFlags(nuevosFlags);
      setPresentacion(nuevaPresentacion);
    });
    return off;
  }, []);

  const value = useMemo(
    () => ({ flags, presentacion }),
    [flags, presentacion],
  );

  return (
    <SystemConfigContext.Provider value={value}>
      {children}
    </SystemConfigContext.Provider>
  );
}

export function useSystemConfig() {
  return useContext(SystemConfigContext);
}
