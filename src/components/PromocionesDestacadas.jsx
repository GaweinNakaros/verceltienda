import React from 'react';
import { usePromociones } from '../context/PromocionesContext';
import './PromocionesDestacadas.css';

/**
 * Componente reutilizable de Promociones Destacadas
 * @param {Array} promociones - Array de objetos de promoción (opcional, usa context si no se proporciona)
 * @param {string} className - Clases CSS adicionales
 * @param {boolean} mostrarSeccion - Si mostrar la sección completa
 * @param {boolean} soloActivas - Si mostrar solo promociones activas
 * @param {number} limite - Límite de promociones a mostrar (null = todas)
 */
const PromocionesDestacadas = ({
  promociones = null,
  className = '',
  mostrarSeccion = true,
  soloActivas = true,
  limite = null
}) => {
  const { obtenerPromocionesActivas } = usePromociones();

  // Usar promociones del contexto si no se proporcionan
  let promocionesAMostrar = promociones;
  
  if (!promociones) {
    promocionesAMostrar = soloActivas 
      ? obtenerPromocionesActivas() 
      : usePromociones().promociones;
  }

  // Aplicar límite si existe
  if (limite && limite > 0) {
    promocionesAMostrar = promocionesAMostrar.slice(0, limite);
  }

  if (!mostrarSeccion || promocionesAMostrar.length === 0) {
    return null;
  }

  return (
    <section className={`promociones-section ${className}`}>
      <div className="promociones-container">
        {promocionesAMostrar.map((promo) => (
          <div
            key={promo.id}
            className={`promo-card ${promo.destacada ? 'promo-destacada' : ''}`}
          >
            {promo.icono && (
              <div className="promo-icono">
                {typeof promo.icono === 'string' ? (
                  <img src={promo.icono} alt={promo.titulo} />
                ) : (
                  promo.icono
                )}
              </div>
            )}
            <h3>{promo.titulo}</h3>
            <p>{promo.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromocionesDestacadas;
