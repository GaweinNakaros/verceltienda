import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategorias } from '../context/CategoriasContext';
import './CategoriasSlider.css';

/**
 * Componente reutilizable de Slider de Categorías
 * @param {string} titulo - Título de la sección (opcional)
 * @param {boolean} mostrarTitulo - Si mostrar el título
 * @param {boolean} soloActivas - Si mostrar solo categorías activas
 * @param {number} categoriasVisiblesDesktop - Categorías visibles en desktop
 * @param {number} categoriasVisiblesTablet - Categorías visibles en tablet
 * @param {number} categoriasVisiblesMobile - Categorías visibles en mobile
 * @param {string} className - Clases CSS adicionales
 * @param {Function} onCategoriaClick - Callback personalizado al hacer click
 */
const CategoriasSlider = ({
  titulo = "Categorías",
  mostrarTitulo = true,
  soloActivas = true,
  categoriasVisiblesDesktop = 6,
  categoriasVisiblesTablet = 4,
  categoriasVisiblesMobile = 3,
  className = '',
  onCategoriaClick = null
}) => {
  const navigate = useNavigate();
  const { 
    categorias, 
    loading: loadingCategorias, 
    obtenerCategoriasActivas 
  } = useCategorias();

  // Estado para el slider de categorías
  const [desplazamientoCategoria, setDesplazamientoCategoria] = useState(0);
  const [categoriasVisibles, setCategoriasVisibles] = useState(categoriasVisiblesDesktop);
  const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);

  // Obtener categorías a mostrar
  const categoriasAMostrar = soloActivas ? obtenerCategoriasActivas() : categorias;

  // Ajustar categorías visibles según tamaño de pantalla
  useEffect(() => {
    const ajustarCategoriasVisibles = () => {
      const ancho = window.innerWidth;
      setAnchoPantalla(ancho);
      
      const anchoCategoria = ancho <= 480 ? 75 : ancho <= 768 ? 85 : 100;
      const gapCategoria = ancho <= 480 ? 7 : ancho <= 768 ? 8 : 10;
      const paddingLateral = ancho <= 480 ? 40 : ancho <= 768 ? 60 : 100;
      
      const anchoDisponible = ancho - paddingLateral;
      const anchoConGap = anchoCategoria + gapCategoria;
      const categoriasQueCaben = Math.floor((anchoDisponible + gapCategoria) / anchoConGap);
      
      setCategoriasVisibles(Math.max(3, categoriasQueCaben));
      setDesplazamientoCategoria(0);
    };

    ajustarCategoriasVisibles();
    window.addEventListener('resize', ajustarCategoriasVisibles);
    
    return () => window.removeEventListener('resize', ajustarCategoriasVisibles);
  }, []);

  // Función para manejar click en categoría
  const manejarClickCategoria = (nombreCategoria) => {
    if (onCategoriaClick) {
      onCategoriaClick(nombreCategoria);
    } else {
      navigate(`/productos?categoria=${encodeURIComponent(nombreCategoria)}`);
    }
  };

  // Funciones para navegar en el slider
  const avanzarCategorias = () => {
    const maxDesplazamiento = Math.max(0, categoriasAMostrar.length - categoriasVisibles);
    setDesplazamientoCategoria(prev => Math.min(prev + 1, maxDesplazamiento));
  };

  const retrocederCategorias = () => {
    setDesplazamientoCategoria(prev => Math.max(prev - 1, 0));
  };

  // Calcular desplazamiento en píxeles
  const anchoCategoria = anchoPantalla <= 480 ? 75 : anchoPantalla <= 768 ? 85 : 100;
  const gapCategoria = anchoPantalla <= 480 ? 7 : anchoPantalla <= 768 ? 8 : 10;
  const desplazamientoPixeles = desplazamientoCategoria * (anchoCategoria + gapCategoria);

  // Verificar si hay desbordamiento
  const hayDesbordamiento = categoriasAMostrar.length > categoriasVisibles;
  const mostrarFlechaIzquierda = hayDesbordamiento && desplazamientoCategoria > 0;
  const mostrarFlechaDerecha = hayDesbordamiento && desplazamientoCategoria < categoriasAMostrar.length - categoriasVisibles;

  if (loadingCategorias) {
    return (
      <section className={`categorias-section ${className}`}>
        {mostrarTitulo && <h2 className="categorias-titulo">{titulo}</h2>}
        <p style={{ textAlign: 'center' }}>Cargando categorías...</p>
      </section>
    );
  }

  return (
    <section className={`categorias-section ${className}`}>
      {mostrarTitulo && <h2 className="categorias-titulo">{titulo}</h2>}
      
      <div className={`categorias-slider-container ${!hayDesbordamiento ? 'sin-flechas' : ''}`}>
        {/* Flecha izquierda */}
        {mostrarFlechaIzquierda && (
          <button 
            className="categoria-flecha categoria-flecha-izq"
            onClick={retrocederCategorias}
            aria-label="Ver categorías anteriores"
          >
            ‹
          </button>
        )}

        {/* Wrapper del grid */}
        <div className="categorias-grid-wrapper">
          <div 
            className="categorias-grid"
            style={{
              transform: hayDesbordamiento ? `translateX(-${desplazamientoPixeles}px)` : 'none'
            }}
          >
            {categoriasAMostrar.map((categoria) => (
              <div
                key={categoria.id}
                className="categoria-icono"
                onClick={() => manejarClickCategoria(categoria.nombre)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') manejarClickCategoria(categoria.nombre);
                }}
              >
                <div className="icono-placeholder">
                  {categoria.icono ? (
                    <img src={categoria.icono} alt={categoria.nombre} />
                  ) : (
                    <span className="icono-texto">{categoria.nombre.charAt(0)}</span>
                  )}
                </div>
                <p className="categoria-nombre">{categoria.nombre}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Flecha derecha */}
        {mostrarFlechaDerecha && (
          <button 
            className="categoria-flecha categoria-flecha-der"
            onClick={avanzarCategorias}
            aria-label="Ver más categorías"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoriasSlider;
