#  Sistema de Autenticación, Roles y Rutas Protegidas

##  Descripción General

Implementamos un sistema de autenticación que protege la ruta de pago y habilita roles. Mantiene el flujo de compra anunciándose sin registrarse para usuarios invitados, y exige credenciales solo al usuario administrador.

##  Arquitectura

### Componentes Principales

1. **AuthContext** (`src/context/AuthContext.jsx`)
   - Gestiona el estado global de autenticación
   - Persiste la sesión en `localStorage`
   - Proporciona funciones: `iniciarSesion()`, `cerrarSesion()`, `estaAutenticado()`, `esAdmin()`, `obtenerRol()`

2. **IniciarSesion** (`src/pages/IniciarSesion.jsx`)
  - Formulario de login que primero solicita solo el email
  - Contraseña se muestra y exige automáticamente si el email detectado es admin
  - Redirige al usuario a la ruta que intentaba acceder después del login
  - Validación de formato de email

3. **RutaProtegida** (`src/pages/RutaProtegida.jsx`)
   - Componente HOC (Higher Order Component)
   - Verifica autenticación antes de renderizar componentes hijos
   - Redirige a `/login` si el usuario no está autenticado

4. **Pago** (`src/pages/Pago.jsx`)
   - Página protegida que requiere autenticación
   - Formulario completo de datos de envío y pago
   - Resumen de la orden

## 🔄 Flujo de Usuario (Invitado)

```
1. Usuario agrega productos al carrito
2. Usuario hace clic en "Proceder a compra"
3. Sistema verifica autenticación
   ├─ ✅ Si está autenticado → Accede a la página de pago
   └─ ❌ Si NO está autenticado → Redirige a /login
4. Usuario ingresa su email en el formulario de login
5. El formulario NO muestra contraseña (no es admin)
6. Sistema valida el email y autentica al usuario como invitado
7. Usuario es redirigido a la página de pago

## 🔐 Flujo de Usuario (Administrador)

```
1. Admin navega a /login
2. Ingresa email: admin@gmail.com.ar
3. Ingresa contraseña: admin
4. Sistema valida credenciales contra la base de usuarios
5. Si son correctas, inicia sesión con rol 'admin'
6. Redirige a la ruta destino
```

### Roles y permisos
- `rol: 'usuario'` (invitado): puede comprar y navegar
- `rol: 'admin'`: además puede acceder a funcionalidades administrativas

### Reglas de autenticación
- Si el email es `admin@gmail.com.ar` → el formulario muestra el campo contraseña y se exige
- Si el email es cualquier otro → el formulario NO muestra contraseña y se permite iniciar como invitado
7. Usuario completa el formulario de pago
8. Se procesa la compra y se vacía el carrito
```

## 🎯 Características Implementadas

### ✅ Autenticación
- Invitado: login solo con email (sin registro)
- Admin: login con email + contraseña
- Validación de formato de email
- Persistencia de sesión en localStorage
- Cierre de sesión

### ✅ Rutas Protegidas
- Protección de la ruta `/pago`
- Redirección automática al login
- Preservación de la ruta destino
- Redirección después del login

### ✅ UI/UX
- Formularios con validación en tiempo real
- Campo de contraseña dinámico (solo se ve para admin)
- Mensajes de error claros
- Indicador de usuario en el navbar
- Estilos modernos y responsivos

### 🧭 Comportamiento dinámico del formulario de login
- El componente determina `esEmailAdmin` comparando el email ingresado con `admin@gmail.com.ar`
- Si `esEmailAdmin` es `true` → renderiza el campo contraseña y valida que no esté vacío
- Si `esEmailAdmin` es `false` → no renderiza contraseña y autentica como invitado
- Texto de ayuda: "Ingresa tu email para continuar. Si detectamos que eres admin, te pediremos la contraseña."

### Archivos
```
src/context/AuthContext.jsx       - Contexto de autenticación
src/pages/IniciarSesion.jsx       - Página de login
src/pages/IniciarSesion.css       - Estilos del login
src/pages/Pago.jsx                - Página de pago protegida
src/pages/Pago.css                - Estilos de la página de pago
src/App.jsx                       - Agregado AuthProvider y rutas
src/pages/navbar.jsx              - Agregado indicador de usuario
src/pages/carrito_simple.jsx      - Modificado botón de compra
src/pages/RutaProtegida.jsx       - Actualizado para usar AuthContext
Estructura.txt                    - Documentación actualizada
AUTENTICACION.md                  - Esta documentación

---

## 📚 Explicación del Sistema de Admin (Resumen Unificado)

### Base de usuarios (solo admin registrado)
En `AuthContext.jsx` existe `USUARIOS_DB` con:

```
{
   email: 'admin@gmail.com.ar',
   password: 'admin',
   rol: 'admin',
   nombre: 'Administrador del Sistema'
}
```

### iniciarSesion(email, password)
- Si el email es el admin → valida `password` y crea sesión de admin
- Si el email no es el admin → crea sesión de invitado sin contraseña

### esAdmin() y obtenerRol()
- `esAdmin()` retorna true si el usuario autenticado tiene rol 'admin'
- `obtenerRol()` retorna el rol actual o null si no hay sesión

### UI: IniciarSesion.jsx
- Campo email obligatorio y validado
- Campo contraseña visible, requerido solo si email es admin
- Mensajes claros y redirección a la ruta de origen tras login

### Ejemplo de protección de rutas solo para admin

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaSoloAdmin({ children }) {
   const { esAdmin, cargando } = useAuth();
   if (cargando) return <div>Cargando...</div>;
   if (!esAdmin()) return <Navigate to="/" replace />;
   return children;
}
```

---

## 🚀 Próximos pasos (Admin)
- Panel de administración con gestión de productos y órdenes
- Estadísticas de ventas y productos
- Gestión de usuarios y roles (en una futura versión)
```


# 📚 EXPLICACIÓN COMPLETA DEL SISTEMA DE ADMINISTRADOR

## 🎯 RESUMEN EJECUTIVO

Hemos implementado un sistema de autenticación con roles que permite:
- **Usuario administrador** con credenciales: `admin@gmail.com.ar` / `admin`
- Validación de credenciales (email + contraseña)
- Distinción entre usuarios normales y administradores
- Funciones específicas para verificar permisos de administrador

---

## 📂 ESTRUCTURA DE ARCHIVOS MODIFICADOS

```
v1.3/src/
├── context/
│   └── AuthContext.jsx         ← Sistema de autenticación (modificado)
└── pages/
    └── IniciarSesion.jsx       ← Formulario de login (modificado)
```

---

## 🔐 PARTE 1: AuthContext.jsx - El Cerebro del Sistema

### 1.1 BASE DE DATOS DE USUARIOS

```javascript
const USUARIOS_DB = [
  {
    email: 'admin@gmail.com.ar',
    password: 'admin',
    rol: 'admin',
    nombre: 'Administrador del Sistema'
  }
];
```

**¿Qué hace esto?**
- Define una lista de usuarios permitidos en el sistema
- En una app real, esto estaría en un servidor con contraseñas encriptadas
- Para desarrollo, usamos un array simple en JavaScript

**¿Cómo funciona?**
- Cada objeto representa un usuario con sus credenciales
- `rol` puede ser `'admin'` o `'usuario'`
- El `email` es el identificador único

---

### 1.2 FUNCIÓN: iniciarSesion(email, password)

```javascript
const iniciarSesion = (email, password) => {
  // PASO 1: Buscar en la base de datos
  const usuarioEncontrado = USUARIOS_DB.find(u => u.email === email);
  
  // PASO 2: ¿Existe el usuario?
  if (!usuarioEncontrado) {
    return {
      exito: false,
      mensaje: 'El email no está registrado en el sistema'
    };
  }
  
  // PASO 3: ¿La contraseña es correcta?
  if (usuarioEncontrado.password !== password) {
    return {
      exito: false,
      mensaje: 'La contraseña es incorrecta'
    };
  }
  
  // PASO 4: Crear sesión (sin incluir la contraseña)
  const sesionUsuario = {
    email: usuarioEncontrado.email,
    nombre: usuarioEncontrado.nombre,
    rol: usuarioEncontrado.rol,
    fechaIngreso: new Date().toISOString()
  };
  
  // PASO 5: Guardar en React y localStorage
  setUsuario(sesionUsuario);
  localStorage.setItem('usuario', JSON.stringify(sesionUsuario));
  
  // PASO 6: Retornar éxito
  return {
    exito: true,
    mensaje: 'Inicio de sesión exitoso',
    usuario: sesionUsuario
  };
};
```

**EXPLICACIÓN PASO A PASO:**

#### PASO 1: Buscar Usuario
```javascript
const usuarioEncontrado = USUARIOS_DB.find(u => u.email === email);
```
- `find()` busca en el array y retorna el primer elemento que cumpla la condición
- `u => u.email === email` es una función flecha que compara cada email
- Si encuentra el usuario, lo guarda en `usuarioEncontrado`
- Si no lo encuentra, `usuarioEncontrado` será `undefined`

#### PASO 2: Validar Existencia
```javascript
if (!usuarioEncontrado) {
  return { exito: false, mensaje: '...' };
}
```
- `!usuarioEncontrado` es true si el usuario no existe (undefined)
- Retornamos un objeto con `exito: false` para indicar error
- El componente que llama esta función sabrá que falló

#### PASO 3: Validar Contraseña
```javascript
if (usuarioEncontrado.password !== password) {
  return { exito: false, mensaje: '...' };
}
```
- Comparamos la contraseña ingresada con la almacenada
- `!==` es el operador de "no es estrictamente igual"
- Si no coinciden, retornamos error

#### PASO 4: Crear Objeto de Sesión
```javascript
const sesionUsuario = {
  email: usuarioEncontrado.email,
  nombre: usuarioEncontrado.nombre,
  rol: usuarioEncontrado.rol,
  fechaIngreso: new Date().toISOString()
};
```
- Creamos un nuevo objeto SIN la contraseña (seguridad)
- Incluimos solo los datos necesarios para la sesión
- `new Date().toISOString()` genera un timestamp
- Ejemplo: "2025-11-29T15:30:00.000Z"

#### PASO 5: Persistir Sesión
```javascript
setUsuario(sesionUsuario);
localStorage.setItem('usuario', JSON.stringify(sesionUsuario));
```
- `setUsuario()` actualiza el estado de React (memoria)
- `localStorage.setItem()` guarda en el navegador (disco)
- `JSON.stringify()` convierte el objeto a texto
- Esto permite que la sesión persista al recargar la página

#### PASO 6: Retornar Éxito
```javascript
return {
  exito: true,
  mensaje: 'Inicio de sesión exitoso',
  usuario: sesionUsuario
};
```
- Retornamos un objeto indicando que todo salió bien
- El componente que llama puede verificar `resultado.exito`

---

### 1.3 FUNCIÓN: esAdmin()

```javascript
const esAdmin = () => {
  return usuario !== null && usuario.rol === 'admin';
};
```

**¿Qué hace?**
- Verifica si el usuario actual es administrador

**¿Cómo funciona?**
- Primero verifica que haya un usuario autenticado (`usuario !== null`)
- Luego verifica que su rol sea `'admin'`
- El operador `&&` retorna `true` solo si AMBAS condiciones son verdaderas

**Ejemplo de uso:**
```javascript
const { esAdmin } = useAuth();

if (esAdmin()) {
  // Mostrar botón "Eliminar producto"
}
```

---

### 1.4 FUNCIÓN: obtenerRol()

```javascript
const obtenerRol = () => {
  return usuario ? usuario.rol : null;
};
```

**¿Qué hace?**
- Devuelve el rol del usuario actual

**¿Cómo funciona?**
- Operador ternario: `condición ? valorSiTrue : valorSiFalse`
- Si `usuario` existe, retorna `usuario.rol`
- Si `usuario` es null, retorna `null`

**Ejemplo de uso:**
```javascript
const { obtenerRol } = useAuth();
const rol = obtenerRol();

return <span>Tu rol es: {rol || 'Invitado'}</span>;
```

---

## 🖥️ PARTE 2: IniciarSesion.jsx - La Interfaz de Usuario

### 2.1 ESTADOS DEL COMPONENTE

```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [mostrarPassword, setMostrarPassword] = useState(false);
const [error, setError] = useState('');
```

**¿Qué hace cada estado?**

1. **email**: Almacena el email que el usuario escribe
2. **password**: Almacena la contraseña que el usuario escribe
3. **mostrarPassword**: Controla si la contraseña es visible o no
4. **error**: Almacena mensajes de error para mostrar al usuario

---

### 2.2 FUNCIÓN: manejarSubmit(e)

```javascript
const manejarSubmit = (e) => {
  e.preventDefault();
  setError('');

  // VALIDACIÓN 1: Email no vacío
  if (!email.trim()) {
    setError('Por favor, ingresa tu email');
    return;
  }

  // VALIDACIÓN 2: Formato de email
  if (!validarEmail(email)) {
    setError('Por favor, ingresa un email válido');
    return;
  }

  // VALIDACIÓN 3: Contraseña no vacía
  if (!password.trim()) {
    setError('Por favor, ingresa tu contraseña');
    return;
  }

  // AUTENTICACIÓN
  const resultado = iniciarSesion(email, password);
  
  if (resultado.exito) {
    navigate(from, { replace: true });
  } else {
    setError(resultado.mensaje);
  }
};
```

**FLUJO COMPLETO:**

1. **Prevenir recarga**: `e.preventDefault()` evita que el formulario recargue la página
2. **Limpiar errores**: `setError('')` borra mensajes de error anteriores
3. **Validar email**: Verifica que no esté vacío y tenga formato correcto
4. **Validar contraseña**: Verifica que no esté vacía
5. **Intentar autenticar**: Llama a `iniciarSesion()` del contexto
6. **Manejar resultado**:
   - Si `resultado.exito` es true → Redirigir al usuario
   - Si `resultado.exito` es false → Mostrar mensaje de error

---

### 2.3 INPUT DE CONTRASEÑA CON MOSTRAR/OCULTAR

```javascript
<input
  type={mostrarPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

<button
  type="button"
  onClick={() => setMostrarPassword(!mostrarPassword)}
>
  {mostrarPassword ? '🙈' : '👁️'}
</button>
```

**¿Cómo funciona?**

1. **Tipo dinámico**: 
   - Si `mostrarPassword` es true → `type="text"` (visible)
   - Si `mostrarPassword` es false → `type="password"` (oculta)

2. **Botón toggle**:
   - `onClick` invierte el valor: `!mostrarPassword`
   - Si era true, lo pone en false
   - Si era false, lo pone en true

3. **Icono dinámico**:
   - Muestra 🙈 cuando la contraseña está visible
   - Muestra 👁️ cuando la contraseña está oculta

---

## 🎨 PARTE 3: CÓMO USAR EL SISTEMA EN OTROS COMPONENTES

### Ejemplo 1: Mostrar Información del Usuario

```javascript
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { usuario, esAdmin, obtenerRol } = useAuth();
  
  return (
    <div>
      <h1>Bienvenido, {usuario?.nombre}</h1>
      <p>Email: {usuario?.email}</p>
      <p>Rol: {obtenerRol()}</p>
      
      {esAdmin() && (
        <p style={{ color: 'gold' }}>⭐ Eres administrador</p>
      )}
    </div>
  );
}
```

**Explicación:**
- `usuario?.nombre` usa optional chaining para evitar errores si usuario es null
- `esAdmin()` retorna true/false para mostrar contenido condicional
- `{esAdmin() && <p>...</p>}` solo renderiza si esAdmin() es true

---

### Ejemplo 2: Botón Solo para Admins

```javascript
import { useAuth } from '../context/AuthContext';

function ProductoCard({ producto }) {
  const { esAdmin } = useAuth();
  
  return (
    <div className="producto">
      <h3>{producto.nombre}</h3>
      <p>${producto.precio}</p>
      
      {/* Este botón solo aparece para administradores */}
      {esAdmin() && (
        <button onClick={() => eliminarProducto(producto.id)}>
          🗑️ Eliminar
        </button>
      )}
    </div>
  );
}
```

---

### Ejemplo 3: Proteger Rutas Solo para Admins

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaSoloAdmin({ children }) {
  const { esAdmin, cargando } = useAuth();
  
  if (cargando) {
    return <div>Cargando...</div>;
  }
  
  if (!esAdmin()) {
    // Redirigir si no es admin
    return <Navigate to="/" replace />;
  }
  
  // Mostrar contenido si es admin
  return children;
}

// Uso en App.jsx:
<Route path="/admin" element={
  <RutaSoloAdmin>
    <PanelAdmin />
  </RutaSoloAdmin>
} />
```

---

## 🔑 PARTE 4: CONCEPTOS CLAVE DE JAVASCRIPT/REACT

### 4.1 Array.find()
```javascript
const frutas = ['manzana', 'banana', 'naranja'];
const resultado = frutas.find(fruta => fruta === 'banana');
// resultado = 'banana'

const usuario = usuarios.find(u => u.email === 'admin@gmail.com.ar');
// Retorna el objeto usuario si lo encuentra, undefined si no
```

### 4.2 Operador && (AND lógico)
```javascript
// En expresiones booleanas:
true && true = true
true && false = false
false && cualquierCosa = false

// En JSX (renderizado condicional):
{condicion && <Componente />}
// Si condicion es true, renderiza el Componente
// Si condicion es false, no renderiza nada
```

### 4.3 Operador Ternario
```javascript
condicion ? valorSiTrue : valorSiFalse

// Ejemplos:
const edad = 20;
const tipo = edad >= 18 ? 'adulto' : 'menor';
// tipo = 'adulto'

const inputType = mostrar ? "text" : "password";
// Si mostrar es true, type="text"
// Si mostrar es false, type="password"
```

### 4.4 Optional Chaining (?.)
```javascript
// Sin optional chaining (puede causar error):
const nombre = usuario.perfil.nombre; // Error si usuario o perfil son null

// Con optional chaining (seguro):
const nombre = usuario?.perfil?.nombre; // undefined si algo es null
```

### 4.5 localStorage
```javascript
// Guardar:
localStorage.setItem('clave', 'valor');
localStorage.setItem('usuario', JSON.stringify(objetoUsuario));

// Leer:
const valor = localStorage.getItem('clave');
const usuario = JSON.parse(localStorage.getItem('usuario'));

// Eliminar:
localStorage.removeItem('clave');

// Limpiar todo:
localStorage.clear();
```

---

## 🚀 PARTE 5: PRÓXIMOS PASOS - FUNCIONES ADMIN

Ahora que tenemos el sistema base, podemos agregar funciones específicas para el administrador:

### Funciones Sugeridas:

1. **Gestión de Productos**
   - Agregar nuevos productos
   - Editar productos existentes
   - Eliminar productos
   - Cambiar precios

2. **Gestión de Órdenes**
   - Ver todas las órdenes de compra
   - Cambiar estado de órdenes (pendiente, enviado, entregado)
   - Cancelar órdenes

3. **Estadísticas**
   - Total de ventas
   - Productos más vendidos
   - Ingresos por período

4. **Gestión de Usuarios**
   - Ver lista de usuarios registrados
   - Bloquear/desbloquear usuarios
   - Cambiar roles (promover a admin)

### ¿Cómo implementar estas funciones?

Cada función seguirá este patrón:

```javascript
// En el componente:
import { useAuth } from '../context/AuthContext';

function FuncionAdmin() {
  const { esAdmin } = useAuth();
  
  // Protección: Solo ejecutar si es admin
  if (!esAdmin()) {
    return <Navigate to="/" />;
  }
  
  const handleEliminarProducto = (id) => {
    // Lógica de eliminación
  };
  
  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* Contenido solo para admins */}
    </div>
  );
}
```

---

## 📝 PARTE 6: RESUMEN DE LO QUE HICIMOS

1. ✅ **Creamos una base de datos** de usuarios con credenciales
2. ✅ **Modificamos iniciarSesion()** para validar email y contraseña
3. ✅ **Agregamos campo `rol`** a los usuarios (admin/usuario)
4. ✅ **Creamos función esAdmin()** para verificar permisos
5. ✅ **Creamos función obtenerRol()** para obtener el rol actual
6. ✅ **Actualizamos el formulario** de login con campo de contraseña
7. ✅ **Agregamos botón** para mostrar/ocultar contraseña
8. ✅ **Implementamos validación** completa de credenciales

---

## 🎓 CONCLUSIÓN

Este sistema es la base para implementar funcionalidades específicas de administrador. La arquitectura está lista para:

- Agregar más usuarios fácilmente
- Crear nuevos roles (ej: "moderador", "vendedor")
- Implementar funciones protegidas por rol
- Escalar a un backend real cuando sea necesario

**Credenciales actuales:**
- Email: `admin@gmail.com.ar`
- Contraseña: `admin`

¡El sistema está funcionando y listo para agregar funcionalidades administrativas! 🎉
