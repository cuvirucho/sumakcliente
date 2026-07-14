import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Vendor chunks de caché estable: al separar las librerías grandes de
        // baja rotación, un cambio en el código de la app no invalida su caché
        // en el navegador. Leaflet y WebRTC ya se separan solos vía React.lazy.
        manualChunks: {
          'vendor-firebase': [
            'firebase/app',
            'firebase/firestore',
            'firebase/auth',
            'firebase/functions',
          ],
          'vendor-motion': ['framer-motion'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
})
