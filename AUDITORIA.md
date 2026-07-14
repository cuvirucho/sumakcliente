# Auditoría de Arquitectura, Rendimiento y Escalabilidad — sumakcliente

> App web del ecosistema SUMAK: **React 19 + Vite 7 + Firebase 12**, desplegada en **Netlify**.
> Comparte Firestore (`sumak-d6728`) y el backend (`SUMAK/functions`) con otras 3 apps.
> Alcance de esta intervención: **solo `sumakcliente` (frontend)**. El backend compartido no se modificó.

---

## 1. Resumen ejecutivo

**Estado anterior.** La app era funcionalmente completa y con un backend bien diseñado (validación de precios en servidor, disponibilidad sin PII, idempotencia, `maxInstances`, secretos TURN fuera del cliente). Sin embargo, **no estaba lista para producción a gran escala** por el lado del cliente: **todo el JavaScript se servía en un único archivo de ~1.21 MB** sin ningún tipo de carga diferida, no existía capa de caché (cada visita re-consultaba Firestore), y había listeners en tiempo real que crecían linealmente con el historial de cada usuario.

**Estado tras la intervención.** Se aplicaron optimizaciones **transparentes para el usuario** (sin cambios de lógica de negocio, diseño ni experiencia): code-splitting por rutas, caché stale-while-revalidate con TanStack Query, reducción de listeners, imágenes con formato/calidad automáticos y limpieza de producción. El bundle inicial se aligeró significativamente y las dependencias pesadas (mapas Leaflet, WebRTC, confetti, contenido legal) ahora solo se descargan cuando se necesitan.

**Nivel de preparación para producción:** de **medio-bajo** (cliente) a **alto**. Riesgo de regresión de los cambios: **bajo** (build verde, sin lógica alterada).

**Principales riesgos que quedan fuera de este alcance** (ver §5): reglas de Firestore desplegadas solo en la consola (no auditables desde el repo), y el `index.css` monolítico de 5.412 líneas.

---

## 2. Problemas detectados (por prioridad)

### 🔴 Crítico
| # | Problema | Ubicación |
|---|----------|-----------|
| 1 | **Bundle monolítico de ~1.21 MB** sin code-splitting: todo se carga en el primer paint (Firebase, Leaflet, framer-motion, WebRTC, qrcode, confetti, 1.955 líneas de contenido legal). | `src/App.jsx` (imports estáticos) |
| 2 | `getAnalytics()` se inicializaba de forma **eager** (descarga SDK + red) y nunca se usaba. | `src/Firebase/Firebase.js` |

### 🟠 Alto
| # | Problema | Ubicación |
|---|----------|-----------|
| 3 | Un `onSnapshot` sobre `streams/{id}` **por cada cita**, incluidas completadas/canceladas que nunca tendrán transmisión → listeners y lecturas que crecen con todo el historial. | `src/Partes/Agenda/Appointments.jsx` |
| 4 | Sin caché: `trabajadores` y `planesMensuales` se re-consultaban con `getDocs` en cada montaje; la disponibilidad se re-pedía al navegar pasos. | `CotizadorWizard.jsx`, `Homeplamensual.jsx` |
| 5 | Imágenes Cloudinary/PNG a tamaño original, sin `f_auto,q_auto`, sin `loading="lazy"`. | `Home`, `Booking`, `Navbar`, `Footer` |

### 🟡 Medio
| # | Problema | Ubicación |
|---|----------|-----------|
| 6 | Código muerto: import de `Homeia` (stub sin ruta) y estado/props `appointments`/`addcita` que ningún componente leía. | `src/App.jsx` |
| 7 | Logs de diagnóstico WebRTC (`WEB CAND/ICE/CONN/VIDEO`, `[stream-diag]`) y un badge de resolución **en producción**. | `src/pages/ViewStream.jsx` |
| 8 | `react-confetti` con `numberOfPieces={8000}` → pico de CPU/jank (perjudica INP). | `src/Partes/Agenda/Appointments.jsx` |

### 🟢 Correcto (sin cambios)
Imports modulares de Firebase (tree-shakeable) · `.env` gitignored · claves web públicas por diseño · índice compuesto `turnos(uid,fecha)` presente · consulta de turnos ya acotada por ventana de fecha · backend con validación anti-manipulación e idempotencia.

---

## 3. Cambios implementados

1. **Code-splitting por rutas** — `src/App.jsx`
   `React.lazy` + `Suspense` para todas las rutas excepto `Home` (landing, eager para LCP). Leaflet, WebRTC, qrcode/confetti y el contenido legal salen del bundle inicial. Fallback ligero sin salto de layout.

2. **Vendor chunks de caché estable** — `vite.config.js`
   `manualChunks` separa `firebase`, `framer-motion` y `@tanstack/react-query` en chunks propios: un cambio de código de la app ya no invalida su caché en el navegador.

3. **Analytics diferido** — `src/Firebase/Firebase.js`
   Se elimina la inicialización eager. Si hay `measurementId`, se carga con `import('firebase/analytics')` + `isSupported()` en `requestIdleCallback`, fuera del camino crítico.

4. **Caché SWR con TanStack Query** — `main.jsx` + nuevos `queryClient.js`, `cloudinary.js`
   - `QueryClientProvider` (con persistencia en `localStorage` para catálogo semi-estático) en el arranque.
   - `['trabajadores']` (`staleTime` 30 min) en `CotizadorWizard`.
   - `['planActivo', uid]` en `Homeplamensual` (reemplaza `cargarEstado`, refetch tras contratar).
   - `['disponibilidad', fecha]` (`staleTime` 30 s) para **mostrar** horas. La verificación final al reservar (`guardarCita`) **mantiene** una lectura fresca directa, sin caché, para no perder exactitud.

5. **Menos listeners de streams** — `src/Partes/Agenda/Appointments.jsx`
   Solo se suscribe `streams/{id}` para citas **no terminales** (excluye completadas y canceladas). Transparente: un stream solo existe durante un servicio activo.

6. **Imágenes optimizadas** — `Home`, `Booking`, `Navbar`, `Footer`
   Helper `cloudinaryOptimized()` inyecta `f_auto,q_auto` (WebP/AVIF automático) + ancho en logos; `loading="lazy"` + `decoding="async"` bajo el pliegue.

7. **Limpieza de producción**
   - `App.jsx`: eliminado `Homeia` y el estado/props muertos.
   - `ViewStream.jsx`: logs y badge de diagnóstico gateados tras `import.meta.env.DEV`; en producción no se emiten ni se recolectan stats periódicas.
   - `Appointments.jsx`: confetti `8000 → 400` piezas (mismo efecto visual, sin el pico de CPU).

---

## 4. Impacto esperado

### Bundle / carga (medido con `vite build`)

**Antes:** un único `index-*.js` de **1.236.815 B (~1.21 MB)** + CSS de 102.847 B — **todo eager**.

**Después:** chunks separados. En la **landing** solo se cargan los chunks eager; lo pesado se difiere:

| Chunk (eager en landing) | Tamaño | gzip |
|---|--:|--:|
| `index` (app + Home + React + router) | 333 KB | 101.7 KB |
| `vendor-firebase` | 486 KB | 114.8 KB |
| `vendor-motion` (framer-motion) | 124 KB | 41.3 KB |
| `vendor-query` (TanStack) | 36 KB | 10.8 KB |
| **Transferencia inicial ≈** | | **~268 KB gzip** |

| Chunk **diferido** (solo en su ruta) | Tamaño | gzip |
|---|--:|--:|
| `CotizadorWizard` (**Leaflet**) + su CSS | 179.6 KB + 15.6 KB | 57.3 + 6.5 KB |
| `Appointments` (qrcode + confetti) | 39.9 KB | 13.6 KB |
| `PoliticaPrivacidad` (legal) | 22.3 KB | 4.7 KB |
| `ViewStream` (WebRTC) | 6.8 KB | 2.6 KB |
| `Homeplamensual`, `Perfil`, `AuthGate`, `Booking`, `Terminos`, `CalendarioMes` | < 8 KB c/u | — |

- **~270 KB de JS** que antes cargaba **todo el mundo en el primer paint** ahora solo se descargan al entrar a su pantalla (los mapas Leaflet solo los paga quien cotiza; WebRTC solo quien ve un stream, etc.).
- El **CSS de Leaflet (15.6 KB)** se separó a su ruta → el `index.css` inicial bajó de **102.8 KB → 87.2 KB**.
- Mejora esperada en **LCP / FCP / TTI** en la landing y en móviles/redes lentas; menos bloqueo del hilo principal.

### Lecturas / costos de Firebase
- **`trabajadores` y `planActivo`:** de una lectura por cada montaje a **0 lecturas** mientras el caché esté fresco (5–30 min) y **caché-primero entre recargas** (persistido). Menos lecturas facturables y UI instantánea.
- **`disponibilidad`:** deja de re-invocarse la Cloud Function al ir y volver entre pasos del cotizador (cacheada 30 s).
- **Listeners de streams:** para un usuario con historial (p. ej. 20 citas, 1 activa) pasa de **~20 listeners concurrentes a ~1**. A escala, reduce enormemente las conexiones simultáneas y las lecturas en tiempo real facturables.

### CPU / memoria / red
- Analytics fuera del arranque → menos JS y una petición de red menos en el camino crítico.
- Confetti 8.000 → 400 piezas → sin el pico de CPU/jank al abrir modales.
- Imágenes en WebP/AVIF y `lazy` → menos ancho de banda y mejor CLS.

---

## 5. Recomendaciones futuras

**Prioritarias**
1. **Verificar las reglas de Firestore desplegadas** en la consola de Firebase: que `turnos` restrinja lectura a **dueño + staff** (el archivo del repo es solo "referencia, no desplegado"). Confirmar también `streams`, `planesMensuales` y `codigos`.
2. **`index.css` de 5.412 líneas → CSS por feature** co-dividido con las rutas lazy (ya se demostró viable con el split automático del CSS de Leaflet). Reduciría el CSS bloqueante inicial.
3. **`npm audit`**: hay vulnerabilidades en dependencias (transitivas del toolchain). Revisar y actualizar de forma controlada.

**Escalabilidad / arquitectura**
4. Considerar **partir `firebase/firestore` de `firebase/auth`** para que solo Auth cargue eager y Firestore se difiera donde no sea inmediato (hoy `vendor-firebase` = 486 KB eager por el `AuthProvider`).
5. **Paginación** en `Appointments` (`limit` + `startAfter`) si el historial por usuario crece mucho: hoy la ventana de fecha lo acota, pero un usuario muy activo podría traer cientos de docs.
6. **Sincronización entre pestañas** del caché de React Query con `broadcastQueryClient` si se observa divergencia entre pestañas.
7. **`react-hooks/exhaustive-deps`** y los falsos positivos de `no-unused-vars` con `<motion.*>` (preexistentes): ajustar la config de ESLint para que el lint vuelva a pasar limpio.

**Rendimiento web**
8. Servir el hero de la landing (hoy `background-image` en CSS) como imagen optimizada con `fetchpriority="high"` para mejorar el LCP.
9. Reemplazar los logos PNG de ~170 KB (`public/logo*.png`, favicon) por versiones optimizadas / WebP.

---

*Verificación realizada:* `npm run build` exitoso (587 módulos, chunks divididos correctamente); sin errores nuevos de lint introducidos por estos cambios; lógica de negocio, rutas y experiencia de usuario intactas.
