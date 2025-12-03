import React, { createContext, useContext, useState } from 'react';

const BannersContext = createContext();

export const useBanners = () => {
  const context = useContext(BannersContext);
  if (!context) {
    throw new Error('useBanners debe usarse dentro de un BannersProvider');
  }
  return context;
};

export const BannersProvider = ({ children }) => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      titulo: "Bienvenido a Nuestra Tienda",
      descripcion: "Encuentra los mejores productos",
      imagen: null,
      activo: true,
      orden: 0,
      tipoContenido: 'texto-con-imagen', // 'solo-imagen', 'texto-con-imagen', 'solo-texto'
      enlace: null,
      fechaInicio: null,
      fechaFin: null
    },
    {
      id: 2,
      titulo: "Ofertas Especiales",
      descripcion: "Descuentos increíbles esta semana",
      imagen: null,
      activo: true,
      orden: 1,
      tipoContenido: 'texto-con-imagen',
      enlace: null,
      fechaInicio: null,
      fechaFin: null
    },
    {
      id: 3,
      titulo: "Envío Gratis",
      descripcion: "En compras mayores a $50",
      imagen: null,
      activo: true,
      orden: 2,
      tipoContenido: 'texto-con-imagen',
      enlace: null,
      fechaInicio: null,
      fechaFin: null
    }
  ]);

  /**
   * Agregar un nuevo banner
   */
  const agregarBanner = (titulo, descripcion, imagen = null, tipoContenido = 'texto-con-imagen') => {
    const nuevoBanner = {
      id: Date.now(),
      titulo,
      descripcion,
      imagen,
      activo: true,
      orden: banners.length,
      tipoContenido,
      enlace: null,
      fechaInicio: null,
      fechaFin: null
    };
    setBanners([...banners, nuevoBanner]);
  };

  /**
   * Actualizar un banner existente
   */
  const actualizarBanner = (id, datosActualizados) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, ...datosActualizados } : banner
    ));
  };

  /**
   * Eliminar un banner
   */
  const eliminarBanner = (id) => {
    setBanners(banners.filter(banner => banner.id !== id));
  };

  /**
   * Activar/Desactivar un banner
   */
  const toggleBanner = (id) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, activo: !banner.activo } : banner
    ));
  };

  /**
   * Reordenar banners
   */
  const reordenarBanners = (nuevosBannersOrdenados) => {
    const bannersConOrden = nuevosBannersOrdenados.map((banner, index) => ({
      ...banner,
      orden: index
    }));
    setBanners(bannersConOrden);
  };

  /**
   * Obtener solo banners activos
   */
  const obtenerBannersActivos = () => {
    return banners
      .filter(banner => banner.activo)
      .filter(banner => {
        // Filtrar por fecha si existe
        if (banner.fechaInicio && banner.fechaFin) {
          const ahora = new Date();
          const inicio = new Date(banner.fechaInicio);
          const fin = new Date(banner.fechaFin);
          return ahora >= inicio && ahora <= fin;
        }
        return true;
      })
      .sort((a, b) => a.orden - b.orden);
  };

  /**
   * Buscar banner por ID
   */
  const buscarBanner = (id) => {
    return banners.find(banner => banner.id === id);
  };

  /**
   * Duplicar un banner
   */
  const duplicarBanner = (id) => {
    const bannerOriginal = buscarBanner(id);
    if (bannerOriginal) {
      const bannerDuplicado = {
        ...bannerOriginal,
        id: Date.now(),
        titulo: `${bannerOriginal.titulo} (Copia)`,
        orden: banners.length
      };
      setBanners([...banners, bannerDuplicado]);
    }
  };

  /**
   * Contar banners activos
   */
  const contarBannersActivos = () => {
    return obtenerBannersActivos().length;
  };

  /**
   * Obtener banners por tipo de contenido
   */
  const obtenerBannersPorTipo = (tipoContenido) => {
    return obtenerBannersActivos().filter(banner => banner.tipoContenido === tipoContenido);
  };

  const contextValue = {
    banners,
    // Funciones de administración
    agregarBanner,
    actualizarBanner,
    eliminarBanner,
    toggleBanner,
    reordenarBanners,
    obtenerBannersActivos,
    buscarBanner,
    duplicarBanner,
    contarBannersActivos,
    obtenerBannersPorTipo
  };

  return (
    <BannersContext.Provider value={contextValue}>
      {children}
    </BannersContext.Provider>
  );
};
