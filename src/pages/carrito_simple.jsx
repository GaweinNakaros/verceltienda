// ====================================================
// IMPORTACIONES
// ====================================================
import React from "react";
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
// Link: Para crear enlaces de navegación
// useNavigate: Para navegar programáticamente (con JavaScript)
import { Link, useNavigate } from "react-router-dom";
// Hook personalizado para acceder al contexto del carrito
import { useCarrito } from "../context/CarritoContext";
// Estilos CSS específicos de este componente
import "./carrito_simple.css";

// ====================================================
// COMPONENTE: CARRITO DE COMPRAS
// ====================================================
/**
 * Componente del carrito de compras
 * 
 * Responsabilidades:
 * - Mostrar todos los productos en el carrito
 * - Permitir aumentar/disminuir cantidades
 * - Permitir eliminar productos
 * - Mostrar el total de la compra
 * - Permitir vaciar el carrito completo (con toast informativo).
 * - Redirigir a la página de pago
 * 
 * Consume el CarritoContext para todas las operaciones
 */
export default function CarritoCompras() {
  // ====================================================
  // HOOKS
  // ====================================================
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // ====================================================
  // CONTEXTO DEL CARRITO
  // ====================================================
  /**
   * Extraemos todo lo que necesitamos del contexto del carrito
   * usando destructuring
   * 
   * - carrito: Array de productos en el carrito
   * - quitarCantidad: Función para restar 1 a la cantidad de un producto
   * - aumentarCantidad: Función para sumar 1 a la cantidad de un producto
   * - eliminarProducto: Función para eliminar completamente un producto
   * - vaciarCarrito: Lo renombramos a vaciarCarritoContext para evitar confusión
   * - cantidadTotal: Total de productos (sumando todas las cantidades)
   * - totalPrecio: Precio total de todos los productos
   */
  const { 
    carrito, 
    quitarCantidad, 
    aumentarCantidad, 
    eliminarProducto, 
    vaciarCarrito: vaciarCarritoContext, // Renombramos con ':'
    cantidadTotal,
    totalPrecio 
  } = useCarrito();


  // ====================================================
  // FUNCIÓN: MANEJAR VACIAR CARRITO (sin confirm modal, con toast)
  // ====================================================
  /**
   * Maneja el evento de vaciar todo el carrito
   * Muestra una confirmación antes de proceder
   * 
   * window.confirm(): Función nativa del navegador
   * - Muestra un diálogo con botones Aceptar/Cancelar
   * - Retorna true si el usuario hace clic en Aceptar
   * - Retorna false si hace clic en Cancelar
   */
  const manejarVaciarCarrito = () => {
    vaciarCarritoContext();
    toast.info('Carrito vaciado');
  };

  // ====================================================
  // FUNCIÓN: MANEJAR ELIMINAR PRODUCTO (con toast informativo)
  // ====================================================
  /**
   * Maneja el evento de eliminar un producto específico del carrito
   * Muestra una confirmación antes de proceder
   * 
   * @param {string|number} idProducto - ID del producto a eliminar
   */
  const manejarEliminarProducto = (idProducto) => {
    const item = carrito.find(p => p.id === idProducto);
    eliminarProducto(idProducto);
    toast.info(`Producto eliminado: ${item?.nombre || 'Producto'}`);
  };

  // ====================================================
  // FUNCIÓN: PROCEDER A COMPRA
  // ====================================================
  /**
   * Redirige al usuario a la página de pago
   * 
   * Esta función usa navigate() en lugar de window.location
   * porque es la forma recomendada en React Router:
   * - Mantiene el estado de la aplicación
   * - Permite transiciones suaves
   * - Funciona con el historial del navegador
   * 
   * NOTA: La página de pago está protegida con RutaProtegida
   * Si el usuario no está autenticado, será redirigido a /login
   */
  const procederCompra = () => {
    // Navegamos a la página de pago
    navigate('/pago');
  };

  // ====================================================
  // RENDERIZADO DEL COMPONENTE
  // ====================================================
  return (
    <div className="carrito-container" role="main" aria-labelledby="carrito-titulo">
      <Helmet>
        <title>Carrito de Compras</title>
        <meta name="description" content="Revisa los productos seleccionados, modifica cantidades y procede al pago de forma segura." />
      </Helmet>
      <h2 id="carrito-titulo" className="carrito-titulo">Carrito de Compras</h2>

      {/* ================================================
          RENDERIZADO CONDICIONAL: CARRITO VACÍO VS CARRITO CON PRODUCTOS
          ================================================
          Usamos un operador ternario para mostrar diferentes UIs:
          - Si carrito.length === 0: Carrito vacío
          - Si no: Carrito con productos
          
          carrito.length: Array.length devuelve el número de elementos
      */}
      {carrito.length === 0 ? (
        // ================================================
        // CASO 1: CARRITO VACÍO
        // ================================================
        <div className="carrito-vacio">
          <p>El carrito está vacío</p>
          {/* Link: Componente de react-router-dom para navegación */}
          <Link to="/productos">
            <button className="btn-continuar-comprando">
              Continuar comprando
            </button>
          </Link>
        </div>
      ) : (
        // ================================================
        // CASO 2: CARRITO CON PRODUCTOS
        // ================================================
        /**
         * Fragment (<>...</>): Agrupa múltiples elementos
         * sin agregar un nodo adicional al DOM
         */
        <>
          {/* ================================================
              LISTA DE PRODUCTOS EN EL CARRITO
              ================================================ */}
          <div className="carrito-items">
            {/* 
              ================================================
              MAPEO DEL ARRAY DE PRODUCTOS
              ================================================
              carrito.map(): Itera sobre cada producto y retorna JSX
              
              Parámetros:
              - item: El producto actual en la iteración
              
              key={item.id}: React requiere una key única para cada elemento
              en una lista para optimizar el renderizado
            */}
            {carrito.map((item) => (
              <div key={item.id} className="carrito-item">
                {/* Información del producto */}
                <div className="item-info">
                  <h4 className="item-nombre">{item.nombre}</h4>
                  
                  {/* 
                    Number(item.precio): Convierte a número (por si es string)
                    .toFixed(2): Formatea a 2 decimales (ej: 19.99)
                  */}
                  <p className="item-precio">
                    Precio unitario: ${Number(item.precio).toFixed(2)}
                  </p>
                  
                  {/* 
                    Subtotal: Precio × Cantidad
                    item.cantidad || 1: Si cantidad es undefined/null, usa 1
                    Operador OR (||) para valor por defecto
                  */}
                  <p className="item-subtotal">
                    Subtotal: $
                    {(Number(item.precio) * (item.cantidad || 1)).toFixed(2)}
                  </p>
                  
                  {/* 
                    Mostrar stock disponible del producto
                    Ayuda al usuario a saber cuántas unidades puede agregar
                  */}
                  <p className="item-precio">
                    Stock disponible: {item.stock || 0}
                  </p>
                </div>

                {/* ================================================
                    CONTROLES DEL PRODUCTO
                    ================================================ */}
                <div className="item-controles">
                  {/* Controles de cantidad (+/-) */}
                  <div className="cantidad-controles">
                    {/* 
                      Botón MENOS (-)
                      onClick: Evento que se ejecuta al hacer clic
                      () => quitarCantidad(item.id): Arrow function que llama
                      a la función del contexto con el ID del producto
                    */}
                    <button
                      onClick={() => quitarCantidad(item.id)}
                      className="btn-cantidad btn-menos"
                      aria-label={`Quitar una unidad de ${item.nombre}`}
                    >-
                    </button>
                    
                    {/* Muestra la cantidad actual */}
                    <span className="cantidad-display">
                      {item.cantidad || 1}
                    </span>
                    
                    {/* Botón MAS (+) */}
                    {/* 
                      Deshabilitar el botón si la cantidad en el carrito 
                      alcanzó el stock disponible del producto
                    */}
                    <button
                      onClick={() => aumentarCantidad(item.id)}
                      className="btn-cantidad btn-mas"
                      disabled={(item.cantidad || 1) >= (item.stock || 0)}
                      style={{
                        opacity: (item.cantidad || 1) >= (item.stock || 0) ? 0.5 : 1,
                        cursor: (item.cantidad || 1) >= (item.stock || 0) ? 'not-allowed' : 'pointer'
                      }}
                      aria-label={`Agregar una unidad de ${item.nombre}`}
                    >+
                    </button>
                  </div>
                  
                  {/* Botón para eliminar el producto completamente */}
                  <button
                    onClick={() => manejarEliminarProducto(item.id)}
                    className="btn-eliminar"
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                  >Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================================================
              RESUMEN DEL CARRITO
              ================================================
              Muestra totales calculados por el contexto
          */}
          <div className="carrito-resumen">
            <h3>Total de productos: {cantidadTotal}</h3>
            <h3 className="total-pagar">
              Total a pagar: ${totalPrecio.toFixed(2)}
            </h3>
          </div>

          {/* ================================================
              BOTONES DE ACCIÓN
              ================================================ */}
          <div className="carrito-acciones">
            {/* Botón para volver al catálogo */}
            <Link to="/productos">
              <button className="btn-continuar-comprando">
                Continuar comprando
              </button>
            </Link>

            <div className="acciones-derecha">
              {/* Botón para vaciar el carrito */}
              <button onClick={manejarVaciarCarrito} className="btn-vaciar" aria-label="Vaciar todo el carrito">
                Vaciar Carrito
              </button>

              {/* 
                Botón para proceder a la compra
                Redirige a /pago (que está protegido por autenticación)
              */}
              <button onClick={procederCompra} className="btn-comprar">
                Proceder a compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
