# Sistema de Gestión de Promociones Destacadas

> Tipo: Subsistema | Propósito: Crear y mostrar promociones (ofertas/avisos) con control de vigencia y estado. Índice: `./README.md`.

## 📋 Descripción

Sistema completo y administrable de promociones destacadas con contexto global y componente reutilizable. Diseñado para gestionar ofertas, descuentos y anuncios especiales desde un panel de administración.

## 🎯 Características

- ✅ **Context API** - Estado global de promociones accesible desde cualquier componente
- ✅ **CRUD Completo** - Crear, leer, actualizar y eliminar promociones
- ✅ **Activar/Desactivar** - Toggle de visibilidad sin eliminar
- ✅ **Reordenamiento** - Cambiar el orden de visualización
- ✅ **Promociones Destacadas** - Marcar promociones especiales con estilo distintivo
- ✅ **Fechas de vigencia** - Programar inicio y fin de promociones
- ✅ **Iconos personalizados** - Soporte para imágenes o componentes React
- ✅ **Componente Reutilizable** - Configurable y responsive
- ✅ **Admin Ready** - Preparado para panel de administración

## 📦 Estructura del Sistema

```
src/
├── context/
│   └── PromocionesContext.jsx      # Contexto global con funciones CRUD
├── components/
│   ├── PromocionesDestacadas.jsx   # Componente visual reutilizable
│   └── PromocionesDestacadas.css   # Estilos del componente
└── pages/
    └── inicio.jsx                   # Implementación ejemplo
```

## 🚀 Uso Básico

### 1. El Context ya está configurado en App.jsx

```jsx
<PromocionesProvider>
  {/* Tu aplicación */}
</PromocionesProvider>
```

### 2. Usar el componente PromocionesDestacadas

```jsx
import PromocionesDestacadas from '../components/PromocionesDestacadas'

function MiComponente() {
  return (
    <PromocionesDestacadas
      soloActivas={true}
      limite={3}
    />
  );
}
```

## ⚙️ Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `promociones` | `Array` | `null` | Array personalizado (usa context si es null) |
| `className` | `string` | `''` | Clases CSS adicionales |
| `mostrarSeccion` | `boolean` | `true` | Si mostrar la sección |
| `soloActivas` | `boolean` | `true` | Mostrar solo promociones activas |
| `limite` | `number` | `null` | Límite de promociones a mostrar |

## 🔧 API del Context (Funciones Administrativas)

### Importar el hook

```jsx
import { usePromociones } from '../context/PromocionesContext'

function AdminPanel() {
  const {
    promociones,
    agregarPromocion,
    actualizarPromocion,
    eliminarPromocion,
    togglePromocion,
    reordenarPromociones,
    obtenerPromocionesActivas,
    obtenerPromocionDestacada,
    buscarPromocion,
    duplicarPromocion,
    contarPromocionesActivas
  } = usePromociones();
}
```

### Funciones Disponibles

#### 📖 **Lectura**

```jsx
// Obtener todas las promociones
const { promociones } = usePromociones();

// Obtener solo activas
const activas = obtenerPromocionesActivas();

// Obtener la destacada
const destacada = obtenerPromocionDestacada();

// Buscar por ID
const promo = buscarPromocion(1);

// Contar activas
const total = contarPromocionesActivas();
```

#### ➕ **Agregar Promoción**

```jsx
agregarPromocion(
  "Black Friday",                    // título
  "Hasta 50% de descuento",          // descripción
  true,                              // destacada
  "https://icono.jpg"                // icono (opcional)
);
```

#### ✏️ **Actualizar Promoción**

```jsx
actualizarPromocion(1, {
  titulo: "Super Oferta",
  descripcion: "Nuevos descuentos",
  destacada: true,
  fechaInicio: "2025-11-01",
  fechaFin: "2025-11-30"
});
```

#### 🗑️ **Eliminar Promoción**

```jsx
eliminarPromocion(1); // Eliminar por ID
```

#### 🔄 **Activar/Desactivar**

```jsx
togglePromocion(1); // Toggle activa/inactiva
```

#### 📋 **Duplicar Promoción**

```jsx
duplicarPromocion(1); // Crea una copia
```

#### 🔢 **Reordenar**

```jsx
const nuevasPromocionesOrdenadas = [
  { id: 3, titulo: "Promo 3", ... },
  { id: 1, titulo: "Promo 1", ... },
  { id: 2, titulo: "Promo 2", ... }
];

reordenarPromociones(nuevasPromocionesOrdenadas);
```

## 📊 Estructura de Objeto Promoción

```typescript
{
  id: number,              // ID único
  titulo: string,          // Título de la promoción
  descripcion: string,     // Descripción breve
  destacada: boolean,      // Si tiene estilo destacado
  icono: string | null,    // URL de imagen o componente React
  activa: boolean,         // Si está visible
  orden: number,           // Posición en el orden
  fechaInicio: string,     // Fecha inicio (ISO) - opcional
  fechaFin: string         // Fecha fin (ISO) - opcional
}
```

## 🎨 Ejemplos de Uso Avanzado

### Panel de Administración

```jsx
function AdminPromociones() {
  const {
    promociones,
    agregarPromocion,
    actualizarPromocion,
    eliminarPromocion,
    togglePromocion,
    duplicarPromocion
  } = usePromociones();

  const handleAgregar = () => {
    const titulo = prompt('Título:');
    const descripcion = prompt('Descripción:');
    const destacada = confirm('¿Es destacada?');
    
    if (titulo && descripcion) {
      agregarPromocion(titulo, descripcion, destacada);
    }
  };

  return (
    <div>
      <h1>Administrar Promociones</h1>
      <button onClick={handleAgregar}>+ Nueva Promoción</button>
      
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Destacada</th>
            <th>Activa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {promociones.map(promo => (
            <tr key={promo.id}>
              <td>{promo.titulo}</td>
              <td>{promo.descripcion}</td>
              <td>{promo.destacada ? '⭐' : ''}</td>
              <td>
                <input
                  type="checkbox"
                  checked={promo.activa}
                  onChange={() => togglePromocion(promo.id)}
                />
              </td>
              <td>
                <button onClick={() => duplicarPromocion(promo.id)}>
                  Duplicar
                </button>
                <button onClick={() => eliminarPromocion(promo.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Promociones con Fechas

```jsx
// Agregar promoción temporal
agregarPromocion("Cyber Monday", "72hs de ofertas", true, null);

// Actualizar con fechas
actualizarPromocion(promoId, {
  fechaInicio: "2025-11-27T00:00:00",
  fechaFin: "2025-11-29T23:59:59"
});

// Las promociones fuera del rango de fechas no aparecerán
// automáticamente en obtenerPromocionesActivas()
```

### Mostrar Solo 2 Promociones

```jsx
<PromocionesDestacadas
  soloActivas={true}
  limite={2}
  className="promociones-compactas"
/>
```

### Promociones con Array Personalizado

```jsx
const promocionesEspeciales = [
  {
    id: 99,
    titulo: "Promo Especial",
    descripcion: "Solo hoy",
    destacada: true,
    icono: null
  }
];

<PromocionesDestacadas
  promociones={promocionesEspeciales}
  soloActivas={false}
/>
```

### Promoción con Icono Personalizado

```jsx
agregarPromocion(
  "Envío Gratis",
  "En todas las compras",
  true,
  <TruckIcon /> // Componente React como icono
);
```

## 🎨 Personalización de Estilos

### Colores Destacada

Modificar en `PromocionesDestacadas.css`:

```css
.promo-card.promo-destacada {
  background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
}
```

### Altura de Cards

```css
.promo-card {
  height: 60px; /* Cambiar altura */
}
```

### Animaciones

```css
.promo-card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
}
```

## 📱 Responsive

- **Desktop**: 3 cards en fila
- **Tablet** (<768px): 2 cards en fila
- **Mobile** (<480px): 1 card por fila (columna)

## 🔄 Integración con API Backend

### Cargar desde API

```jsx
useEffect(() => {
  fetch('/api/promociones')
    .then(res => res.json())
    .then(data => {
      // Actualizar estado con data
      data.forEach(promo => agregarPromocion(...));
    });
}, []);
```

### Guardar en API

```jsx
const agregarPromocion = async (titulo, descripcion, destacada, icono) => {
  const response = await fetch('/api/promociones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descripcion, destacada, icono })
  });
  
  const nuevaPromo = await response.json();
  setPromociones([...promociones, nuevaPromo]);
};
```

## ⚡ Performance

- **Filtrado inteligente**: Solo renderiza promociones activas y dentro del rango de fechas
- **Orden optimizado**: Las promociones se ordenan por campo `orden`
- **Límite configurable**: Controla cuántas promociones renderizar

## 📄 Licencia

Sistema interno del proyecto Pre-entrega-react
