# 📖 Índice de Guías

Esta carpeta agrupa DOCUMENTACIÓN y REFERENCIAS rápidas del proyecto. Cada archivo tiene un propósito claro: guía, ejemplos prácticos, glosario o referencia de subsistemas (categorías, banners, promociones, slider, deploy).

## 🗂 Clasificación

| Archivo | Tipo | Propósito | Uso rápido |
|---------|------|-----------|-----------|
| `EJEMPLOS_USO.md` | Ejemplos | Casos prácticos de autenticación y flujo | Copiar patrones y adaptar |
| `GLOSARIO_CONCEPTOS.md` | Glosario | Sintaxis y conceptos clave de JS/React | Consultar definiciones |
| `GUIA_RAPIDA.md` | Guía | Resumen operativo (login, flujo compra) | Leer al empezar |
| `README_CATEGORIAS.md` | Subsistema | Gestión de categorías (Context + Slider) | Integrar categorías |
| `README_BANNERS.md` | Subsistema | Administración y uso de banners dinámicos | Configurar carrusel principal |
| `README_PROMOCIONES.md` | Subsistema | Promociones destacadas y API del contexto | Mostrar ofertas destacadas |
| `README_SLIDER.md` | Componente | Slider reutilizable + API avanzada | Implementar sliders múltiples |
| `PASOS-DEPLOY-MANUAL.txt` | Procedimiento | Deploy manual a GitHub Pages | Seguir paso a paso |
| `Estructura.txt` | Referencia | Mapa rápido de archivos clave | Ubicar lógica principal |

## 🔄 Estado del Proyecto (Contexto Actual)
- Autenticación: Invitado/Admin con toasts y Helmet.
- Catálogo: Búsqueda reactiva + paginación (URL params).
- Carrito: Controles accesibles y página de pago protegida.
- CRUD Productos: Validaciones y toasts.
- SEO: Helmet en páginas clave.
- Estilos: Bootstrap + styled-components (Theme/GlobalStyle).

## 🧭 Recomendaciones de Lectura
1. Si estás empezando: `GLOSARIO_CONCEPTOS.md` → `GUIA_RAPIDA.md` → `EJEMPLOS_USO.md`.
2. Si integras una sección visual: lee primero el README del subsistema (ej: Banners).
3. Para dudas puntuales de sintaxis: usa Ctrl+F en el glosario.

## ✨ Convenciones
- Código actual del proyecto evita `alert()` y `confirm()` en favor de toasts (React Toastify) o modales; algunos ejemplos legacy se conservan como referencia básica.
- Los contextos siguen patrón: `Provider` + hook `useXxx()` + funciones CRUD.
- Accesibilidad: usar `aria-label`, `role="main"`, `aria-labelledby` y `alt` descriptivos.

## 🛠 Actualizaciones Pendientes (si mejoras en el futuro)
- Migrar ejemplos restantes con `alert/confirm` a toasts/modales.
- Añadir sección de ejemplos para búsqueda y paginación.
- Documentar patrón de Helmet por página.

## 📚 Recursos Externos
- React: https://react.dev/
- MDN JavaScript: https://developer.mozilla.org/
- React Router: https://reactrouter.com/
- JavaScript Info: https://javascript.info/

## ✅ Cómo Contribuir a las Guías
1. Mantén el encabezado que indique Tipo y Propósito.
2. Añade ejemplos mínimos reproducibles.
3. Evita duplicar contenido: enlaza al archivo fuente.

---
Para las operaciones generales del proyecto (instalación y uso) ver el `README.md` raíz.

