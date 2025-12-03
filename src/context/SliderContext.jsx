import { createContext, useContext, useState, useEffect } from 'react';

const SliderContext = createContext();

export const useSlider = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('useSlider debe usarse dentro de un SliderProvider');
  }
  return context;
};

export const SliderProvider = ({ children }) => {
  // Estado global para múltiples sliders
  const [sliders, setSliders] = useState({});

  /**
   * Inicializar un nuevo slider
   * @param {string} id - Identificador único del slider
   * @param {Array} slides - Array de slides
   * @param {number} intervalo - Intervalo de cambio automático en ms (0 para desactivar)
   * @param {boolean} loop - Si el slider debe hacer loop al final
   */
  const inicializarSlider = (id, slides = [], intervalo = 5000, loop = true) => {
    setSliders(prev => ({
      ...prev,
      [id]: {
        slides,
        slideActual: 0,
        slideAnterior: null,
        direccion: 'siguiente', // 'siguiente' o 'anterior'
        intervalo,
        loop,
        autoplay: intervalo > 0
      }
    }));
  };

  /**
   * Cambiar a un slide específico
   * @param {string} id - Identificador del slider
   * @param {number} indice - Índice del slide destino
   */
  const irASlide = (id, indice) => {
    setSliders(prev => {
      const slider = prev[id];
      if (!slider) return prev;

      const totalSlides = slider.slides.length;
      let nuevoIndice = indice;

      // Validar índice
      if (indice < 0) {
        nuevoIndice = slider.loop ? totalSlides - 1 : 0;
      } else if (indice >= totalSlides) {
        nuevoIndice = slider.loop ? 0 : totalSlides - 1;
      }

      // Determinar dirección del desplazamiento
      let direccion = 'siguiente';
      if (nuevoIndice < slider.slideActual) {
        direccion = 'anterior';
      } else if (nuevoIndice === 0 && slider.slideActual === totalSlides - 1) {
        // Loop hacia adelante (del último al primero)
        direccion = 'siguiente';
      } else if (nuevoIndice === totalSlides - 1 && slider.slideActual === 0) {
        // Loop hacia atrás (del primero al último)
        direccion = 'anterior';
      }

      return {
        ...prev,
        [id]: {
          ...slider,
          slideAnterior: slider.slideActual,
          slideActual: nuevoIndice,
          direccion
        }
      };
    });
  };

  /**
   * Avanzar al siguiente slide
   * @param {string} id - Identificador del slider
   */
  const siguienteSlide = (id) => {
    const slider = sliders[id];
    if (!slider) return;
    
    const nuevoIndice = slider.slideActual + 1;
    irASlide(id, nuevoIndice);
  };

  /**
   * Retroceder al slide anterior
   * @param {string} id - Identificador del slider
   */
  const anteriorSlide = (id) => {
    const slider = sliders[id];
    if (!slider) return;
    
    const nuevoIndice = slider.slideActual - 1;
    irASlide(id, nuevoIndice);
  };

  /**
   * Actualizar slides de un slider existente
   * @param {string} id - Identificador del slider
   * @param {Array} nuevosSlides - Nuevos slides
   */
  const actualizarSlides = (id, nuevosSlides) => {
    setSliders(prev => {
      const slider = prev[id];
      if (!slider) return prev;

      return {
        ...prev,
        [id]: {
          ...slider,
          slides: nuevosSlides,
          slideActual: Math.min(slider.slideActual, nuevosSlides.length - 1)
        }
      };
    });
  };

  /**
   * Pausar/reanudar autoplay
   * @param {string} id - Identificador del slider
   * @param {boolean} pausar - true para pausar, false para reanudar
   */
  const toggleAutoplay = (id, pausar) => {
    setSliders(prev => {
      const slider = prev[id];
      if (!slider) return prev;

      return {
        ...prev,
        [id]: {
          ...slider,
          autoplay: !pausar && slider.intervalo > 0
        }
      };
    });
  };

  /**
   * Destruir un slider (limpiar memoria)
   * @param {string} id - Identificador del slider
   */
  const destruirSlider = (id) => {
    setSliders(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  // Efecto para autoplay de todos los sliders activos
  useEffect(() => {
    const intervalos = {};

    Object.entries(sliders).forEach(([id, slider]) => {
      if (slider.autoplay && slider.slides.length > 1) {
        intervalos[id] = setInterval(() => {
          siguienteSlide(id);
        }, slider.intervalo);
      }
    });

    return () => {
      Object.values(intervalos).forEach(intervalo => clearInterval(intervalo));
    };
  }, [sliders]);

  const value = {
    sliders,
    inicializarSlider,
    irASlide,
    siguienteSlide,
    anteriorSlide,
    actualizarSlides,
    toggleAutoplay,
    destruirSlider
  };

  return (
    <SliderContext.Provider value={value}>
      {children}
    </SliderContext.Provider>
  );
};
