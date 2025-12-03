# Sistema de Banners Administrable

> Tipo: Subsistema | Propósito: Gestión y renderizado de banners dinámicos para sliders principales. Ver índice general en `./README.md`.

## 📋 Descripción

Sistema completo y flexible para gestionar banners dinámicos con soporte para múltiples tipos de contenido. Permite administrar banners del carrusel principal con la opción de mostrar solo imágenes, solo texto, o combinación de ambos.

## ✨ Características

### Tipos de Contenido
- **`solo-imagen`**: Banner con imagen a pantalla completa sin texto superpuesto
- **`texto-con-imagen`**: Imagen de fondo con texto superpuesto centrado (overlay con efecto blur)
- **`solo-texto`**: Banner sin imagen, solo con título y descripción sobre fondo gradiente

### Funcionalidades Administrativas
- ✅ **CRUD Completo**: Agregar, actualizar, eliminar y buscar banners
- ✅ **Toggle de Estado**: Activar/desactivar banners sin eliminarlos
- ✅ **Reordenamiento**: Control del orden de aparición
- ✅ **Duplicación**: Copiar banners existentes
- ✅ **Vigencia por Fechas**: Sistema de inicio y fin de vigencia automático
- ✅ **Filtros**: Por tipo de contenido, estado activo y fechas
- ✅ **Enlaces**: Soporte para URLs personalizadas en cada banner

## 🚀 Uso Básico

### En Componentes

```jsx
import { useBanners } from '../context/BannersContext';

function MiComponente() {
  const { obtenerBannersActivos } = useBanners();
  
  // Obtener todos los banners activos y vigentes
  const bannersActivos = obtenerBannersActivos();
  
  return (
    <Slider 
      id="banner-principal" 
      slides={bannersActivos}
      intervalo={5000}
      altura="400px"
      mostrarIndicadores={true}
      mostrarFlechas={true}
    />
  );
}
```

## 📚 API del Context (Administración)

### Funciones Disponibles

#### `agregarBanner(titulo, descripcion, imagen, tipoContenido, enlace, fechaInicio, fechaFin)`
Crea un nuevo banner.

```jsx
const { agregarBanner } = useBanners();

agregarBanner(
  "Nueva Colección Verano",
  "Descubre las últimas tendencias",
  "https://images.unsplash.com/photo-summer",
  "texto-con-imagen",
  "/productos?categoria=verano",
  new Date("2024-06-01"),
  new Date("2024-08-31")
);
```

**Parámetros:**
- `titulo` (string): Título del banner
- `descripcion` (string): Descripción o subtítulo
- `imagen` (string): URL de la imagen (opcional según tipo)
- `tipoContenido` (string): `'solo-imagen'`, `'texto-con-imagen'` o `'solo-texto'`
- `enlace` (string, opcional): URL de destino al hacer clic
- `fechaInicio` (Date, opcional): Inicio de vigencia
- `fechaFin` (Date, opcional): Fin de vigencia

---

#### `actualizarBanner(id, datosActualizados)`
Actualiza un banner existente.

```jsx
const { actualizarBanner } = useBanners();

actualizarBanner(1, {
  titulo: "Título Actualizado",
  tipoContenido: "solo-imagen",
  imagen: "https://nueva-imagen.jpg"
});
```

---

#### `eliminarBanner(id)`
Elimina un banner permanentemente.

```jsx
const { eliminarBanner } = useBanners();

eliminarBanner(1);
```

---

#### `toggleBanner(id)`
Activa o desactiva un banner sin eliminarlo.

```jsx
const { toggleBanner } = useBanners();

toggleBanner(1); // Si estaba activo, se desactiva y viceversa
```

---

#### `reordenarBanners(nuevoOrden)`
Cambia el orden de los banners.

```jsx
const { reordenarBanners, banners } = useBanners();

// Ejemplo: mover el último banner al principio
const nuevoOrden = [banners[2], banners[0], banners[1]];
reordenarBanners(nuevoOrden);
```

---

#### `obtenerBannersActivos()`
Retorna solo los banners activos y dentro del rango de vigencia.

```jsx
const { obtenerBannersActivos } = useBanners();

const bannersActivos = obtenerBannersActivos();
// Solo incluye banners con activo=true y dentro de las fechas
```

---

#### `obtenerBannersPorTipo(tipo)`
Filtra banners por tipo de contenido.

```jsx
const { obtenerBannersPorTipo } = useBanners();

const bannersImagen = obtenerBannersPorTipo('solo-imagen');
const bannersTexto = obtenerBannersPorTipo('solo-texto');
const bannersMixtos = obtenerBannersPorTipo('texto-con-imagen');
```

---

#### `buscarBanner(id)`
Encuentra un banner específico por ID.

```jsx
const { buscarBanner } = useBanners();

const banner = buscarBanner(1);
console.log(banner?.titulo);
```

---

#### `duplicarBanner(id)`
Crea una copia de un banner existente.

```jsx
const { duplicarBanner } = useBanners();

duplicarBanner(1); // Crea "Título Original (Copia)"
```

---

#### `contarBannersActivos()`
Cuenta cuántos banners están activos y vigentes.

```jsx
const { contarBannersActivos } = useBanners();

const cantidad = contarBannersActivos();
console.log(`Hay ${cantidad} banners activos`);
```

## 🎨 Tipos de Contenido en Detalle

### 1. Solo Imagen (`solo-imagen`)

Banner con imagen a pantalla completa sin texto. Ideal para imágenes con texto incorporado o diseños gráficos completos.

```jsx
agregarBanner(
  "", // Título vacío
  "", // Descripción vacía
  "https://images.unsplash.com/photo-design-grafico",
  "solo-imagen",
  "/promocion"
);
```

**CSS Aplicado:**
```css
.slide-imagen-completa {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

---

### 2. Texto con Imagen (`texto-con-imagen`)

Imagen de fondo con texto superpuesto centrado. El texto tiene fondo semitransparente con efecto blur.

```jsx
agregarBanner(
  "Nueva Colección",
  "Descubre las últimas tendencias",
  "https://images.unsplash.com/photo-fashion",
  "texto-con-imagen",
  "/productos"
);
```

**CSS Aplicado:**
```css
.slide-contenido-texto {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 30px;
  max-width: 800px;
}
```

---

### 3. Solo Texto (`solo-texto`)

Banner sin imagen, solo con título y descripción sobre fondo gradiente púrpura.

```jsx
agregarBanner(
  "¡Envío Gratis en Todo el Sitio!",
  "Aprovecha esta oferta por tiempo limitado",
  null, // Sin imagen
  "solo-texto",
  "/envios"
);
```

**Renderizado:**
```jsx
<div className="slide-placeholder">
  <h2>{titulo}</h2>
  <p>{descripcion}</p>
</div>
```

## 🖥️ Ejemplo: Panel de Administración

```jsx
import React, { useState } from 'react';
import { useBanners } from '../context/BannersContext';

function PanelBanners() {
  const { 
    banners, 
    agregarBanner, 
    actualizarBanner, 
    eliminarBanner,
    toggleBanner,
    reordenarBanners,
    duplicarBanner,
    contarBannersActivos,
    obtenerBannersPorTipo
  } = useBanners();
  
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    tipoContenido: 'texto-con-imagen',
    enlace: '',
    fechaInicio: '',
    fechaFin: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      actualizarBanner(editando.id, form);
      setEditando(null);
    } else {
      agregarBanner(
        form.titulo,
        form.descripcion,
        form.imagen,
        form.tipoContenido,
        form.enlace,
        form.fechaInicio ? new Date(form.fechaInicio) : null,
        form.fechaFin ? new Date(form.fechaFin) : null
      );
    }
    setForm({
      titulo: '',
      descripcion: '',
      imagen: '',
      tipoContenido: 'texto-con-imagen',
      enlace: '',
      fechaInicio: '',
      fechaFin: ''
    });
  };
  
  const handleEditar = (banner) => {
    setEditando(banner);
    setForm({
      titulo: banner.titulo,
      descripcion: banner.descripcion,
      imagen: banner.imagen,
      tipoContenido: banner.tipoContenido,
      enlace: banner.enlace || '',
      fechaInicio: banner.fechaInicio ? banner.fechaInicio.toISOString().split('T')[0] : '',
      fechaFin: banner.fechaFin ? banner.fechaFin.toISOString().split('T')[0] : ''
    });
  };
  
  const handleSubir = (index) => {
    if (index === 0) return;
    const nuevoOrden = [...banners];
    [nuevoOrden[index], nuevoOrden[index - 1]] = [nuevoOrden[index - 1], nuevoOrden[index]];
    reordenarBanners(nuevoOrden);
  };
  
  const handleBajar = (index) => {
    if (index === banners.length - 1) return;
    const nuevoOrden = [...banners];
    [nuevoOrden[index], nuevoOrden[index + 1]] = [nuevoOrden[index + 1], nuevoOrden[index]];
    reordenarBanners(nuevoOrden);
  };
  
  return (
    <div className="panel-banners">
      <div className="panel-header">
        <h2>Administrar Banners</h2>
        <div className="stats">
          <span>Total: {banners.length}</span>
          <span>Activos: {contarBannersActivos()}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="form-banner">
        <h3>{editando ? 'Editar Banner' : 'Nuevo Banner'}</h3>
        
        <div className="form-group">
          <label>Tipo de Contenido</label>
          <select 
            value={form.tipoContenido}
            onChange={(e) => setForm({...form, tipoContenido: e.target.value})}
          >
            <option value="texto-con-imagen">Texto con Imagen</option>
            <option value="solo-imagen">Solo Imagen</option>
            <option value="solo-texto">Solo Texto</option>
          </select>
        </div>
        
        {form.tipoContenido !== 'solo-texto' && (
          <div className="form-group">
            <label>URL de Imagen</label>
            <input
              type="url"
              value={form.imagen}
              onChange={(e) => setForm({...form, imagen: e.target.value})}
              placeholder="https://ejemplo.com/imagen.jpg"
              required={form.tipoContenido === 'solo-imagen'}
            />
          </div>
        )}
        
        {form.tipoContenido !== 'solo-imagen' && (
          <>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({...form, titulo: e.target.value})}
                placeholder="Título del banner"
                required={form.tipoContenido === 'solo-texto'}
              />
            </div>
            
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({...form, descripcion: e.target.value})}
                placeholder="Descripción o subtítulo"
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label>Enlace (Opcional)</label>
          <input
            type="url"
            value={form.enlace}
            onChange={(e) => setForm({...form, enlace: e.target.value})}
            placeholder="/productos?categoria=verano"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Fecha Inicio</label>
            <input
              type="date"
              value={form.fechaInicio}
              onChange={(e) => setForm({...form, fechaInicio: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Fecha Fin</label>
            <input
              type="date"
              value={form.fechaFin}
              onChange={(e) => setForm({...form, fechaFin: e.target.value})}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit">
            {editando ? 'Actualizar' : 'Crear'} Banner
          </button>
          {editando && (
            <button type="button" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <div className="lista-banners">
        <h3>Banners Existentes</h3>
        {banners.map((banner, index) => (
          <div key={banner.id} className={`banner-item ${!banner.activo ? 'inactivo' : ''}`}>
            <div className="banner-info">
              <div className="banner-preview">
                {banner.imagen && <img src={banner.imagen} alt={banner.titulo} />}
                <span className="badge tipo">{banner.tipoContenido}</span>
              </div>
              <div className="banner-datos">
                <h4>{banner.titulo || '(Sin título)'}</h4>
                <p>{banner.descripcion}</p>
                {banner.enlace && <span className="enlace">🔗 {banner.enlace}</span>}
                {banner.fechaInicio && (
                  <span className="fechas">
                    📅 {banner.fechaInicio.toLocaleDateString()} - {banner.fechaFin?.toLocaleDateString() || 'Sin fin'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="banner-acciones">
              <button onClick={() => handleSubir(index)} disabled={index === 0}>
                ↑
              </button>
              <button onClick={() => handleBajar(index)} disabled={index === banners.length - 1}>
                ↓
              </button>
              <button onClick={() => toggleBanner(banner.id)}>
                {banner.activo ? '👁️' : '🚫'}
              </button>
              <button onClick={() => handleEditar(banner)}>
                ✏️
              </button>
              <button onClick={() => duplicarBanner(banner.id)}>
                📋
              </button>
              <button onClick={() => eliminarBanner(banner.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="filtros-rapidos">
        <h3>Filtros Rápidos</h3>
        <div className="filtro-grid">
          <div className="filtro-card">
            <h4>Solo Imagen</h4>
            <p>{obtenerBannersPorTipo('solo-imagen').length} banners</p>
          </div>
          <div className="filtro-card">
            <h4>Texto con Imagen</h4>
            <p>{obtenerBannersPorTipo('texto-con-imagen').length} banners</p>
          </div>
          <div className="filtro-card">
            <h4>Solo Texto</h4>
            <p>{obtenerBannersPorTipo('solo-texto').length} banners</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelBanners;
```

## 🔄 Integración con API Backend

```jsx
import { useEffect } from 'react';
import { useBanners } from '../context/BannersContext';

function SyncBannersConBackend() {
  const { banners, agregarBanner } = useBanners();
  
  useEffect(() => {
    // Cargar banners desde el backend al montar
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        data.forEach(banner => {
          agregarBanner(
            banner.titulo,
            banner.descripcion,
            banner.imagen,
            banner.tipoContenido,
            banner.enlace,
            new Date(banner.fechaInicio),
            new Date(banner.fechaFin)
          );
        });
      });
  }, []);
  
  useEffect(() => {
    // Sincronizar cambios al backend cuando cambie el estado
    const sincronizar = async () => {
      await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banners)
      });
    };
    
    sincronizar();
  }, [banners]);
  
  return null;
}
```

## 📱 Responsive Design

Los estilos del Slider son completamente responsive:

```css
/* Desktop */
.slide-contenido-texto {
  max-width: 800px;
  padding: 30px;
}

.slide-contenido-texto h2 {
  font-size: 2.5rem;
}

/* Tablet */
@media (max-width: 768px) {
  .slide-contenido-texto {
    max-width: 90%;
    padding: 20px;
  }
  
  .slide-contenido-texto h2 {
    font-size: 2rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .slide-contenido-texto {
    padding: 15px;
  }
  
  .slide-contenido-texto h2 {
    font-size: 1.5rem;
  }
}
```

## 🚀 Casos de Uso Avanzados

### Banner de Campaña Temporal

```jsx
// Banner visible solo durante Black Friday
agregarBanner(
  "BLACK FRIDAY",
  "Hasta 70% de descuento en toda la tienda",
  "https://images.unsplash.com/photo-black-friday",
  "texto-con-imagen",
  "/ofertas-black-friday",
  new Date("2024-11-24"),
  new Date("2024-11-30")
);
```

### Carrusel con Múltiples Tipos

```jsx
function BannerMixto() {
  const { banners } = useBanners();
  
  // Crear slider con diferentes tipos de contenido
  const bannersMixtos = [
    { tipoContenido: 'solo-imagen', imagen: '/hero1.jpg' },
    { tipoContenido: 'texto-con-imagen', titulo: 'Ofertas', imagen: '/hero2.jpg' },
    { tipoContenido: 'solo-texto', titulo: 'Envío Gratis', descripcion: 'Sin mínimo de compra' }
  ];
  
  return <Slider id="principal" slides={bannersMixtos} intervalo={4000} />;
}
```

### Duplicar y Modificar

```jsx
// Duplicar un banner exitoso para otra campaña
const { duplicarBanner, actualizarBanner, buscarBanner } = useBanners();

duplicarBanner(1); // Crea copia del banner ID 1

// Modificar la copia para nueva campaña
const copia = buscarBanner(4); // Supongamos que la copia tiene ID 4
actualizarBanner(copia.id, {
  titulo: "Cyber Monday",
  fechaInicio: new Date("2024-12-01"),
  fechaFin: new Date("2024-12-05")
});
```

## ⚙️ Configuración del Slider

Props disponibles al usar el componente Slider:

```jsx
<Slider 
  id="banner-principal"              // ID único requerido
  slides={obtenerBannersActivos()}   // Array de banners
  intervalo={5000}                   // Milisegundos entre slides (default: 5000)
  loop={true}                        // Volver al inicio (default: true)
  altura="400px"                     // Altura personalizada
  mostrarIndicadores={true}          // Puntos indicadores (default: true)
  mostrarFlechas={true}              // Flechas navegación (default: true)
  className="mi-slider-custom"       // Clase CSS adicional
/>
```

## 🎯 Mejores Prácticas

1. **Tipos de Contenido:**
   - Usar `solo-imagen` para diseños gráficos completos
   - Usar `texto-con-imagen` para mensajes con contexto visual
   - Usar `solo-texto` para anuncios simples y directos

2. **Fechas de Vigencia:**
   - Siempre establecer `fechaInicio` y `fechaFin` para campañas temporales
   - Omitir fechas para banners permanentes

3. **Orden y Visibilidad:**
   - Usar `reordenarBanners` para priorizar contenido importante
   - Usar `toggleBanner` en lugar de eliminar para conservar histórico

4. **Performance:**
   - Optimizar imágenes antes de subirlas
   - Usar URLs de CDN para carga rápida
   - Limitar cantidad de banners activos simultáneos (recomendado: 3-5)

5. **Enlaces:**
   - Usar rutas relativas (`/productos`) para navegación interna
   - Usar URLs completas (`https://externa.com`) para enlaces externos

---

**Documentación creada para:** v1.3  
**Última actualización:** Enero 2025  
**Dependencias:** React 19.1.1, React Router, SliderContext
