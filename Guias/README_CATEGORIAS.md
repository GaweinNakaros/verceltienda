# Sistema de Gestión de Categorías

> Tipo: Subsistema | Propósito: Administración y visualización de categorías consumibles en sliders y filtros. Índice general: `./README.md`.

## 📋 Descripción

Sistema completo y administrable de gestión de categorías con contexto global y componente reutilizable. Diseñado para ser fácilmente gestionado desde un futuro panel de administración.

## 🎯 Características

- ✅ **Context API** - Estado global de categorías accesible desde cualquier componente
- ✅ **CRUD Completo** - Crear, leer, actualizar y eliminar categorías
- ✅ **Activar/Desactivar** - Toggle de visibilidad sin eliminar
- ✅ **Reordenamiento** - Cambiar el orden de visualización
- ✅ **Componente Reutilizable** - Slider de categorías configurable
- ✅ **Responsive** - Adaptable a todos los tamaños de pantalla
- ✅ **Imágenes dinámicas** - Soporte para URLs personalizadas
- ✅ **API Ready** - Integrado con MockAPI, fácil migrar a admin panel

## 📦 Estructura del Sistema

```
src/
├── context/
│   └── CategoriasContext.jsx    # Contexto global con funciones CRUD
├── components/
│   ├── CategoriasSlider.jsx     # Componente visual reutilizable
│   └── CategoriasSlider.css     # Estilos del componente
└── pages/
    └── inicio.jsx                # Implementación ejemplo
```

## 🚀 Uso Básico

### 1. El Context ya está configurado en App.jsx

```jsx
<CategoriasProvider>
  {/* Tu aplicación */}
</CategoriasProvider>
```

### 2. Usar el componente CategoriasSlider

```jsx
import CategoriasSlider from '../components/CategoriasSlider'

function MiComponente() {
  return (
    <CategoriasSlider
      titulo="Categorías"
      mostrarTitulo={true}
      soloActivas={true}
    />
  );
}
```

## ⚙️ Props del Componente CategoriasSlider

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `titulo` | `string` | `"Categorías"` | Título de la sección |
| `mostrarTitulo` | `boolean` | `true` | Si mostrar el título |
| `soloActivas` | `boolean` | `true` | Mostrar solo categorías activas |
| `categoriasVisiblesDesktop` | `number` | `6` | Categorías visibles en desktop |
| `categoriasVisiblesTablet` | `number` | `4` | Categorías visibles en tablet |
| `categoriasVisiblesMobile` | `number` | `3` | Categorías visibles en mobile |
| `className` | `string` | `''` | Clases CSS adicionales |
| `onCategoriaClick` | `Function` | `null` | Callback personalizado al hacer click |

## 🔧 API del Context (Funciones Administrativas)

### Importar el hook

```jsx
import { useCategorias } from '../context/CategoriasContext'

function AdminPanel() {
  const {
    categorias,
    loading,
    error,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    toggleCategoria,
    reordenarCategorias,
    obtenerCategoriasActivas,
    buscarCategoria
  } = useCategorias();
}
```

### Funciones Disponibles

#### 📖 **Lectura**

```jsx
// Obtener todas las categorías
const { categorias } = useCategorias();

// Obtener solo activas
const activas = obtenerCategoriasActivas();

// Buscar una categoría específica
const categoria = buscarCategoria('Electrónica');
```

#### ➕ **Agregar Categoría**

```jsx
agregarCategoria(
  'Nueva Categoría',
  'https://images.unsplash.com/photo-xxx' // URL opcional
);
```

#### ✏️ **Actualizar Categoría**

```jsx
actualizarCategoria(1, {
  nombre: 'Electrónica Actualizada',
  icono: 'https://nueva-imagen.jpg',
  orden: 5
});
```

#### 🗑️ **Eliminar Categoría**

```jsx
eliminarCategoria(1); // Eliminar por ID
```

#### 🔄 **Activar/Desactivar**

```jsx
toggleCategoria(1); // Toggle activa/inactiva
```

#### 🔢 **Reordenar**

```jsx
const nuevasCategoriasOrdenadas = [
  { id: 3, nombre: 'Deportes', ... },
  { id: 1, nombre: 'Electrónica', ... },
  { id: 2, nombre: 'Ropa', ... }
];

reordenarCategorias(nuevasCategoriasOrdenadas);
```

#### 🔄 **Recargar desde API**

```jsx
await cargarCategorias(); // Refetch desde MockAPI
```

## 📊 Estructura de Objeto Categoría

```typescript
{
  id: number,           // ID único
  nombre: string,       // Nombre de la categoría
  icono: string | null, // URL de la imagen
  activa: boolean,      // Si está visible o no
  orden: number         // Posición en el orden
}
```

## 🎨 Ejemplos de Uso Avanzado

### Panel de Administración (Ejemplo)

```jsx
function AdminCategorias() {
  const {
    categorias,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    toggleCategoria
  } = useCategorias();

  const handleAgregarCategoria = () => {
    const nombre = prompt('Nombre de la categoría:');
    const icono = prompt('URL de la imagen:');
    if (nombre) {
      agregarCategoria(nombre, icono);
    }
  };

  const handleEditarCategoria = (id) => {
    const categoria = categorias.find(c => c.id === id);
    const nuevoNombre = prompt('Nuevo nombre:', categoria.nombre);
    if (nuevoNombre) {
      actualizarCategoria(id, { nombre: nuevoNombre });
    }
  };

  return (
    <div>
      <h1>Administrar Categorías</h1>
      <button onClick={handleAgregarCategoria}>+ Nueva Categoría</button>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Activa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nombre}</td>
              <td>
                <input
                  type="checkbox"
                  checked={cat.activa}
                  onChange={() => toggleCategoria(cat.id)}
                />
              </td>
              <td>
                <button onClick={() => handleEditarCategoria(cat.id)}>
                  Editar
                </button>
                <button onClick={() => eliminarCategoria(cat.id)}>
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

### Slider con Click Personalizado

```jsx
<CategoriasSlider
  titulo="Explora Categorías"
  soloActivas={true}
  onCategoriaClick={(nombreCategoria) => {
    console.log(`Categoría seleccionada: ${nombreCategoria}`);
    // Lógica personalizada
    alert(`Has seleccionado: ${nombreCategoria}`);
  }}
/>
```

### Mostrar Todas (incluidas inactivas)

```jsx
<CategoriasSlider
  titulo="Todas las Categorías"
  soloActivas={false}
  mostrarTitulo={true}
/>
```

### Slider Compacto

```jsx
<CategoriasSlider
  titulo="Categorías Populares"
  categoriasVisiblesDesktop={8}
  categoriasVisiblesTablet={5}
  categoriasVisiblesMobile={4}
  className="slider-compacto"
/>
```

## 🔄 Integración con Panel de Admin Futuro

El sistema está diseñado para integrarse fácilmente con un panel de admin:

### Backend API Endpoints Sugeridos

```javascript
// GET /api/categorias
// Respuesta: Array de categorías

// POST /api/categorias
// Body: { nombre, icono, activa, orden }

// PUT /api/categorias/:id
// Body: { nombre?, icono?, activa?, orden? }

// DELETE /api/categorias/:id

// PATCH /api/categorias/reordenar
// Body: [{ id, orden }, ...]
```

### Actualizar Context para usar API real

En `CategoriasContext.jsx`, reemplaza la función `cargarCategorias`:

```jsx
const cargarCategorias = async () => {
  try {
    setLoading(true);
    const response = await fetch("TU_API_ENDPOINT/categorias");
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const data = await response.json();
    setCategorias(data);
    setError(null);
    
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Agregar categoría con API

```jsx
const agregarCategoria = async (nombre, icono = null) => {
  try {
    const response = await fetch("TU_API_ENDPOINT/categorias", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, icono, activa: true })
    });
    
    if (!response.ok) throw new Error('Error al agregar categoría');
    
    const nuevaCategoria = await response.json();
    setCategorias([...categorias, nuevaCategoria]);
    
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 📱 Responsive

El componente se adapta automáticamente:

- **Desktop** (>768px): Hasta 6+ categorías visibles
- **Tablet** (480-768px): 4-5 categorías visibles
- **Mobile** (<480px): 3-4 categorías visibles

Flechas de navegación aparecen solo cuando hay desbordamiento.

## ⚡ Performance

- **Lazy Loading**: Listo para implementar carga diferida de imágenes
- **Memoización**: Context optimizado para evitar renders innecesarios
- **Transiciones CSS**: Animaciones con GPU para fluidez

## 📄 Licencia

Sistema interno del proyecto Pre-entrega-react
