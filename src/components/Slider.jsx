import { useEffect } from 'react';
import { useSlider } from '../context/SliderContext';
import './Slider.css';

/**
 * Componente Slider reutilizable
 * @param {string} id - Identificador único del slider
 * @param {Array} slides - Array de objetos slide: { id, titulo, descripcion, imagen }
 * @param {number} intervalo - Tiempo en ms para cambio automático (0 = desactivado)
 * @param {boolean} loop - Si debe hacer loop al final
 * @param {boolean} mostrarIndicadores - Mostrar puntos indicadores
 * @param {boolean} mostrarFlechas - Mostrar flechas de navegación
 * @param {string} altura - Altura del slider (ej: '400px', '50vh')
 * @param {string} className - Clases CSS adicionales
 */
const Slider = ({
  id,
  slides = [],
  intervalo = 5000,
  loop = true,
  mostrarIndicadores = true,
  mostrarFlechas = false,
  altura = '400px',
  className = ''
}) => {
  const {
    sliders,
    inicializarSlider,
    irASlide,
    siguienteSlide,
    anteriorSlide,
    destruirSlider,
    toggleAutoplay
  } = useSlider();

  const slider = sliders[id];

  // Inicializar slider al montar
  useEffect(() => {
    inicializarSlider(id, slides, intervalo, loop);
    
    return () => {
      destruirSlider(id);
    };
  }, []);

  // Actualizar slides si cambian
  useEffect(() => {
    if (slider && JSON.stringify(slider.slides) !== JSON.stringify(slides)) {
      inicializarSlider(id, slides, intervalo, loop);
    }
  }, [slides]);

  if (!slider || slider.slides.length === 0) {
    return (
      <div className={`slider-container ${className}`} style={{ height: altura }}>
        <div className="slider-vacio">No hay slides disponibles</div>
      </div>
    );
  }

  const { slideActual, slideAnterior, direccion } = slider;

  return (
    <div 
      className={`slider-container ${className}`}
      style={{ height: altura }}
      onMouseEnter={() => toggleAutoplay(id, true)}
      onMouseLeave={() => toggleAutoplay(id, false)}
    >
      <div className="slider-contenido">
        {slider.slides.map((slide, index) => {
          let claseSlide = 'slide';
          
          if (index === slideActual) {
            // Slide que está entrando/activo
            claseSlide += ' activo';
          } else if (index === slideAnterior) {
            // Slide que está saliendo
            claseSlide += ' saliendo';
          } else {
            // Todos los demás slides están fuera de vista
            claseSlide += ' fuera';
          }

          return (
            <div key={slide.id || index} className={claseSlide}>
              {/* Determinar tipo de contenido */}
              {slide.tipoContenido === 'solo-imagen' && slide.imagen ? (
                // Solo imagen sin texto
                <img src={slide.imagen} alt={slide.titulo || `Slide ${index + 1}`} className="slide-imagen-completa" />
              ) : slide.tipoContenido === 'solo-texto' ? (
                // Solo texto sin imagen
                <div className="slide-placeholder">
                  <h2>{slide.titulo || `Slide ${index + 1}`}</h2>
                  {slide.descripcion && <p>{slide.descripcion}</p>}
                </div>
              ) : slide.imagen ? (
                // Imagen con texto superpuesto
                <>
                  <img src={slide.imagen} alt={slide.titulo || `Slide ${index + 1}`} />
                  {(slide.titulo || slide.descripcion) && (
                    <div className="slide-contenido-texto">
                      {slide.titulo && <h2>{slide.titulo}</h2>}
                      {slide.descripcion && <p>{slide.descripcion}</p>}
                    </div>
                  )}
                </>
              ) : (
                // Placeholder por defecto (sin imagen)
                <div className="slide-placeholder">
                  <h2>{slide.titulo || `Slide ${index + 1}`}</h2>
                  {slide.descripcion && <p>{slide.descripcion}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Flechas de navegación */}
      {mostrarFlechas && slider.slides.length > 1 && (
        <>
          <button
            className="slider-flecha slider-flecha-izq"
            onClick={() => anteriorSlide(id)}
            aria-label="Slide anterior"
          >
            ‹
          </button>
          <button
            className="slider-flecha slider-flecha-der"
            onClick={() => siguienteSlide(id)}
            aria-label="Siguiente slide"
          >
            ›
          </button>
        </>
      )}

      {/* Indicadores */}
      {mostrarIndicadores && slider.slides.length > 1 && (
        <div className="slider-indicadores">
          {slider.slides.map((_, index) => (
            <button
              key={index}
              className={`indicador ${index === slideActual ? 'activo' : ''}`}
              onClick={() => irASlide(id, index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
