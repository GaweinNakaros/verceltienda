# Proyecto React (Vite)

Aplicación de catálogo con autenticación (invitado/admin), carrito de compras, CRUD de productos (solo admin), búsqueda reactiva y paginación. Incluye SEO por página (Helmet / migrable), notificaciones no bloqueantes (Toastify), y un tema centralizado (styled-components).

> Aviso: Este sitio es exclusivamente con fines educativos/demostrativos. No representa una tienda real, no comercializa productos y ningún dato ingresado será usado con fines comerciales.

## Uso rápido

- Inicio de sesión:
	- Invitado: ingresa cualquier email válido y accede sin contraseña.
	- Admin: usa el email preconfigurado `admin@gmail.com.ar` y la contraseña definida en `AuthContext` (admin).
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

## Estructura (resumen)

- `src/pages`: vistas (Inicio, Servicios, Productos, Detalle, Carrito, Pago, Admin, Navbar).
- `src/context`: contextos (Auth, Carrito, Api, Categorías, etc.).
- `src/styles`: `theme.js` y `GlobalStyle.js`.

---
