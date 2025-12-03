# Guía Rápida del Proyecto (Autenticación + Flujo de Compra)

> Actualizado: Uso de toasts en lugar de alert(), búsqueda y paginación en catálogo, ruta admin protegida.

## 🚀 Inicio Rápido

1. Instala dependencias (si no lo hiciste):
  ```powershell
  npm install --legacy-peer-deps
  ```
2. Inicia el servidor de desarrollo:
  ```powershell
  npm run dev
  ```

3. Flujo básico de prueba:
  - Ir a `http://localhost:5173/productos`
  - Usar la barra de búsqueda para filtrar
  - Agregar productos (ver toast de confirmación)
  - Abrir "Carrito" → Ajustar cantidades / eliminar
  - Clic en "Proceder a compra" (si no logueado redirige a `/login`)
  - Iniciar sesión:
    - Invitado: cualquier email válido
    - Admin: `admin@gmail.com.ar` + contraseña configurada en `AuthContext`
  - Redirección automática a `/pago` → completar formulario → confirmar pago (toast éxito)

## 📊 Diagrama de Flujo (Compra)

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE COMPRA                          │
└─────────────────────────────────────────────────────────────┘

    [Productos] 
        │
        ▼ (agregar al carrito)
    [Carrito]
        │
        ▼ (clic en "Proceder a compra")
        │
    ┌───┴───┐
    │       │
¿Autenticado?
    │       │
    ├─NO──►[Login] ──► [Pago] ──► [Confirmación]
    │                    │
    └─SÍ─────────────────┘

```

## 🔑 Componentes Clave

### 1. AuthContext (estado de sesión)
```jsx
// Uso en cualquier componente
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { usuario, iniciarSesion, cerrarSesion, estaAutenticado } = useAuth();
  
  // usuario: { email, fechaIngreso }
  // iniciarSesion(email): Autentica al usuario
  // cerrarSesion(): Cierra la sesión
  // estaAutenticado(): true/false
}
```

### 2. Proteger una Ruta (RutaProtegida / RutaSoloAdmin)
```jsx
// En App.jsx
<Route 
  path="/ruta-protegida" 
  element={
    <RutaProtegida>
      <MiComponenteProtegido />
    </RutaProtegida>
  } 
/>
```

### 3. Navbar con Autenticación e Íconos
```jsx
// Muestra el email del usuario si está autenticado
// Botón de "Cerrar Sesión" si está autenticado
// Link "Iniciar Sesión" si NO está autenticado
```

## 📝 Validaciones Clave

### Email (Login)
- ✅ Formato válido: usuario@dominio.com
- ❌ No puede estar vacío
- ❌ Debe tener @ y dominio válido

### Formulario de Pago
- ✅ Nombre completo: requerido
- ✅ Dirección: requerida
- ✅ Ciudad: requerida
- ✅ Código postal: requerido
- ✅ Teléfono: 10 dígitos
- ✅ Método de pago: selección

## 🔐 Estados Visuales Navbar

### Usuario NO autenticado
```
Navbar (no autenticado): `[Inicio] [Productos] [Servicios] [Carrito] [Iniciar Sesión]`
```

### Usuario autenticado
```
Navbar (autenticado invitado): `[Inicio] [Productos] [Servicios] [Carrito] [👤 email] [Cerrar Sesión]`

Navbar (autenticado admin): `[Inicio] [Productos] [Servicios] [Carrito] [Administrar Productos] [👤 email] [Cerrar Sesión]`
```

## 💾 Persistencia de Sesión

- La sesión se guarda en `localStorage`
- Persiste entre recargas de página
- Se limpia al cerrar sesión
- Key: `"usuario"`

## 🔁 Redirecciones

### Escenario 1: Usuario intenta acceder a /pago sin autenticación
```
/pago → detecta no autenticado → /login → usuario ingresa email → /pago
```

### Escenario 2: Usuario va directamente a /login
```
/login → usuario ingresa email → / (home)
```

## 🗂 Mapa de Archivos (Resumen)

```
src/
├── context/
│   ├── AuthContext.jsx ← Autenticación invitado/admin + persistencia
│   ├── CarritoContext.jsx ← Lógica de carrito y totales
│   ├── ApiContext.jsx ← CRUD productos + actualización stock
│   ├── CategoriasContext.jsx / PromocionesContext.jsx / BannersContext.jsx / SliderContext.jsx
│   └── ...
├── pages/
│   ├── App.jsx ← Providers + rutas + Theme + Helmet + ToastContainer
│   ├── productos.jsx ← Catálogo con búsqueda/paginación y toasts
│   ├── productoDetalle.jsx ← Detalle con SEO dinámico y toasts
│   ├── carrito_simple.jsx ← Gestión carrito + toasts + accesibilidad
│   ├── navbar.jsx ← Navegación + iconos + sesión
│   ├── IniciarSesion.jsx ← Login invitado/admin con toasts
│   ├── Pago.jsx ← Pago protegido + actualización stock
│   ├── AdminProductos.jsx ← CRUD productos solo admin
│   ├── RutaProtegida.jsx / RutaSoloAdmin.jsx ← Guards de rutas
│   └── ...
├── styles/GlobalStyle.js / theme.js ← Diseño centralizado
└── assets/ (imágenes, data) 

---
Para documentación detallada revisa el índice en `Guias/README.md`.

```