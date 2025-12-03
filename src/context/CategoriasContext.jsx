import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de categorías
const CategoriasContext = createContext();

/**
 * Hook para usar el contexto de categorías
 * Facilita el acceso a las categorías en cualquier componente
 */
export const useCategorias = () => {
  const context = useContext(CategoriasContext);
  if (!context) {
    throw new Error('useCategorias debe ser usado dentro de un CategoriasProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de categorías
 * Gestiona categorías de forma dinámica y administrable
 */
export const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Diccionario de traducción de categorías inglés -> español
  const traduccionCategorias = {
    'Electronics': 'Electrónica',
    'Clothing': 'Ropa',
    'Home': 'Hogar',
    'Sports': 'Deportes',
    'Toys': 'Juguetes',
    'Books': 'Libros',
    'Health': 'Salud',
    'Beauty': 'Belleza',
    'Automotive': 'Automotriz',
    'Garden': 'Jardín',
    'Tools': 'Herramientas',
    'Baby': 'Bebé',
    'Kids': 'Niños',
    'Music': 'Música',
    'Movies': 'Películas',
    'Games': 'Juegos',
    'Grocery': 'Alimentos',
    'Shoes': 'Calzado',
    'Jewelry': 'Joyería',
    'Outdoors': 'Exteriores',
    'Industrial': 'Industrial',
    'Computers': 'Computación'
  };

  // Mapeo de imágenes para cada categoría
  const imagenesCategorias = {
    'Electrónica': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    'Ropa': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    'Hogar': 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=400&h=300&fit=crop',
    'Deportes': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    'Juguetes': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop',
    'Libros': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
    'Salud': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop',
    'Belleza': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    'Automotriz': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
    'Jardín': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    'Herramientas': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop',
    'Bebé': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    'Niños': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    'Música': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
    'Películas': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop',
    'Juegos': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    'Alimentos': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    'Calzado': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop',
    'Joyería': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    'Exteriores': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
    'Industrial': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
    'Computación': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop'
  };

  /**
   * Cargar categorías desde la API
   */
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://68d482fa214be68f8c696bbd.mockapi.io/api/productos");
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const productos = await response.json();
      
      // Extraer categorías únicas y traducirlas
      const categoriasUnicas = [...new Set(productos.map(prod => {
        const categoriaOriginal = prod.categoria;
        return traduccionCategorias[categoriaOriginal] || categoriaOriginal || 'Sin categoría';
      }))];
      
      // Ordenar alfabéticamente
      categoriasUnicas.sort();
      
      // Crear objetos de categoría con id, nombre e icono
      const categoriasConDatos = categoriasUnicas.map((cat, index) => ({
        id: index + 1,
        nombre: cat,
        icono: imagenesCategorias[cat] || null,
        activa: true,
        orden: index
      }));
      
      setCategorias(categoriasConDatos);
      setError(null);
      
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError(error.message);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar una nueva categoría
   */
  const agregarCategoria = (nombre, icono = null) => {
    const nuevaCategoria = {
      id: categorias.length + 1,
      nombre,
      icono,
      activa: true,
      orden: categorias.length
    };
    setCategorias([...categorias, nuevaCategoria]);
  };

  /**
   * Actualizar una categoría existente
   */
  const actualizarCategoria = (id, datosActualizados) => {
    setCategorias(categorias.map(cat => 
      cat.id === id ? { ...cat, ...datosActualizados } : cat
    ));
  };

  /**
   * Eliminar una categoría
   */
  const eliminarCategoria = (id) => {
    setCategorias(categorias.filter(cat => cat.id !== id));
  };

  /**
   * Activar/Desactivar una categoría
   */
  const toggleCategoria = (id) => {
    setCategorias(categorias.map(cat => 
      cat.id === id ? { ...cat, activa: !cat.activa } : cat
    ));
  };

  /**
   * Reordenar categorías
   */
  const reordenarCategorias = (nuevasCategoriasOrdenadas) => {
    const categoriasConOrden = nuevasCategoriasOrdenadas.map((cat, index) => ({
      ...cat,
      orden: index
    }));
    setCategorias(categoriasConOrden);
  };

  /**
   * Obtener solo categorías activas
   */
  const obtenerCategoriasActivas = () => {
    return categorias.filter(cat => cat.activa).sort((a, b) => a.orden - b.orden);
  };

  /**
   * Buscar categoría por nombre
   */
  const buscarCategoria = (nombre) => {
    return categorias.find(cat => 
      cat.nombre.toLowerCase() === nombre.toLowerCase()
    );
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const contextValue = {
    categorias,
    loading,
    error,
    traduccionCategorias,
    imagenesCategorias,
    // Funciones de administración
    cargarCategorias,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    toggleCategoria,
    reordenarCategorias,
    obtenerCategoriasActivas,
    buscarCategoria
  };

  return (
    <CategoriasContext.Provider value={contextValue}>
      {children}
    </CategoriasContext.Provider>
  );
};
