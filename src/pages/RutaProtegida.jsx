// ====================================================
// IMPORTACIONES
// ====================================================
import React from 'react';
// Navigate: Componente de react-router-dom para redirigir programáticamente
// useLocation: Hook para obtener información de la URL actual
import { Navigate, useLocation } from 'react-router-dom';
// Nuestro hook personalizado para verificar autenticación
import { useAuth } from '../context/AuthContext';

// ====================================================
// COMPONENTE: RUTA PROTEGIDA (HOC - Higher Order Component)
// ====================================================
/**
 * Componente de Ruta Protegida
 * 
 * Este es un patrón HOC (Higher Order Component) que envuelve otros componentes
 * para protegerlos y verificar autenticación antes de renderizarlos
 * 
 * Responsabilidades:
 * - Verificar si el usuario está autenticado
 * - Si NO está autenticado: redirigir a /login
 * - Si SÍ está autenticado: mostrar el componente protegido
 * - Manejar el estado de carga inicial
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componente(s) hijo que se protegen
 * 
 * Uso en App.jsx:
 *   <Route path="/pago" element={
 *     <RutaProtegida>
 *       <Pago />
 *     </RutaProtegida>
 *   } />
 */
function RutaProtegida({ children }) {
  // ====================================================
  // HOOKS
  // ====================================================
  // Extraemos funciones del contexto de autenticación
  const { estaAutenticado, cargando } = useAuth();
  
  // Obtenemos la ubicación actual para guardarla y redirigir después del login
  const location = useLocation();

  // ====================================================
  // CASO 1: ESTADO DE CARGA
  // ====================================================
  /**
   * Mientras el AuthContext está verificando si hay un usuario guardado
   * en localStorage, mostramos un mensaje de "Cargando..."
   * 
   * Esto evita que el usuario vea un "flash" de redirección
   */
  if (cargando) {
    return (
      <div style={{ 
        display: 'flex',           // Flexbox para centrar
        justifyContent: 'center',  // Centrar horizontalmente
        alignItems: 'center',      // Centrar verticalmente
        minHeight: 'calc(100vh - 80px)' // Altura completa menos navbar
      }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  // ====================================================
  // CASO 2: USUARIO NO AUTENTICADO
  // ====================================================
  /**
   * Si el usuario no está autenticado, lo redirigimos a /login
   * 
   * <Navigate /> es un componente de react-router-dom que causa una redirección
   * 
   * Props de Navigate:
   * - to="/login": Ruta destino de la redirección
   * - state={{ from: location }}: Pasamos la ubicación actual en el state
   *   Esto permite que después del login, el usuario vuelva a esta página
   * - replace: Reemplaza la entrada actual del historial (no agrega una nueva)
   *   Esto evita que el usuario pueda volver con el botón "atrás" a la página protegida
   */
  if (!estaAutenticado()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ====================================================
  // CASO 3: USUARIO AUTENTICADO
  // ====================================================
  /**
   * Si el usuario está autenticado, simplemente renderizamos los hijos
   * 
   * {children} es una prop especial de React que contiene todos los
   * componentes que están dentro de <RutaProtegida>...</RutaProtegida>
   * 
   * Ejemplo:
   *   <RutaProtegida>
   *     <Pago />  ← Este es children
   *   </RutaProtegida>
   */
  return children;
}

export default RutaProtegida;