import React, { createContext, useContext, useState } from 'react';

// Crear el contexto del carrito
const CarritoContext = createContext();

// Hook del carrito
// hook es una función que permite usar características de React como el estado y el ciclo de vida en componentes funcionales
// useContext es un hook que permite acceder al valor del contexto en componentes funcionales
// este hook facilita el acceso al contexto del carrito en cualquier componente funcional
// el contexto proporciona el estado del carrito y las funciones para manipularlo
// de esta forma, cualquier componente que use este hook puede interactuar con el carrito de compras

// la funcionalidad crea un contexto global para el carrito de compras
// y permite que cualquier componente dentro de la aplicación pueda acceder y modificar el estado del carrito sin necesidad de pasar props manualmente a través de múltiples niveles de componentes
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};

/**
 * Proveedor del contexto del carrito
 * Contiene toda la lógica del carrito de compras
 */
export const CarritoProvider = ({ children }) => {
  // Estado del carrito
  const [carrito, setCarrito] = useState([]);

  // Función para agregar productos al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(carritoActual => {
      const productoExistente = carritoActual.find(item => item.id === producto.id);
      
      if (productoExistente) {
        // Si el producto ya existe, verificar si hay stock disponible antes de aumentar cantidad
        const cantidadActual = productoExistente.cantidad || 1;
        const stockDisponible = producto.stock || 0;
        
        // Si la cantidad en el carrito ya alcanzó el stock disponible, no permitir agregar más
        if (cantidadActual >= stockDisponible) {
          alert(`No puedes agregar más unidades. Stock disponible: ${stockDisponible}`);
          return carritoActual; // Retornar el carrito sin cambios
        }
        
        // spread es una forma de copiar un objeto o array en uno nuevo para manipularlo sin afectar el original y aplicar los cambios deseados
        // spread es la sintaxis de 3 puntos (...) para copiar las propiedades del objeto y despues de la coma se indica la propiedad que se quiere modificar
        // Si hay stock disponible, aumentar la cantidad
        return carritoActual.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: cantidadActual + 1 } // Aumentamos cantidad respetando el stock
            : item
        );
      } else {
        // Si es un producto nuevo, verificar que tenga stock antes de agregarlo
        const stockDisponible = producto.stock || 0;
        
        if (stockDisponible <= 0) {
          alert('Este producto no tiene stock disponible');
          return carritoActual; // No agregar el producto
        }
        
        // Si es un producto nuevo con stock, agregarlo al carrito
        return [...carritoActual, { ...producto, cantidad: 1 }]; // inicializamos la cantidad en 1 al agregar un nuevo producto tomando de referencia el producto completo, y el atributo cantidad
      }
    });
  };

  // Función para quitar cantidad de un producto
  const quitarCantidad = (idProducto) => {
    setCarrito(carritoActual => {
      return carritoActual.map(producto => {
        if (producto.id === idProducto) {
          const cantidadActual = producto.cantidad || 1;
          if (cantidadActual === 1) {
            return null; // Marcar para eliminar
          }
          return { ...producto, cantidad: cantidadActual - 1 };
        }
        return producto;
      }).filter(producto => producto !== null);
    });
  };

  // Función para aumentar cantidad de un producto
  const aumentarCantidad = (idProducto) => {
    setCarrito(carritoActual => {
      return carritoActual.map(producto => {
        if (producto.id === idProducto) {
          const cantidadActual = producto.cantidad || 1;
          const stockDisponible = producto.stock || 0;
          
          // Verificar si ya se alcanzó el límite de stock
          if (cantidadActual >= stockDisponible) {
            alert(`No puedes agregar más unidades. Stock disponible: ${stockDisponible}`);
            return producto; // Retornar sin cambios
          }
          
          // Si hay stock disponible, aumentar cantidad
          return {
            ...producto,
            cantidad: cantidadActual + 1 
          };
        }
        return producto;
      });
    });
  };

  // Función para eliminar un producto completamente del carrito
  const eliminarProducto = (idProducto) => {
    setCarrito(carritoActual => 
      carritoActual.filter(producto => producto.id !== idProducto)
    );
  };

  // Función para vaciar el carrito completo
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Función para obtener la cantidad total de productos
  // .reduce es un método de array que acumula un valor basado en una función que se aplica a cada elemento del array
  // en este caso usamos reduce con total como acumulador y item como el elemento actual del array
  // me permite calcular la cantidad total de productos en el carrito sumando las cantidades de cada producto

  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, item) => total + (item.cantidad || 1), 0); 
  };

  // Función para obtener el total del precio
  const obtenerTotalPrecio = () => {
    return carrito.reduce((sum, item) => {
      const cantidad = item.cantidad || 1;
      return sum + (Number(item.precio) * cantidad);
    }, 0);
  };

  // Función para verificar si un producto está en el carrito
  // some es un método de array que verifica si al menos un elemento cumple con una condición
  // en este caso usamos some para verificar si algún item del carrito tiene el mismo id que el idProducto proporcionado
  // me permite saber si un producto específico ya está en el carrito de compras
  const estaEnCarrito = (idProducto) => {
    return carrito.some(item => item.id === idProducto);
  };

  // Función para obtener la cantidad de un producto específico
  // find es un método de array que busca un elemento que cumpla con una condición y devuelve el primer elemento que la cumple o undefined si no lo encuentra
  // en este caso usamos find para buscar un item del carrito que tenga el mismo id que el idProducto proporcionado
  // me permite obtener la cantidad de un producto específico en el carrito, devolviendo 0 si no está presente
  const obtenerCantidadProducto = (idProducto) => {
    const producto = carrito.find(item => item.id === idProducto);
    // usamos el operador ? para verificar si producto no es undefined (es decir, si se encontró el producto en el carrito)
    // si producto es undefined, retornamos 0
    // si producto existe, retornamos su cantidad o 1 si no tiene cantidad definida
    return producto ? producto.cantidad || 1 : 0;
  };

  // Valores que se proporcionan a través del contexto
  // Exponemos tanto el estado del carrito como las funciones para manipularlo y consultarlo
  // Esto permite que cualquier componente que consuma este contexto pueda interactuar con el carrito de compras de manera completa y sencilla
  const contextValue = {
    // Estado
    carrito,
    setCarrito, // esta función viene de useState y permite actualizar el estado del carrito directamente si es necesario
    
    // Funciones principales
    agregarAlCarrito,
    quitarCantidad,
    aumentarCantidad,
    eliminarProducto,
    vaciarCarrito,
    
    // Funciones de consulta
    obtenerCantidadTotal,
    obtenerTotalPrecio,
    estaEnCarrito,
    obtenerCantidadProducto,
    
    // Propiedades que se pueden llamar directamente para facilitar su uso
    cantidadTotal: obtenerCantidadTotal(),
    totalPrecio: obtenerTotalPrecio(),
    estaVacio: carrito.length === 0
  };

  return (
    // la sintaxis Provider es un componente especial que viene con createContext y permite compartir el valor del contexto con todos los componentes hijos que lo consumen
    // el atributo value es donde se pasa el valor que se quiere compartir, en este caso contextValue que contiene el estado del carrito y las funciones para manipularlo
    <CarritoContext.Provider value={contextValue}>
      {children}
    </CarritoContext.Provider>
  );
};