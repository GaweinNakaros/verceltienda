// ====================================================
// IMPORTACIONES
// ====================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
// createContext: Crea un contexto de React para compartir datos entre componentes
// useContext: Hook para acceder al valor del contexto
// useState: Hook para manejar estado local del componente
// useEffect: Hook para ejecutar efectos secundarios (como leer localStorage)

// ====================================================
// BASE DE DATOS DE USUARIOS
// ====================================================
/**
 * Base de datos simulada de usuarios del sistema
 * 
 * En una aplicación real, esto estaría en un backend con base de datos
 * y las contraseñas estarían hasheadas (encriptadas)
 * 
 * Estructura de cada usuario:
 * - email: Identificador único del usuario
 * - password: Contraseña en texto plano (solo para desarrollo)
 * - rol: 'admin' para administradores, 'usuario' para usuarios normales
 * - nombre: Nombre completo del usuario
 */
const USUARIOS_DB = [
  {
    email: 'admin@gmail.com.ar',
    password: 'admin',
    rol: 'admin',
    nombre: 'Administrador del Sistema'
  },
  // Puedes agregar más usuarios aquí en el futuro
  // {
  //   email: 'usuario@gmail.com',
  //   password: '12345',
  //   rol: 'usuario',
  //   nombre: 'Usuario Normal'
  // }
];

// ====================================================
// CREACIÓN DEL CONTEXTO
// ====================================================
// createContext() crea un objeto de contexto que nos permite compartir
// el estado de autenticación en toda la aplicación sin pasar props manualmente
const AuthContext = createContext();

// ====================================================
// HOOK PERSONALIZADO: useAuth
// ====================================================
/**
 * Hook personalizado para acceder al contexto de autenticación
 * Este patrón es común en React para simplificar el uso de contextos
 * 
 * @returns {Object} - Objeto con las funciones y estado de autenticación
 * @throws {Error} - Si se usa fuera de un AuthProvider
 * 
 * Uso:
 *   const { usuario, iniciarSesion, cerrarSesion } = useAuth();
 */
export const useAuth = () => {
  // useContext() extrae el valor actual del contexto
  const context = useContext(AuthContext);
  
  // Validación: Si context es undefined, significa que el componente
  // no está envuelto en <AuthProvider>, entonces lanzamos un error
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  // Retornamos el contexto para que el componente pueda usarlo
  return context;
};

// ====================================================
// COMPONENTE PROVEEDOR: AuthProvider
// ====================================================
/**
 * Proveedor del contexto de autenticación
 * Este componente envuelve toda la aplicación y proporciona el estado
 * de autenticación a todos los componentes hijos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * 
 * Responsabilidades:
 * - Mantener el estado del usuario autenticado
 * - Persistir y recuperar la sesión desde localStorage
 * - Proporcionar funciones para iniciar/cerrar sesión
 */
export const AuthProvider = ({ children }) => {
  // ====================================================
  // ESTADO LOCAL
  // ====================================================
  
  // useState(null): Inicializa el estado 'usuario' en null (no autenticado)
  // setUsuario: Función para actualizar el estado del usuario
  const [usuario, setUsuario] = useState(null);
  
  // Estado para indicar si estamos cargando los datos del localStorage
  // Importante para evitar parpadeos en la UI durante la carga inicial
  const [cargando, setCargando] = useState(true);

  // ====================================================
  // EFECTO: RECUPERAR SESIÓN AL MONTAR
  // ====================================================
  /**
   * useEffect se ejecuta después de que el componente se renderiza
   * El array vacío [] significa que solo se ejecuta UNA VEZ al montar el componente
   * 
   * Propósito: Verificar si existe una sesión guardada en localStorage
   * y restaurar el estado del usuario
   */
  useEffect(() => {
    // localStorage.getItem('usuario'): Recupera el valor guardado con la clave 'usuario'
    // localStorage es una API del navegador que persiste datos entre sesiones
    const usuarioGuardado = localStorage.getItem('usuario');
    
    // Si existe un usuario guardado (no es null)
    if (usuarioGuardado) {
      // JSON.parse(): Convierte el string JSON de vuelta a un objeto JavaScript
      // localStorage solo guarda strings, por eso necesitamos parsear
      setUsuario(JSON.parse(usuarioGuardado));
    }
    
    // Marcamos que terminamos de cargar
    setCargando(false);
  }, []); // Array vacío = solo se ejecuta al montar el componente

  // ====================================================
  // FUNCIÓN: INICIAR SESIÓN (ADMIN O INVITADO)
  // ====================================================
  /**
   * Inicia sesión permitiendo dos modos:
   * - ADMIN: requiere email+password y se valida contra USUARIOS_DB
   * - INVITADO: cualquier email distinto al admin se autentica sin contraseña
   * 
   * @param {string} email - Email del usuario
   * @param {string} [password] - Contraseña (solo requerida para admin)
   * 
   * @returns {Object} - { exito, mensaje, usuario }
   */
  const iniciarSesion = (email, password) => {
    // Si el email corresponde al admin, validar contra la DB
    const usuarioAdmin = USUARIOS_DB.find(u => u.email === email);

    if (usuarioAdmin) {
      // Modo ADMIN: exigir contraseña exacta
      if (usuarioAdmin.password !== password) {
        return { exito: false, mensaje: 'La contraseña es incorrecta' };
      }

      const sesionAdmin = {
        email: usuarioAdmin.email,
        nombre: usuarioAdmin.nombre,
        rol: usuarioAdmin.rol,
        fechaIngreso: new Date().toISOString()
      };

      setUsuario(sesionAdmin);
      localStorage.setItem('usuario', JSON.stringify(sesionAdmin));
      return { exito: true, mensaje: 'Inicio de sesión exitoso', usuario: sesionAdmin };
    }

    // Modo INVITADO: cualquier email no admin inicia sin password
    const sesionInvitado = {
      email,
      nombre: 'Invitado',
      rol: 'usuario',
      fechaIngreso: new Date().toISOString()
    };

    setUsuario(sesionInvitado);
    localStorage.setItem('usuario', JSON.stringify(sesionInvitado));
    return { exito: true, mensaje: 'Sesión iniciada como invitado', usuario: sesionInvitado };
  };

  // ====================================================
  // FUNCIÓN: CERRAR SESIÓN
  // ====================================================
  /**
   * Cierra la sesión del usuario actual
   * 
   * Proceso:
   * 1. Limpia el estado local de React (usuario = null)
   * 2. Elimina el usuario del localStorage
   */
  const cerrarSesion = () => {
    // Establecemos el usuario en null (no autenticado)
    setUsuario(null);
    
    // Eliminamos el usuario del localStorage
    // Esto asegura que no se restaure la sesión al recargar la página
    localStorage.removeItem('usuario');
  };

  // ====================================================
  // FUNCIÓN: VERIFICAR AUTENTICACIÓN
  // ====================================================
  /**
   * Verifica si hay un usuario autenticado actualmente
   * 
   * @returns {boolean} - true si hay un usuario autenticado, false si no
   * 
   * Uso común:
   *   if (estaAutenticado()) {
   *     // Mostrar contenido para usuarios autenticados
   *   }
   */
  const estaAutenticado = () => {
    // Retorna true si usuario no es null, false si es null
    return usuario !== null;
  };

  // ====================================================
  // FUNCIÓN: VERIFICAR SI ES ADMINISTRADOR
  // ====================================================
  /**
   * Verifica si el usuario actual tiene rol de administrador
   * 
   * @returns {boolean} - true si el usuario es admin, false si no lo es o no está autenticado
   * 
   * PROCESO:
   * 1. Verifica que exista un usuario autenticado
   * 2. Verifica que el rol del usuario sea 'admin'
   * 
   * Uso común:
   *   if (esAdmin()) {
   *     // Mostrar panel de administración
   *     // Permitir acciones de administrador
   *   }
   * 
   * EJEMPLO DE USO EN COMPONENTES:
   * 
   *   const { esAdmin } = useAuth();
   *   
   *   return (
   *     <div>
   *       <h1>Panel de Control</h1>
   *       {esAdmin() && (
   *         <button>Eliminar Producto</button>
   *       )}
   *     </div>
   *   );
   */
  const esAdmin = () => {
    // El operador && evalúa de izquierda a derecha
    // Si usuario es null, retorna false sin evaluar el resto
    // Si usuario existe, evalúa usuario.rol === 'admin'
    return usuario !== null && usuario.rol === 'admin';
  };

  // ====================================================
  // FUNCIÓN: OBTENER ROL DEL USUARIO
  // ====================================================
  /**
   * Obtiene el rol del usuario actual
   * 
   * @returns {string|null} - El rol del usuario ('admin' o 'usuario') o null si no está autenticado
   * 
   * Útil para:
   * - Mostrar badges o etiquetas de rol en la UI
   * - Realizar validaciones condicionales
   * - Logging y auditoría
   * 
   * EJEMPLO DE USO:
   * 
   *   const { obtenerRol } = useAuth();
   *   const rol = obtenerRol();
   *   
   *   return (
   *     <div>
   *       <span>Tu rol es: {rol || 'Invitado'}</span>
   *     </div>
   *   );
   */
  const obtenerRol = () => {
    // El operador ? : (ternario) evalúa una condición
    // Si usuario existe, retorna usuario.rol
    // Si usuario es null, retorna null
    return usuario ? usuario.rol : null;
  };

  // ====================================================
  // VALOR DEL CONTEXTO
  // ====================================================
  /**
   * Este objeto contiene todo lo que queremos compartir con los componentes
   * que consuman este contexto
   * 
   * Cualquier componente que use useAuth() tendrá acceso a:
   * - usuario: Objeto con datos del usuario actual (o null)
   * - iniciarSesion: Función para autenticar con validación
   * - cerrarSesion: Función para desautenticar
   * - estaAutenticado: Función para verificar autenticación
   * - esAdmin: Función para verificar si el usuario es administrador
   * - obtenerRol: Función para obtener el rol del usuario
   * - cargando: Boolean que indica si estamos cargando datos iniciales
   */
  const value = {
    usuario,           // Estado actual del usuario (incluye: email, nombre, rol, fechaIngreso)
    iniciarSesion,     // Función para login con validación de credenciales
    cerrarSesion,      // Función para logout
    estaAutenticado,   // Función de verificación de autenticación
    esAdmin,           // Función para verificar si el usuario es admin
    obtenerRol,        // Función para obtener el rol del usuario
    cargando           // Estado de carga inicial
  };

  // ====================================================
  // RENDERIZADO DEL PROVEEDOR
  // ====================================================
  /**
   * AuthContext.Provider es el componente que hace disponible
   * el contexto a todos sus hijos
   * 
   * - value={value}: Pasa el objeto 'value' como valor del contexto
   * - {children}: Renderiza todos los componentes hijos que envuelve
   * 
   * Ejemplo de uso en App.jsx:
   *   <AuthProvider>
   *     <App />
   *   </AuthProvider>
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
