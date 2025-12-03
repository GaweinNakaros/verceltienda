// ====================================================
// IMPORTACIONES
// ====================================================
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
// useNavigate: Para redirigir después de completar la compra
import { useNavigate } from 'react-router-dom';
// Nuestros hooks personalizados de los contextos
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
// Estilos de la página
import './Pago.css';

// ====================================================
// COMPONENTE: PÁGINA DE PAGO (PROTEGIDA)
// ====================================================
/**
 * Componente de Página de Pago
 * Esta página está protegida y requiere autenticación
 * 
 * Responsabilidades:
 * - Mostrar resumen de la orden
 * - Recopilar información de envío del cliente
 * - Validar todos los campos del formulario
 * - Procesar el pago (simulado) con feedback mediante toast.
 * - Vaciar el carrito después de una compra exitosa y redirigir.
 * - SEO con Helmet y accesibilidad en contenedores.
 * 
 * NOTA: Esta página solo es accesible si el usuario está autenticado
 * RutaProtegida en App.jsx se encarga de verificar esto
 */
function Pago() {
  // ====================================================
  // HOOKS
  // ====================================================
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Del contexto del carrito extraemos:
  // - carrito: Array con los productos
  // - totalPrecio: Precio total de todos los productos
  // - cantidadTotal: Cantidad total de productos
  // - vaciarCarrito: Función para limpiar el carrito
  const { carrito, totalPrecio, cantidadTotal, vaciarCarrito } = useCarrito();
  
  // Del contexto de autenticación extraemos:
  // - usuario: Objeto con datos del usuario autenticado (incluye email)
  const { usuario } = useAuth();
  const { actualizarStock } = useApi();

  // ====================================================
  // ESTADO: DATOS DEL FORMULARIO
  // ====================================================
  /**
   * useState con un objeto inicial
   * formData almacena todos los campos del formulario en un solo objeto
   * 
   * Estructura del objeto:
   * {
   *   nombreCompleto: string,
   *   direccion: string,
   *   ciudad: string,
   *   codigoPostal: string,
   *   telefono: string,
   *   metodoPago: string (valor por defecto: 'tarjeta')
   * }
   */
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
    metodoPago: 'tarjeta' // Valor por defecto
  });

  // ====================================================
  // ESTADO: ERRORES DE VALIDACIÓN
  // ====================================================
  /**
   * Objeto para almacenar errores de validación por campo
   * Estructura: { nombreCampo: 'mensaje de error' }
   * 
   * Ejemplo:
   * {
   *   nombreCompleto: 'El nombre completo es requerido',
   *   telefono: 'El teléfono debe tener 10 dígitos'
   * }
   */
  const [errores, setErrores] = useState({});
  
  // ====================================================
  // ESTADO: PROCESANDO PAGO
  // ====================================================
  /**
   * Boolean para indicar si el pago está siendo procesado
   * Usado para:
   * - Deshabilitar el botón de pago mientras se procesa
   * - Mostrar "Procesando..." en lugar de "Realizar Pago"
   */
  const [procesando, setProcesando] = useState(false);

  // ====================================================
  // FUNCIÓN: MANEJAR CAMBIOS EN EL FORMULARIO
  // ====================================================
  /**
   * Se ejecuta cada vez que el usuario escribe en cualquier campo del formulario
   * 
   * @param {Event} e - Evento del input
   * 
   * Proceso:
   * 1. Extrae el nombre del campo y su valor del evento
   * 2. Actualiza el estado formData manteniendo los demás campos intactos
   * 3. Limpia el error de ese campo si existía
   * 
   * Destructuring:
   * const { name, value } = e.target;
   * Equivale a:
   * const name = e.target.name;
   * const value = e.target.value;
   */
  const manejarCambio = (e) => {
    // Extraemos el nombre y valor del input que cambió
    const { name, value } = e.target;
    
    // Actualizamos formData de forma inmutable
    setFormData(prev => ({
      ...prev,        // Spread operator: copia todas las propiedades existentes
      [name]: value   // Computed property: actualiza solo la propiedad que cambió
    }));
    
    // Limpiamos el error del campo cuando el usuario empieza a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,      // Mantenemos los demás errores
        [name]: ''    // Limpiamos el error de este campo específico
      }));
    }
  };

  // ====================================================
  // FUNCIÓN: VALIDAR FORMULARIO
  // ====================================================
  /**
   * Valida todos los campos del formulario
   * 
   * @returns {Object} - Objeto con los errores encontrados
   *                     Si está vacío {}, no hay errores
   * 
   * Validaciones:
   * - Campos requeridos no pueden estar vacíos
   * - Teléfono debe tener exactamente 10 dígitos
   */
  const validarFormulario = () => {
    // Objeto para acumular errores
    const nuevosErrores = {};

    // Validación: Nombre completo
    // trim(): Elimina espacios al inicio y final
    // !...trim(): Si está vacío después del trim, es inválido
    if (!formData.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre completo es requerido';
    }

    // Validación: Dirección
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }

    // Validación: Ciudad
    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }

    // Validación: Código postal
    if (!formData.codigoPostal.trim()) {
      nuevosErrores.codigoPostal = 'El código postal es requerido';
    }

    // Validación: Teléfono (más compleja)
    if (!formData.telefono.trim()) {
      // Primero verificamos si está vacío
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
      // Si no está vacío, verificamos el formato
      // formData.telefono.replace(/\D/g, ''): Remueve todo lo que NO sea dígito
      // /^\d{10}$/: Regex que verifica exactamente 10 dígitos
      // \d: cualquier dígito (0-9)
      // {10}: exactamente 10 veces
      // ^: inicio del string, $: fin del string
      nuevosErrores.telefono = 'El teléfono debe tener 10 dígitos';
    }

    // Retornamos el objeto con los errores encontrados
    return nuevosErrores;
  };

  // ====================================================
  // FUNCIÓN: MANEJAR ENVÍO DEL FORMULARIO (SUBMIT) con toasts y actualización de stock
  // ====================================================
  /**
   * Se ejecuta cuando el usuario hace submit del formulario de pago
   * 
   * @param {Event} e - Evento del formulario
   * 
   * Proceso:
   * 1. Previene el comportamiento por defecto del formulario
   * 2. Valida todos los campos
   * 3. Si hay errores, los muestra y detiene el proceso
   * 4. Si no hay errores, simula el procesamiento del pago
   * 5. Muestra mensaje de éxito
   * 6. Vacía el carrito
   * 7. Redirige al catálogo de productos
   * 
   * NOTA: Esta es una simulación. En producción, aquí se haría una
   * llamada a una API de pago real (Stripe, PayPal, MercadoPago, etc.)
   */
  // Utilidad: simula el procesamiento de pago con una espera
  const procesarPagoSimulado = () => new Promise((resolve) => {
    setTimeout(() => resolve({ exito: true, ordenId: Date.now().toString() }), 2000);
  });

  const manejarSubmit = async (e) => {
    // Prevenimos que el formulario recargue la página
    e.preventDefault();

    // Validamos el formulario
    const nuevosErrores = validarFormulario();
    
    // Object.keys(obj): Retorna un array con las claves del objeto
    // Si el objeto tiene claves, significa que hay errores
    if (Object.keys(nuevosErrores).length > 0) {
      // Guardamos los errores en el estado para mostrarlos en la UI
      setErrores(nuevosErrores);
      return; // Detenemos la ejecución
    }

    // Si llegamos aquí, todas las validaciones pasaron
    // Activamos el estado de "procesando"
    setProcesando(true);

    try {
      // 1) Procesar pago (simulado)
      const resultadoPago = await procesarPagoSimulado();

      if (!resultadoPago.exito) {
        throw new Error('El pago no pudo completarse');
      }

      // 2) Notificar actualización de stock al backend (MockAPI)
      const items = carrito.map((i) => ({ productoId: i.id, cantidad: i.cantidad }));
      await actualizarStock(items);

      // 3) Confirmación al usuario (toast accesible)
      toast.success(`Compra exitosa: ${cantidadTotal} producto(s), Total $${totalPrecio.toFixed(2)}`);

      // 4) Limpiar y redirigir
      vaciarCarrito();
      setProcesando(false);
      navigate('/productos');
    } catch (err) {
      console.error('Error en pago/stock:', err);
      setProcesando(false);
      toast.error('Pago OK, pero falló actualización de stock. Revisaremos manualmente.');
    }
  };

  return (
    <div className="pago-container" role="main" aria-labelledby="pago-titulo">
      <Helmet>
        <title>Finalizar Compra</title>
        <meta name="description" content="Completa tus datos de envío y confirma tu compra de forma segura." />
      </Helmet>
      <div className="pago-content">
        <h2 id="pago-titulo" className="pago-titulo">Finalizar Compra</h2>
        
        <div className="pago-info-usuario">
          <p>📧 <strong>Comprando como:</strong> {usuario?.email}</p>
        </div>

        <div className="pago-grid">
          {/* Formulario de pago */}
          <div className="pago-formulario">
            <h3>Datos de Envío</h3>
            <form onSubmit={manejarSubmit}>
              <div className="form-group">
                <label htmlFor="nombreCompleto">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={manejarCambio}
                  className={errores.nombreCompleto ? 'error' : ''}
                />
                {errores.nombreCompleto && <span className="error-text">{errores.nombreCompleto}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={manejarCambio}
                  className={errores.direccion ? 'error' : ''}
                />
                {errores.direccion && <span className="error-text">{errores.direccion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={manejarCambio}
                    className={errores.ciudad ? 'error' : ''}
                  />
                  {errores.ciudad && <span className="error-text">{errores.ciudad}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={manejarCambio}
                    className={errores.codigoPostal ? 'error' : ''}
                  />
                  {errores.codigoPostal && <span className="error-text">{errores.codigoPostal}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={manejarCambio}
                  placeholder="1234567890"
                  className={errores.telefono ? 'error' : ''}
                />
                {errores.telefono && <span className="error-text">{errores.telefono}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="metodoPago">Método de Pago</label>
                <select
                  id="metodoPago"
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={manejarCambio}
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="efectivo">Efectivo contra entrega</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn-pagar"
                disabled={procesando || carrito.length === 0}
              >
                {procesando ? 'Procesando...' : 'Realizar Pago'}
              </button>
            </form>
          </div>

          {/* Resumen de la orden */}
          <div className="pago-resumen">
            <h3>Resumen de la Orden</h3>
            
            <div className="resumen-productos">
              {carrito.map(item => (
                <div key={item.id} className="resumen-item">
                  <span className="item-nombre">{item.nombre}</span>
                  <span className="item-cantidad">x{item.cantidad}</span>
                  <span className="item-precio">${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="resumen-totales">
              <div className="total-linea">
                <span>Subtotal:</span>
                <span>${totalPrecio.toFixed(2)}</span>
              </div>
              <div className="total-linea">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="total-linea total-final">
                <span>Total:</span>
                <span>${totalPrecio.toFixed(2)}</span>
              </div>
            </div>

            <div className="resumen-info">
              <p>✓ Envío gratis en compras superiores a $1000</p>
              <p>✓ Compra segura y protegida</p>
              <p>✓ Devoluciones gratuitas dentro de 30 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pago;
