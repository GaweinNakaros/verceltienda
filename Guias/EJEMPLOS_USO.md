# 📚 Ejemplos de Uso - Sistema de Autenticación

> Estado actualizado del proyecto: Se usan toasts (React Toastify) en lugar de `alert()` y se evita `window.confirm()` para mejor UX. Algunos ejemplos se mantienen con `alert/confirm` a modo didáctico básico; puedes reemplazarlos por `toast.success()`, `toast.error()` o un modal.

Esta guía contiene 12 ejemplos prácticos de cómo usar el sistema de autenticación en tu aplicación React.

---

## 📑 Índice

1. [Uso del AuthContext en Cualquier Componente](#1-uso-del-authcontext-en-cualquier-componente)
2. [Proteger una Ruta Nueva](#2-proteger-una-ruta-nueva)
3. [Acceder a Datos del Usuario](#3-acceder-a-datos-del-usuario)
4. [Mostrar Contenido Condicional](#4-mostrar-contenido-condicional)
5. [Redirigir Después de una Acción](#5-redirigir-después-de-una-acción)
6. [Validación de Email Personalizada](#6-validación-de-email-personalizada)
7. [Combinar Carrito y Autenticación](#7-combinar-carrito-y-autenticación)
8. [Mensaje de Bienvenida Después del Login](#8-mensaje-de-bienvenida-después-del-login)
9. [Cerrar Sesión con Confirmación](#9-cerrar-sesión-con-confirmación)
10. [Hook Personalizado para Require Auth](#10-hook-personalizado-para-require-auth)
11. [Guard de Navegación](#11-guard-de-navegación)
12. [Persistencia con Timeout](#12-persistencia-con-timeout)

---

## 1. Uso del AuthContext en Cualquier Componente

Cómo usar el contexto de autenticación en cualquier componente de tu aplicación.

```javascript
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { usuario, iniciarSesion, cerrarSesion, estaAutenticado } = useAuth();

  // Verificar si está autenticado
  if (estaAutenticado()) {
    console.log('Usuario autenticado:', usuario.email);
  }

  // Iniciar sesión
  const handleLogin = () => {
    iniciarSesion('usuario@ejemplo.com');
  };

  // Cerrar sesión
  const handleLogout = () => {
    cerrarSesion();
  };

  return (
    <div>
      {estaAutenticado() ? (
        <div>
          <p>Bienvenido, {usuario.email}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Iniciar Sesión</button>
      )}
    </div>
  );
}
```

**📌 Puntos clave:**
- Usa el hook `useAuth()` para acceder al contexto
- `estaAutenticado()` verifica si hay un usuario logueado
- `usuario.email` contiene el email del usuario actual

---

## 2. Proteger una Ruta Nueva

Cómo agregar una nueva ruta protegida en tu aplicación.

```javascript
// En App.jsx
import NuevaPaginaProtegida from './pages/NuevaPaginaProtegida';
import RutaProtegida from './pages/RutaProtegida';

<Route 
  path="/nueva-ruta-protegida" 
  element={
    <RutaProtegida>
      <NuevaPaginaProtegida />
    </RutaProtegida>
  } 
/>
```

**📌 Puntos clave:**
- Envuelve el componente en `<RutaProtegida>`
- Si el usuario no está autenticado, será redirigido a `/login`
- Después del login, volverá a la página que intentaba visitar

---

## 3. Acceder a Datos del Usuario

Cómo mostrar información del usuario autenticado.

```javascript
function PerfilUsuario() {
  const { usuario } = useAuth();

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Email: {usuario?.email}</p>
      <p>Fecha de ingreso: {new Date(usuario?.fechaIngreso).toLocaleString()}</p>
    </div>
  );
}
```

**📌 Puntos clave:**
- Usa `usuario?.email` con optional chaining para evitar errores
- `usuario.fechaIngreso` contiene la fecha en formato ISO
- `toLocaleString()` formatea la fecha legiblemente

---

## 4. Mostrar Contenido Condicional

Cómo mostrar diferentes contenidos según si el usuario está autenticado.

```javascript
import { Link } from 'react-router-dom';

function Dashboard() {
  const { estaAutenticado, usuario } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      
      {estaAutenticado() ? (
        <div>
          <h2>Bienvenido, {usuario.email}</h2>
          <p>Aquí está tu contenido exclusivo...</p>
        </div>
      ) : (
        <div>
          <h2>Por favor, inicia sesión</h2>
          <Link to="/login">Ir a iniciar sesión</Link>
        </div>
      )}
    </div>
  );
}
```

**📌 Puntos clave:**
- Usa el operador ternario para renderizado condicional
- Muestra contenido diferente para usuarios autenticados y no autenticados

---

## 5. Redirigir Después de una Acción

Cómo redirigir al usuario según su estado de autenticación.

```javascript
import { useNavigate } from 'react-router-dom';

function ComprarProducto() {
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();

  const handleCompra = () => {
    if (!estaAutenticado()) {
      // Redirigir a login si no está autenticado
      navigate('/login', { state: { from: { pathname: '/pago' } } });
    } else {
      // Proceder con la compra
      navigate('/pago');
    }
  };

  return (
    <button onClick={handleCompra}>
      Comprar Ahora
    </button>
  );
}
```

**📌 Puntos clave:**
- `navigate('/login', { state: {...} })` guarda la ruta destino
- Después del login, el usuario será redirigido a `/pago`

---

## 6. Validación de Email Personalizada

Cómo crear un formulario de login con validación de email.

```javascript
import { useState } from 'react';

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion } = useAuth();

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }
    
    if (!validarEmail(email)) {
      setError('Email inválido');
      return;
    }
    
    iniciarSesion(email);
    // Redirigir...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <span>{error}</span>}
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

**📌 Puntos clave:**
- Regex para validar formato de email
- Muestra errores específicos según el problema
- Usa `e.preventDefault()` para evitar recarga de página

---

## 7. Combinar Carrito y Autenticación

Cómo verificar autenticación antes de proceder al pago.

```javascript
function BotonComprar() {
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();
  const { carrito, cantidadTotal } = useCarrito();

  const handleComprar = () => {
    // Verificar que hay productos
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Verificar autenticación
    if (!estaAutenticado()) {
      // Guardar la ruta actual para redirigir después del login
      navigate('/login', { state: { from: { pathname: '/pago' } } });
    } else {
      // Proceder al pago
      navigate('/pago');
    }
  };

  return (
    <button onClick={handleComprar}>
      Comprar ({cantidadTotal} productos)
    </button>
  );
}
```

**📌 Puntos clave:**
- Combina dos contextos: `useAuth()` y `useCarrito()`
- Valida que el carrito tenga productos antes de proceder
- Redirige a login si no está autenticado

---

## 8. Mensaje de Bienvenida Después del Login (versión con toast)

Cómo mostrar un mensaje de bienvenida al iniciar sesión.

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function IniciarSesionConMensaje() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const resultado = iniciarSesion(email);
    if (resultado.exito) {
      toast.success(`Bienvenido, ${email}`);
      navigate('/');
    } else {
      toast.error(resultado.mensaje || 'Error de autenticación');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

**📌 Puntos clave:**
- Usa template literals para personalizar el mensaje
- Redirige después de mostrar el mensaje

---

## 9. Cerrar Sesión con Confirmación (modal / toast)

Cómo implementar un botón de cerrar sesión con confirmación.

```javascript
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function BotonCerrarSesion() {
  const { cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    toast.info('Sesión cerrada');
    navigate('/');
  };

  return (
    <button onClick={handleCerrarSesion}>
      Cerrar Sesión
    </button>
  );
}
```

**📌 Puntos clave:**
- `window.confirm()` muestra un diálogo de confirmación
- Solo cierra sesión si el usuario confirma
- Redirige al home después de cerrar sesión

---

## 10. Hook Personalizado para Require Auth

Cómo crear un hook personalizado para requerir autenticación.

```javascript
// hooks/useRequireAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useRequireAuth() {
  const { estaAutenticado } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!estaAutenticado()) {
      navigate('/login');
    }
  }, [estaAutenticado, navigate]);

  return estaAutenticado();
}
```

**Uso del hook:**

```javascript
function PaginaProtegida() {
  const isAuth = useRequireAuth();

  if (!isAuth) {
    return <div>Cargando...</div>;
  }

  return <div>Contenido protegido</div>;
}
```

**📌 Puntos clave:**
- Encapsula la lógica de verificación de autenticación
- Redirige automáticamente si no está autenticado
- Reutilizable en múltiples componentes

---

## 11. Guard de Navegación

Cómo implementar un guard global de navegación.

```javascript
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavigationGuard() {
  const { estaAutenticado } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Lista de rutas protegidas
    const rutasProtegidas = ['/pago', '/perfil', '/historial'];
    
    // Verificar si la ruta actual es protegida
    const esRutaProtegida = rutasProtegidas.some(ruta => 
      location.pathname.startsWith(ruta)
    );

    // Redirigir si no está autenticado
    if (esRutaProtegida && !estaAutenticado()) {
      navigate('/login', { state: { from: location } });
    }
  }, [location, estaAutenticado, navigate]);

  return null;
}
```

**Agregar en App.jsx:**

```javascript
function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Navbar />
        <NavigationGuard />  {/* Agregar aquí */}
        <Routes>
          {/* ... rutas ... */}
        </Routes>
      </CarritoProvider>
    </AuthProvider>
  );
}
```

**📌 Puntos clave:**
- Protege múltiples rutas desde un solo lugar
- Usa `array.some()` para verificar si la ruta actual está protegida
- Se ejecuta en cada cambio de ruta

---

## 12. Persistencia con Timeout (ejemplo sin toasts por simplicidad)

Cómo agregar un timeout de sesión al AuthContext.

```javascript
import { useState, useEffect } from 'react';

export const AuthProviderConTimeout = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const TIMEOUT = 30 * 60 * 1000; // 30 minutos en milisegundos

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
      const data = JSON.parse(usuarioGuardado);
      const ahora = new Date().getTime();
      const fechaIngreso = new Date(data.fechaIngreso).getTime();
      
      // Verificar si la sesión ha expirado
      if (ahora - fechaIngreso < TIMEOUT) {
        setUsuario(data);
      } else {
        // Sesión expirada, limpiar localStorage
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  // ... resto del código del AuthProvider
};
```

**📌 Puntos clave:**
- Define un tiempo de expiración de sesión
- Compara la fecha actual con la fecha de ingreso
- Limpia la sesión si ha expirado el timeout
- `30 * 60 * 1000` = 30 minutos en milisegundos

---

## 🎯 Resumen

Estos ejemplos te muestran diferentes formas de usar el sistema de autenticación:

- ✅ Verificar si un usuario está autenticado
- ✅ Proteger rutas y componentes
- ✅ Mostrar contenido condicional
- ✅ Validar formularios
- ✅ Combinar con otros contextos (Carrito)
- ✅ Crear hooks personalizados
- ✅ Implementar guards de navegación
- ✅ Agregar timeout de sesión

---

## 📚 Recursos Adicionales

- [GLOSARIO_CONCEPTOS.md](./GLOSARIO_CONCEPTOS.md) - Conceptos de JavaScript/React
- [AUTENTICACION.md](../AUTENTICACION.md) - Documentación completa del sistema
- [GUIA_RAPIDA.md](../GUIA_RAPIDA.md) - Guía de inicio rápido

---

**¡Feliz codificación! 🚀**
