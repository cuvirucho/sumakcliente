// Configuración de TanStack Query (caché stale-while-revalidate) para las
// lecturas semi-estáticas de Firestore/Cloud Functions. Los datos en tiempo
// real (turnos, streams) siguen usando onSnapshot y NO pasan por aquí.
import { QueryClient } from "@tanstack/react-query";

// Claves de query que SÍ se persisten entre recargas (catálogo semi-estático).
// Así en la segunda visita se muestran al instante desde caché mientras se
// revalidan en segundo plano, sin volver a leer Firestore en el primer paint.
export const CLAVES_PERSISTIDAS = new Set(["trabajadores", "planActivo"]);

// Versión del caché persistido: al cambiarla se invalida el caché viejo
// (subir tras cambios de esquema de las queries persistidas).
export const CACHE_BUSTER = "sumak-cache-v1";

export function crearQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Datos frescos por 5 min: evita refetches al navegar entre pantallas.
        staleTime: 5 * 60 * 1000,
        // Retención en memoria/persistencia: 24 h (>= maxAge del persister).
        gcTime: 24 * 60 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
