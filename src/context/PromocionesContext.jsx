import React, { createContext, useContext, useState, useEffect } from 'react';

const PromocionesContext = createContext();

export const usePromociones = () => {
  const context = useContext(PromocionesContext);
  if (!context) {
    throw new Error('usePromociones debe usarse dentro de un PromocionesProvider');
  }
  return context;
};

export const PromocionesProvider = ({ children }) => {
  const [promociones, setPromociones] = useState([
    {
      id: 1,
      titulo: "Envío Gratis",
      descripcion: "En compras mayores a $50",
      destacada: true,
      icono: null,
      activa: true,
      orden: 0,
      fechaInicio: null,
      fechaFin: null
    },
    {
      id: 2,
      titulo: "10% OFF",
      descripcion: "Primera compra",
      destacada: false,
      icono: null,
      activa: true,
      orden: 1,
      fechaInicio: null,
      fechaFin: null
    },
    {
      id: 3,
      titulo: "Cuotas sin interés",
      descripcion: "Hasta 12 cuotas",
      destacada: false,
      icono: null,
      activa: true,
      orden: 2,
      fechaInicio: null,
      fechaFin: null
    }
  ]);

  /**
   * Agregar una nueva promoción
   */
  const agregarPromocion = (titulo, descripcion, destacada = false, icono = null) => {
    const nuevaPromocion = {
      id: Date.now(),
      titulo,
      descripcion,
      destacada,
      icono,
      activa: true,
      orden: promociones.length,
      fechaInicio: null,
      fechaFin: null
    };
    setPromociones([...promociones, nuevaPromocion]);
  };

  /**
   * Actualizar una promoción existente
   */
  const actualizarPromocion = (id, datosActualizados) => {
    setPromociones(promociones.map(promo => 
      promo.id === id ? { ...promo, ...datosActualizados } : promo
    ));
  };

  /**
   * Eliminar una promoción
   */
  const eliminarPromocion = (id) => {
    setPromociones(promociones.filter(promo => promo.id !== id));
  };

  /**
   * Activar/Desactivar una promoción
   */
  const togglePromocion = (id) => {
    setPromociones(promociones.map(promo => 
      promo.id === id ? { ...promo, activa: !promo.activa } : promo
    ));
  };

  /**
   * Reordenar promociones
   */
  const reordenarPromociones = (nuevasPromocionesOrdenadas) => {
    const promocionesConOrden = nuevasPromocionesOrdenadas.map((promo, index) => ({
      ...promo,
      orden: index
    }));
    setPromociones(promocionesConOrden);
  };

  /**
   * Obtener solo promociones activas
   */
  const obtenerPromocionesActivas = () => {
    return promociones
      .filter(promo => promo.activa)
      .filter(promo => {
        // Filtrar por fecha si existe
        if (promo.fechaInicio && promo.fechaFin) {
          const ahora = new Date();
          const inicio = new Date(promo.fechaInicio);
          const fin = new Date(promo.fechaFin);
          return ahora >= inicio && ahora <= fin;
        }
        return true;
      })
      .sort((a, b) => a.orden - b.orden);
  };

  /**
   * Obtener promoción destacada
   */
  const obtenerPromocionDestacada = () => {
    return obtenerPromocionesActivas().find(promo => promo.destacada);
  };

  /**
   * Buscar promoción por ID
   */
  const buscarPromocion = (id) => {
    return promociones.find(promo => promo.id === id);
  };

  /**
   * Duplicar una promoción
   */
  const duplicarPromocion = (id) => {
    const promoOriginal = buscarPromocion(id);
    if (promoOriginal) {
      const promoDuplicada = {
        ...promoOriginal,
        id: Date.now(),
        titulo: `${promoOriginal.titulo} (Copia)`,
        orden: promociones.length
      };
      setPromociones([...promociones, promoDuplicada]);
    }
  };

  /**
   * Contar promociones activas
   */
  const contarPromocionesActivas = () => {
    return obtenerPromocionesActivas().length;
  };

  const contextValue = {
    promociones,
    // Funciones de administración
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
  };

  return (
    <PromocionesContext.Provider value={contextValue}>
      {children}
    </PromocionesContext.Provider>
  );
};
