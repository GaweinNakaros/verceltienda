# Proyecto React (Vite)

Aplicación de catálogo con autenticación (invitado/admin), carrito de compras, CRUD de productos (solo admin), búsqueda reactiva y paginación. Incluye SEO por página (Helmet / migrable), notificaciones no bloqueantes (Toastify), y un tema centralizado (styled-components).

> Aviso: Este sitio es exclusivamente con fines educativos/demostrativos. No representa una tienda real, no comercializa productos y ningún dato ingresado será usado con fines comerciales.

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
