# Proyecto React (Vite)

Aplicación de catálogo con autenticación (invitado/admin), carrito de compras, CRUD de productos (solo admin), búsqueda reactiva y paginación. Incluye SEO por página (Helmet / migrable), notificaciones no bloqueantes (Toastify), y un tema centralizado (styled-components).

> Aviso: Este sitio es exclusivamente con fines educativos/demostrativos. No representa una tienda real, no comercializa productos y ningún dato ingresado será usado con fines comerciales.

## Requisitos

- Node.js 18+ (recomendado LTS)
- npm 9+

## Instalación

En PowerShell (Windows):

```powershell
# Instalar dependencias (usa legacy-peer-deps por compatibilidad con React 19)
npm install --legacy-peer-deps
```

Si encuentras errores de dependencias, elimina `node_modules` y repite la instalación:

```powershell
rm -r -Force node_modules; rm -Force package-lock.json; npm install --legacy-peer-deps
```

## Desarrollo (modo HMR)

```powershell
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Build y Preview

```powershell
npm run build
npm run preview
```

`preview` sirve los archivos de producción para ver el build localmente.

## Deploy (GitHub Pages vía Actions)

El despliegue se realiza automáticamente usando el workflow `.github/workflows/deploy-gh-pages.yml` al hacer `git push` sobre `main`.

Flujo:
1. Push a `main`.
2. Action instala dependencias (`npm install --legacy-peer-deps`).
3. Ejecuta `npm run build`.
4. Publica artefacto `dist/` usando `deploy-pages` (sin necesidad de rama `gh-pages`).
5. La URL se muestra en el job final de Actions.

Verificación rápida:
```powershell
git push
# Abrir Actions en GitHub → último run → confirmar "Deploy to GitHub Pages" OK
```

### Base de Vite
En producción la `base` debe coincidir con el nombre del repositorio si se publica como Project Page.
```javascript
// vite.config.js (ejemplo)
base: process.env.NODE_ENV === 'production' ? '/Proyecto-React/' : '/'
```

### Deploy Manual Externo (Alternativa)
Si prefieres un repositorio separado (ej: `Deploy-gh-pages`):
1. Generar build: `npm run build`.
2. Copiar contenido de `dist/` al repo externo.
3. Incluir `.nojekyll` y `404.html`.
4. Commit + push a su rama `gh-pages` o usar Actions de ese repo.

### Legacy (rama `gh-pages` interna)
La rama `gh-pages` fue eliminada para simplificar. El workflow reemplaza su función. Para recrearla:
```powershell
git branch gh-pages
git push -u origin gh-pages
```
Úsala sólo si necesitas comparar builds manualmente.

## Troubleshooting

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Página en blanco tras deploy | `base` incorrecta | Revisar `vite.config.js` y rehacer build |
| 404 en `assets/*.js` | Build no publicado completo | Verificar artifact en Actions y hash de archivos |
| Peer dependency error (React 19) | Librería esperando React <=18 | Instalar con `--legacy-peer-deps` o migrar librería |
| Toasts no aparecen | Falta `ToastContainer` | Confirmar que está montado en `App.jsx` |
| Helmet warnings con React 19 | Versión no actualizada | Considerar migrar a `react-helmet` o esperar soporte |

## Tags (Versionado Ligero)
Para marcar un estado estable sin mantener ramas extras:
```powershell
git tag v1.0.0
git push origin v1.0.0
```

## Limpieza de Ramas
Ramas activas esperadas: `main`, `rama-de-trabajo`. Historias obsoletas se eliminan para reducir ruido. Usa tags para snapshots.

## Uso rápido

- Inicio de sesión:
	- Invitado: ingresa cualquier email válido y accede sin contraseña.
	- Admin: usa el email preconfigurado `admin@gmail.com.ar` y la contraseña definida en `AuthContext`.
- Navegación:
	- Catálogo: `/productos` (búsqueda por nombre/categoría y paginación).
	- Detalle de producto: `/productos/:id`.
	- Carrito: `/carrito` (modificar cantidades, eliminar, proceder a compra).
	- Pago: `/pago` (ruta protegida; requiere sesión).
	- Administración: `/admin/productos` (solo admin; CRUD de productos).

## Funcionalidades clave

- Búsqueda reactiva: input en `/productos` sincroniza con `?q=` y filtra por nombre/categoría.
- Paginación: `?page=` controla la página actual; 8 productos por página.
- SEO: títulos y descripciones por página con `react-helmet-async`.
- Notificaciones: `react-toastify` para feedback (agregar al carrito, CRUD, pago).
- Tema y estilos globales: `ThemeProvider` + `GlobalStyle` (styled-components).

## Scripts disponibles

- `npm run dev`: arranca el servidor de desarrollo.
- `npm run build`: genera el build de producción.
- `npm run preview`: sirve el build generado.
- `npm run lint`: ejecuta ESLint.

## Notas de accesibilidad

- Se usan `aria-label`, `role="main"` y `aria-labelledby` en páginas y controles.
- Iconos con `react-icons` marcados como decorativos (`aria-hidden`) y enlaces/botones con texto accesible.

## Estructura (resumen)

- `src/pages`: vistas (Inicio, Servicios, Productos, Detalle, Carrito, Pago, Admin, Navbar).
- `src/context`: contextos (Auth, Carrito, Api, Categorías, etc.).
- `src/styles`: `theme.js` y `GlobalStyle.js`.

---

Para más detalles de dependencias, ver `README Dependencias.md`.
