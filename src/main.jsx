
import './index.css'
// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import App from './App.jsx';
import { AuthProvider } from './Partes/ulidades/AuthContext.jsx';
import {
  crearQueryClient,
  CLAVES_PERSISTIDAS,
  CACHE_BUSTER,
} from './Partes/ulidades/queryClient.js';

const queryClient = crearQueryClient();

// Persistencia del caché en localStorage: en la segunda visita el catálogo
// semi-estático (trabajadores, plan activo) se muestra al instante mientras se
// revalida en segundo plano. Solo se persisten claves seguras; los datos en
// vivo (turnos/streams) van por onSnapshot y no se guardan aquí.
const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'sumak-rq-cache',
});

const root = createRoot(document.getElementById('root'));
root.render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister,
      buster: CACHE_BUSTER,
      dehydrateOptions: {
        // Solo se persisten queries exitosas del catálogo semi-estático.
        shouldDehydrateQuery: (query) =>
          query.state.status === 'success' &&
          CLAVES_PERSISTIDAS.has(query.queryKey?.[0]),
      },
    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </PersistQueryClientProvider>
);
