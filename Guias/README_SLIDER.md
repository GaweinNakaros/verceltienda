# Componente Slider Reutilizable

> Tipo: Componente | Propósito: Renderizar colecciones de slides con autoplay, navegación y control programático. Índice: `./README.md`.

## 📋 Descripción

Sistema de slider completamente reutilizable que permite crear múltiples sliders independientes en cualquier parte de la aplicación. Incluye un contexto global (`SliderContext`) para gestionar el estado y un componente visual (`Slider`) altamente configurable.

## 🎯 Características

- ✅ **Múltiples sliders simultáneos** - Gestiona varios sliders independientes
- ✅ **Autoplay configurable** - Control de reproducción automática con intervalos personalizados
- ✅ **Navegación manual** - Indicadores y flechas opcionales
- ✅ **Pausa en hover** - Detiene autoplay al pasar el mouse
- ✅ **Responsive** - Adaptable a todos los tamaños de pantalla
- ✅ **Loop configurable** - Opción de loop infinito o detención al final
- ✅ **Transiciones suaves** - Animaciones CSS optimizadas

## 📦 Instalación / Integración

### 1. Importar el Provider en App.jsx

```jsx
import { SliderProvider } from './context/SliderContext'

function App() {
  return (
    <SliderProvider>
      {/* Tu aplicación */}
    </SliderProvider>
  )
}
```

### 2. Importar el componente donde lo necesites

```jsx
import Slider from '../components/Slider'
```

## 🚀 Uso Básico

```jsx
function MiComponente() {
  const slides = [
    { id: 1, titulo: "Slide 1", descripcion: "Descripción", imagen: null },
    { id: 2, titulo: "Slide 2", descripcion: "Descripción", imagen: "/imagen.jpg" },
    { id: 3, titulo: "Slide 3", descripcion: "Descripción", imagen: null }
  ];

  return (
    <Slider
      id="mi-slider-unico"
      slides={slides}
      intervalo={5000}
      loop={true}
      mostrarIndicadores={true}
      mostrarFlechas={false}
      altura="400px"
    />
  );
}
```

## ⚙️ Props del Componente Slider

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `id` | `string` | ✅ Sí | - | Identificador único del slider |
| `slides` | `Array` | ❌ No | `[]` | Array de objetos slide (ver estructura abajo) |
| `intervalo` | `number` | ❌ No | `5000` | Intervalo de autoplay en ms (0 = desactivado) |
| `loop` | `boolean` | ❌ No | `true` | Si debe hacer loop al llegar al final |
| `mostrarIndicadores` | `boolean` | ❌ No | `true` | Mostrar puntos indicadores |
| `mostrarFlechas` | `boolean` | ❌ No | `false` | Mostrar flechas de navegación |
| `altura` | `string` | ❌ No | `'400px'` | Altura del slider (ej: '400px', '50vh') |
| `className` | `string` | ❌ No | `''` | Clases CSS adicionales |

### Estructura del objeto Slide

```typescript
{
  id: number | string,        // Identificador único
  titulo?: string,            // Título del slide (opcional)
  descripcion?: string,       // Descripción (opcional)
  imagen?: string | null      // URL de la imagen (null = placeholder)
}
```

## 🎨 Ejemplos de Uso

### Banner Principal con Autoplay

```jsx
<Slider
  id="banner-principal"
  slides={bannersData}
  intervalo={5000}
  loop={true}
  mostrarIndicadores={true}
  mostrarFlechas={false}
  altura="400px"
  className="banner-slider"
/>
```

### Galería Manual (sin autoplay)

```jsx
<Slider
  id="galeria-productos"
  slides={productosData}
  intervalo={0}
  loop={false}
  mostrarIndicadores={true}
  mostrarFlechas={true}
  altura="300px"
  className="galeria-productos"
/>
```

### Mini Slider Vertical

```jsx
<Slider
  id="testimonios"
  slides={testimoniosData}
  intervalo={3000}
  loop={true}
  mostrarIndicadores={false}
  mostrarFlechas={false}
  altura="200px"
  className="mini-slider"
/>
```

### Slider de Promociones

```jsx
<Slider
  id="promociones-especiales"
  slides={promocionesData}
  intervalo={4000}
  loop={true}
  mostrarIndicadores={true}
  mostrarFlechas={true}
  altura="250px"
  className="slider-promociones"
/>
```

## 🔧 Funciones del Contexto (Uso Avanzado)

Si necesitas control programático del slider:

```jsx
import { useSlider } from '../context/SliderContext'

function MiComponente() {
  const { 
    sliders,           // Estado de todos los sliders
    irASlide,          // Ir a slide específico
    siguienteSlide,    // Siguiente slide
    anteriorSlide,     // Slide anterior
    toggleAutoplay,    // Pausar/reanudar autoplay
    actualizarSlides   // Actualizar slides dinámicamente
  } = useSlider();

  // Ir al slide 2 del slider "banner-principal"
  const irAlSegundoSlide = () => {
    irASlide('banner-principal', 1);
  };

  // Pausar autoplay
  const pausarBanner = () => {
    toggleAutoplay('banner-principal', true);
  };

  return (
    <div>
      <Slider id="banner-principal" slides={slides} />
      <button onClick={irAlSegundoSlide}>Ir al Slide 2</button>
      <button onClick={pausarBanner}>Pausar</button>
    </div>
  );
}
```

## 🎨 Personalización CSS

El slider incluye estilos base en `Slider.css`. Puedes sobrescribirlos usando la prop `className`:

```css
/* En tu archivo CSS */
.mi-slider-custom .slide-placeholder {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.mi-slider-custom .indicador.activo {
  background: #ff6b6b;
}

.mi-slider-custom .slider-flecha {
  background: #4ecdc4;
}
```

```jsx
<Slider
  id="custom"
  slides={slides}
  className="mi-slider-custom"
/>
```

## 📱 Responsive

El componente es completamente responsive. Los estilos se ajustan automáticamente:

- **Desktop** (>768px): Flechas 50px, indicadores 12px
- **Tablet** (480-768px): Flechas 40px, indicadores 10px
- **Mobile** (<480px): Flechas 35px, indicadores 10px

## ⚡ Performance

- **Autoplay inteligente**: Se limpia automáticamente al desmontar
- **Pausa en hover**: Ahorra recursos cuando no es visible
- **Transiciones CSS**: Usa GPU para animaciones fluidas
- **Limpieza de memoria**: Destruye sliders al desmontar componentes

## 🐛 Troubleshooting

### Los slides no cambian

- Verifica que `id` sea único en toda la aplicación
- Verifica que `slides` tenga al menos 2 elementos
- Verifica que `intervalo` sea mayor a 0 para autoplay

### Las imágenes no se muestran

- Verifica que la URL de `imagen` sea correcta
- Si `imagen` es `null`, se mostrará el placeholder

### Múltiples sliders interfieren entre sí

- Asegúrate de que cada slider tenga un `id` único
- No uses el mismo `id` en diferentes componentes

## 📄 Licencia

Componente interno del proyecto Pre-entrega-react
