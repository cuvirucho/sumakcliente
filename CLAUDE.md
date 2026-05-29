# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint check
```

No test suite is configured.

## Architecture

**Sumak** is a React 19 + Vite SPA for a cleaning services company. It uses React Router v7 for navigation, Framer Motion for animations, Firebase Firestore as the backend, and no global state manager — state flows via props and `localStorage`.

### Booking flow (critical path)

1. **`/cotisamanual`** → `Cotisadormnula.jsx` — user selects services, sizes, extras, and adicionales; calculates price with discount logic; saves result to `localStorage` key `ordenLimpieza` as a JSON object, then navigates to `/agendar`.

2. **`/pacmesual`** → `Homeplamensual.jsx` — monthly plan selector (Básico/Premium/Deluxe × pequeño/mediano/grande); on "Continuar" opens a WhatsApp link with a pre-filled message to `+593963200325`. Does **not** write to Firestore.

3. **`/agendar`** → `Booking.jsx` — reads `ordenLimpieza` from `localStorage`; if found, renders `Tomdatos` to collect user info and pick date/time; if not found, shows links back to the two quotation routes.

4. **`Tomdatos.jsx`** — form that reads available dates/slots from Firestore collection `turnos`, submits a new document (including the full `cotizacion` object), then navigates to `/miscitas` and clears `localStorage`.

5. **`/miscitas`** → `Appointments.jsx` — displays appointments from in-memory React state passed down from `App.jsx` (not from Firestore). This state is lost on page refresh.

### Firebase

`src/Firebase/Firebase.js` initialises the app and exports `db` (Firestore). The project is `sumak-d6728`. All reads/writes go to the `turnos` collection.

### Device identity

`src/Partes/ulidades/deviceId.js` generates and persists a UUID in `localStorage` under `deviceId`, used to tag appointments.

### Folder naming

Folders use unconventional Spanish names with typos (`Partes/ulidades/`, `Planmseual/`). Match existing casing exactly when importing.

### Styling

Global styles live in `src/index.css` and `src/App.css`. No CSS-in-JS or utility framework — plain CSS with BEM-like class names. The design uses a dark luxury theme (Obsidian & Sage palette, Cormorant Garamond fonts via `@import`).
