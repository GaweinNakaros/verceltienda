# 📚 Glosario de Conceptos y Sintaxis de React

> Este glosario resume la sintaxis y patrones usados actualmente en el proyecto (React + Vite, Context, Helmet, Toastify, styled-components). Úsalo como referencia rápida. Para ejemplos prácticos ve `EJEMPLOS_USO.md`.

Guía completa de los conceptos y sintaxis más importantes que encontrarás en este proyecto React.

---

## 📑 Índice

1. [Hooks de React](#1-hooks-de-react)
2. [Context API](#2-context-api)
3. [Destructuring (Desestructuración)](#3-destructuring-desestructuración)
4. [Spread Operator (...)](#4-spread-operator-)
5. [Arrow Functions (Funciones Flecha)](#5-arrow-functions-funciones-flecha)
6. [Template Literals (Plantillas de Texto)](#6-template-literals-plantillas-de-texto)
7. [Operadores Lógicos para Renderizado](#7-operadores-lógicos-para-renderizado)
8. [Array Methods (Métodos de Arrays)](#8-array-methods-métodos-de-arrays)
9. [Eventos en React](#9-eventos-en-react)
10. [Props y Children](#10-props-y-children)
11. [Object Methods (Métodos de Objetos)](#11-object-methods-métodos-de-objetos)
12. [Computed Property Names](#12-computed-property-names)
13. [Expresiones Regulares (Regex)](#13-expresiones-regulares-regex)
14. [Async/Await](#14-asyncawait)

---

## 1. Hooks de React (estado y efectos)

> **HOOKS:** Funciones especiales que permiten "engancharse" a características de React. Siempre empiezan con "use" (useState, useEffect, useContext, etc.). Solo se pueden usar dentro de componentes funcionales.

### useState (estado local)

Maneja estado local en un componente. Retorna un array con 2 elementos: `[valorActual, funcionParaActualizarlo]`

```javascript
import { useState } from 'react';

function Ejemplo1() {
  // Sintaxis de destructuring de arrays
  const [contador, setContador] = useState(0);
  //     ↑          ↑                        ↑
  //   valor     función               valor inicial
  //  actual   actualizadora
  
  // Para actualizar el estado:
  setContador(contador + 1); // Nuevo valor directamente
  
  // O con función (cuando el nuevo valor depende del anterior):
  setContador(prevContador => prevContador + 1);
}
```

**📌 Puntos clave:**
- Primer elemento: valor actual del estado
- Segundo elemento: función para actualizar el estado
- El argumento es el valor inicial del estado

---

### useEffect (efectos secundarios)

Ejecuta código después de que el componente se renderiza. Útil para efectos secundarios: APIs, suscripciones, timers, etc.

```javascript
import { useEffect } from 'react';

function Ejemplo2() {
  useEffect(() => {
    // Código que se ejecuta después del renderizado
    console.log('Componente montado o actualizado');
    
    // Función de limpieza (opcional)
    return () => {
      console.log('Componente desmontado o antes de siguiente efecto');
    };
  }, []); // Array de dependencias
}
```

**Array de dependencias:**
- `[]` vacío = solo se ejecuta al montar
- `[variable]` = se ejecuta cuando 'variable' cambia
- sin array = se ejecuta después de cada renderizado

---

### useContext (acceso a contextos)

Accede al valor de un contexto sin usar Consumer. Simplifica el acceso a datos compartidos globalmente.

```javascript
import { useContext } from 'react';

const MiContexto = React.createContext();

function Ejemplo3() {
  const valor = useContext(MiContexto);
  // 'valor' contiene lo que se pasó en <MiContexto.Provider value={...}>
}
```

---

### useNavigate (react-router-dom) navegación programática

Permite navegar programáticamente entre rutas. Es el reemplazo moderno de `history.push()`

```javascript
import { useNavigate } from 'react-router-dom';

function Ejemplo4() {
  const navigate = useNavigate();
  
  const irAOtraPagina = () => {
    navigate('/otra-ruta');
    // navigate(-1); // Volver atrás
    // navigate('/ruta', { replace: true }); // Reemplazar en historial
  };
}
```

---

### useLocation (react-router-dom) información de ruta

Devuelve el objeto location actual. Útil para saber en qué ruta estamos o qué parámetros hay.

```javascript
import { useLocation } from 'react-router-dom';

function Ejemplo5() {
  const location = useLocation();
  // location.pathname = '/productos'
  // location.search = '?id=123'
  // location.state = datos pasados en navigate('/ruta', { state: {...} })
}
```

---

## 2. Context API

> Context permite pasar datos a través del árbol de componentes sin tener que pasar props manualmente en cada nivel.

### Crear un Context

```javascript
import { createContext } from 'react';

// Crear el contexto
const MiContexto = createContext();
```

### Provider: Provee el valor del contexto

```javascript
function MiProvider({ children }) {
  const [datos, setDatos] = useState('valor inicial');
  
  return (
    <MiContexto.Provider value={{ datos, setDatos }}>
      {children}
    </MiContexto.Provider>
  );
}
```

### Consumer: Consume el valor del contexto

```javascript
function ComponenteHijo() {
  const { datos, setDatos } = useContext(MiContexto);
  return <div>{datos}</div>;
}
```

---

## 3. Destructuring (Desestructuración)

> Sintaxis para extraer valores de objetos y arrays de forma más concisa.

### Destructuring de Objetos

```javascript
const persona = {
  nombre: 'Juan',
  edad: 25,
  ciudad: 'Madrid'
};

// Sin destructuring:
const nombre = persona.nombre;
const edad = persona.edad;

// Con destructuring:
const { nombre, edad } = persona;
// Crea dos variables: nombre = 'Juan', edad = 25

// Con renombre:
const { nombre: nombreCompleto } = persona;
// Crea variable: nombreCompleto = 'Juan'
```

### Destructuring de Arrays

```javascript
const numeros = [1, 2, 3, 4, 5];

// Sin destructuring:
const primero = numeros[0];
const segundo = numeros[1];

// Con destructuring:
const [primero, segundo] = numeros;
// Crea dos variables: primero = 1, segundo = 2

// Con useState:
const [valor, setValor] = useState(0);
//     ↑       ↑
//  posición 0  posición 1 del array retornado
```

---

## 4. Spread Operator (...)

> Expande elementos de un iterable (array u objeto).

### Con Arrays

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combinar arrays:
const combinado = [...arr1, ...arr2];
// [1, 2, 3, 4, 5, 6]

// Copiar array:
const copia = [...arr1];
// [1, 2, 3] (nuevo array)
```

### Con Objetos

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Combinar objetos:
const combinadoObj = { ...obj1, ...obj2 };
// { a: 1, b: 2, c: 3, d: 4 }

// Copiar y modificar:
const modificado = { ...obj1, b: 10 };
// { a: 1, b: 10 } (b se sobrescribe)

// Uso en setState:
setFormData(prev => ({
  ...prev,      // Copia todas las propiedades existentes
  nombre: 'Juan' // Sobrescribe/agrega 'nombre'
}));
```

---

## 5. Arrow Functions (Funciones Flecha)

> Sintaxis moderna y más concisa para definir funciones.

### Sintaxis Básica

```javascript
// Función tradicional:
function sumar(a, b) {
  return a + b;
}

// Arrow function:
const sumar = (a, b) => {
  return a + b;
};

// Arrow function (retorno implícito):
const sumar = (a, b) => a + b;
// Si solo hay una expresión, se puede omitir return y {}

// Un solo parámetro (sin paréntesis):
const duplicar = x => x * 2;

// Sin parámetros:
const saludar = () => console.log('Hola');
```

### En Eventos

```javascript
// onClick con arrow function
<button onClick={() => console.log('Click')}>
  Click me
</button>

// Con parámetro:
<button onClick={() => eliminarProducto(id)}>
  Eliminar
</button>
```

---

## 6. Template Literals (Plantillas de Texto)

> Strings con backticks (`` ` ``) que permiten interpolar variables.

```javascript
// Sintaxis tradicional:
const nombre = 'Juan';
const mensaje = 'Hola, ' + nombre + '!';

// Con template literals:
const mensaje = `Hola, ${nombre}!`;

// Multilínea:
const html = `
  <div>
    <h1>${titulo}</h1>
    <p>${descripcion}</p>
  </div>
`;

// Expresiones:
const total = `El total es: $${precio * cantidad}`;
```

---

## 7. Operadores Lógicos para Renderizado

### Operador && (AND)

> Si la izquierda es truthy, evalúa y retorna la derecha. Si la izquierda es falsy, retorna la izquierda (no evalúa la derecha).

```javascript
// En renderizado:
{usuario && <p>Bienvenido, {usuario.nombre}</p>}
// Si usuario existe (truthy), muestra el <p>
// Si usuario es null/undefined (falsy), no muestra nada

{count > 0 && <span>({count})</span>}
// Solo muestra el span si count es mayor a 0
```

### Operador || (OR)

> Si la izquierda es truthy, retorna la izquierda. Si la izquierda es falsy, evalúa y retorna la derecha.

```javascript
// Valores por defecto:
const cantidad = item.cantidad || 1;
// Si cantidad es 0, null, undefined, '', usa 1

const nombre = usuario.nombre || 'Anónimo';
// Si no hay nombre, usa 'Anónimo'
```

### Operador Ternario (? :)

> `condicion ? siTrue : siFalse` - Es como un if-else en una sola línea.

```javascript
// En variables:
const mensaje = edad >= 18 ? 'Mayor de edad' : 'Menor de edad';

// En renderizado:
{carrito.length === 0 ? (
  <p>Carrito vacío</p>
) : (
  <ListaProductos />
)}
```

### Optional Chaining (?.)

> Acceso seguro a propiedades anidadas. Si algo es null/undefined, retorna undefined sin error.

```javascript
// Sin optional chaining (puede dar error):
const email = usuario.contacto.email; // Error si contacto es undefined

// Con optional chaining (seguro):
const email = usuario?.contacto?.email;
// Si usuario o contacto son null/undefined, email = undefined (sin error)

// Con llamadas a funciones:
usuario?.saludar?.();
// Solo llama a saludar() si usuario y saludar existen
```

---

## 8. Array Methods (Métodos de Arrays)

### map()

> Transforma cada elemento del array y retorna un nuevo array. No modifica el array original.

```javascript
const numeros = [1, 2, 3, 4];
const duplicados = numeros.map(num => num * 2);
// [2, 4, 6, 8]

// En React (renderizar listas):
{productos.map(producto => (
  <div key={producto.id}>
    {producto.nombre}
  </div>
))}
```

### filter()

> Filtra elementos que cumplan una condición. Retorna un nuevo array con los elementos que pasen el test.

```javascript
const numeros = [1, 2, 3, 4, 5, 6];
const pares = numeros.filter(num => num % 2 === 0);
// [2, 4, 6]
```

### find()

> Encuentra el PRIMER elemento que cumpla una condición. Retorna el elemento o undefined.

```javascript
const usuarios = [
  { id: 1, nombre: 'Juan' },
  { id: 2, nombre: 'María' }
];

const usuario = usuarios.find(u => u.id === 2);
// { id: 2, nombre: 'María' }
```

### reduce()

> Reduce el array a un solo valor. Acumula resultados.

```javascript
const numeros = [1, 2, 3, 4];
const suma = numeros.reduce((acumulador, numero) => acumulador + numero, 0);
//                             ↑            ↑                              ↑
//                         valor previo  valor actual              valor inicial
// suma = 10
```

---

## 9. Eventos en React

> Eventos en React usan camelCase (`onClick`, `onChange`, `onSubmit`). En HTML nativo se usa lowercase (`onclick`, `onchange`, `onsubmit`).

### onClick

```javascript
<button onClick={handleClick}>Click</button>
<button onClick={() => console.log('Click')}>Click</button>
<button onClick={() => eliminar(id)}>Eliminar</button>
```

### onChange

```javascript
<input 
  value={valor}
  onChange={(e) => setValor(e.target.value)}
/>
// e.target.value = el valor actual del input
```

### onSubmit

```javascript
<form onSubmit={handleSubmit}>
  <button type="submit">Enviar</button>
</form>

function handleSubmit(e) {
  e.preventDefault(); // Previene recargar la página
  // Procesar formulario...
}
```

---

## 10. Props y Children

> **Props:** Propiedades que se pasan de padre a hijo. **Children:** Contenido entre etiquetas de apertura y cierre.

### Props Básicas

```javascript
// Componente padre:
<Saludo nombre="Juan" edad={25} />

// Componente hijo:
function Saludo({ nombre, edad }) {
  return <p>Hola {nombre}, tienes {edad} años</p>;
}
```

### Children

```javascript
// Componente padre:
<Contenedor>
  <h1>Título</h1>
  <p>Párrafo</p>
</Contenedor>

// Componente hijo:
function Contenedor({ children }) {
  return (
    <div className="contenedor">
      {children} {/* Renderiza <h1> y <p> */}
    </div>
  );
}
```

---

## 11. Object Methods (Métodos de Objetos)

### Object.keys()

> Retorna un array con las claves del objeto.

```javascript
const obj = { a: 1, b: 2, c: 3 };
const claves = Object.keys(obj);
// ['a', 'b', 'c']

// Uso común: verificar si un objeto está vacío
if (Object.keys(errores).length > 0) {
  // Hay errores
}
```

### Object.values()

> Retorna un array con los valores del objeto.

```javascript
const valores = Object.values(obj);
// [1, 2, 3]
```

### Object.entries()

> Retorna un array de arrays `[clave, valor]`.

```javascript
const entradas = Object.entries(obj);
// [['a', 1], ['b', 2], ['c', 3]]
```

---

## 12. Computed Property Names

> Usar variables como nombres de propiedades en objetos. Se usan corchetes `[]`.

```javascript
const campo = 'nombre';
const valor = 'Juan';

// Sin computed property:
const obj = {};
obj[campo] = valor; // obj.nombre = 'Juan'

// Con computed property:
const obj = {
  [campo]: valor // { nombre: 'Juan' }
};

// Uso en setState:
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value // Actualiza la propiedad con el nombre del input
  }));
};
```

---

## 13. Expresiones Regulares (Regex)

> Patrones para buscar y validar strings.

### Sintaxis Básica

```javascript
const regex = /patrón/flags;

// Validar email:
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esValido = emailRegex.test('usuario@email.com'); // true
```

### Explicación del Patrón de Email

```
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

^        : Inicio del string
[^\s@]+  : Uno o más caracteres que NO sean espacio ni @
@        : El símbolo @
[^\s@]+  : Uno o más caracteres que NO sean espacio ni @
\.       : Un punto literal (\ escapa el punto)
[^\s@]+  : Uno o más caracteres que NO sean espacio ni @
$        : Fin del string
```

### Flags Comunes

- `i` = case insensitive (no distingue mayúsculas)
- `g` = global (encuentra todas las coincidencias)
- `m` = multiline

### Validar Solo Dígitos

```javascript
const soloDigitos = /^\d+$/;
// \d = cualquier dígito (0-9)
// + = uno o más
// ^ y $ = inicio y fin (asegura que TODO sea dígitos)
```

---

## 14. Async/Await

> Sintaxis para manejar código asíncrono de forma más legible.

### Con Promises (antiguo)

```javascript
fetch('/api/datos')
  .then(response => response.json())
  .then(datos => console.log(datos))
  .catch(error => console.error(error));
```

### Con async/await (moderno)

```javascript
async function obtenerDatos() {
  try {
    const response = await fetch('/api/datos');
    const datos = await response.json();
    console.log(datos);
  } catch (error) {
    console.error(error);
  }
}

// En eventos (arrow function):
const handleSubmit = async (e) => {
  e.preventDefault();
  const resultado = await procesarPago();
};
```

---

## 🎯 Resumen

Este glosario cubre los conceptos más importantes:

- ✅ **Hooks** - useState, useEffect, useContext, useNavigate, useLocation
- ✅ **Context API** - Compartir estado global
- ✅ **Destructuring** - Extraer valores de objetos/arrays
- ✅ **Spread Operator** - Expandir y copiar objetos/arrays
- ✅ **Arrow Functions** - Sintaxis moderna de funciones
- ✅ **Template Literals** - Strings con interpolación
- ✅ **Operadores Lógicos** - &&, ||, ?:, ?.
- ✅ **Array Methods** - map, filter, find, reduce
- ✅ **Eventos** - onClick, onChange, onSubmit
- ✅ **Props y Children** - Pasar datos entre componentes
- ✅ **Object Methods** - keys, values, entries
- ✅ **Computed Properties** - Nombres dinámicos de propiedades
- ✅ **Regex** - Validación de strings
- ✅ **Async/Await** - Código asíncrono

---

## 📚 Recursos Adicionales

- [EJEMPLOS_USO.md](./EJEMPLOS_USO.md) - 12 ejemplos prácticos
- [React Docs](https://react.dev/) - Documentación oficial de React
- [MDN (JavaScript)](https://developer.mozilla.org/) - Referencia de JavaScript
- [React Router](https://reactrouter.com/) - Documentación de React Router

---

**¡Sigue aprendiendo y mejorando tus habilidades en React! 🚀**
