// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Cloud Functions (callables): p. ej. `obtenerDisponibilidad`, que calcula la
// ocupación por fecha sin exponer la PII de los turnos ajenos.
export const functions = getFunctions(app);

// Analytics diferido: fuera del camino crítico de carga. El SDK de Analytics
// (pesado y no esencial para el primer paint) solo se descarga e inicializa si
// hay measurementId configurado y el navegador lo soporta, después de que la
// app quede interactiva. Antes se inicializaba de forma eager sin usarse.
if (firebaseConfig.measurementId) {
  const iniciarAnalytics = () => {
    import("firebase/analytics")
      .then(({ getAnalytics, isSupported }) =>
        isSupported().then((ok) => {
          if (ok) getAnalytics(app);
        }),
      )
      .catch(() => {
        /* Analytics es opcional: un fallo no debe afectar la app. */
      });
  };
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(iniciarAnalytics);
  } else if (typeof window !== "undefined") {
    window.setTimeout(iniciarAnalytics, 2000);
  }
}