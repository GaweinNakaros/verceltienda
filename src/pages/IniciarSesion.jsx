// ====================================================
// IMPORTACIONES
// ====================================================
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
// useNavigate: Hook de react-router-dom para navegar programáticamente
// useLocation: Hook que nos da información sobre la URL actual
import { useNavigate, useLocation } from 'react-router-dom';
// useAuth: Nuestro hook personalizado para acceder al contexto de autenticación
import { useAuth } from '../context/AuthContext';
// Importamos los estilos CSS específicos para este componente
import './IniciarSesion.css';

// ====================================================
// COMPONENTE: INICIAR SESIÓN
// ====================================================
/**
 * Página de login con dos modos: invitado y admin.
 * 
 * Responsabilidades actualizadas:
 * - Formulario controlado para email y, si corresponde, contraseña admin.
 * - Validación de formato de email y presencia de contraseña para admin.
 * - Autenticación vía AuthContext (retorna { exito, mensaje }).
 * - Feedback mediante React Toastify (éxito/error) en lugar de alert().
 * - SEO con React Helmet Async.
 * - Redirección a la ruta previa (from) tras éxito.
 * - Accesibilidad: role="main", aria-labelledby, labels asociados.
 * 
 * Flujo:
 * 1) Usuario llega a /login (posible redirección desde una ruta protegida).
 * 2) Ingresa email (valida formato). Si email corresponde a admin, se solicita contraseña.
 * 3) Se llama a iniciarSesion(email [, password]).
 * 4) En éxito: toast.success y navigate a la ruta original.
 * 5) En error: setError + toast.error con el mensaje del contexto.
 */
function IniciarSesion() {
  // ====================================================
  // HOOKS DE ESTADO
  // ====================================================
  // Estado para almacenar el email que el usuario escribe
  const [email, setEmail] = useState(''); // Inicializado como string vacío
  
  // Estado para almacenar la contraseña que el usuario escribe
  const [password, setPassword] = useState(''); // Inicializado como string vacío
  
  // Estado para controlar si mostramos la contraseña o no
  const [mostrarPassword, setMostrarPassword] = useState(false); // false = oculta
  
  // Estado para almacenar mensajes de error de validación
  const [error, setError] = useState(''); // Inicializado como string vacío
  
  // ====================================================
  // HOOKS DE REACT ROUTER
  // ====================================================
  // useNavigate: Nos da una función para navegar a otras rutas programáticamente
  const navigate = useNavigate();
  
  // useLocation: Nos da información sobre la ubicación/URL actual
  // Útil para saber de dónde viene el usuario
  const location = useLocation();
  
  // ====================================================
  // HOOK DE AUTENTICACIÓN
  // ====================================================
  // Extraemos solo la función iniciarSesion del contexto
  // Usamos destructuring para obtener solo lo que necesitamos
  const { iniciarSesion } = useAuth();

  // ====================================================
  // EXTRAER RUTA DE ORIGEN
  // ====================================================
  /**
   * Optional Chaining (?.) - Sintaxis de ES2020
   * location.state?.from?.pathname
   * 
   * Explicación:
   * - location.state puede ser undefined
   * - El operador ?. devuelve undefined si el objeto es null/undefined
   * - Evita errores como "Cannot read property 'from' of undefined"
   * 
   * Si el usuario fue redirigido desde otra página (ej: /pago),
   * RutaProtegida guarda esa ubicación en location.state.from
   * 
   * Si no hay una ruta guardada, usamos '/' (home) como valor por defecto
   * Operador || (OR): Si el lado izquierdo es falsy, usa el lado derecho
   */
  const from = location.state?.from?.pathname || '/';

  // Determina si el email ingresado corresponde al admin
  const esEmailAdmin = email.trim().toLowerCase() === 'admin@gmail.com.ar';

  // ====================================================
  // FUNCIÓN: VALIDAR EMAIL
  // ====================================================
  /**
   * Valida que un email tenga formato correcto usando expresiones regulares
   * 
   * @param {string} email - El email a validar
   * @returns {boolean} - true si el email es válido, false si no
   * 
   * Expresión Regular (regex) explicada:
   * /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   * 
   * ^             : Inicio del string
   * [^\s@]+       : Uno o más caracteres que NO sean espacios ni @
   * @             : El símbolo @ (obligatorio)
   * [^\s@]+       : Uno o más caracteres que NO sean espacios ni @
   * \.            : Un punto literal (el \ escapa el punto)
   * [^\s@]+       : Uno o más caracteres que NO sean espacios ni @
   * $             : Fin del string
   * 
   * Ejemplos válidos: usuario@email.com, test@dominio.com.ar
   * Ejemplos inválidos: usuario@, @email.com, usuario email.com
   */
  const validarEmail = (email) => {
    // Definimos el patrón de validación
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // test() es un método de las regex que retorna true/false
    return regex.test(email);
  };

  // ====================================================
  // FUNCIÓN: MANEJAR ENVÍO DEL FORMULARIO (con toasts)
  // ====================================================
  /**
   * Se ejecuta cuando el usuario hace submit del formulario
   * 
   * @param {Event} e - Evento del formulario
   * 
   * PROCESO INVITADO/ADMIN:
   * - Invitado: solo email válido → inicia sin contraseña
   * - Admin: email admin → requiere contraseña correcta
   */
  const manejarSubmit = (e) => {
    // e.preventDefault(): Evita que el formulario recargue la página
    // Por defecto, los formularios HTML recargan la página al hacer submit
    e.preventDefault();
    
    // Limpiamos cualquier error anterior
    setError('');

    // ====================================================
    // VALIDACIÓN 1: EMAIL NO VACÍO
    // ====================================================
    // trim(): Elimina espacios en blanco al inicio y final del string
    // !email.trim(): Si el email está vacío o solo tiene espacios, trim() devuelve ''
    // y el ! lo convierte en true
    if (!email.trim()) {
      setError('Por favor, ingresa tu email');
      return; // Detenemos la ejecución aquí
    }

    // ====================================================
    // VALIDACIÓN 2: FORMATO DE EMAIL
    // ====================================================
    if (!validarEmail(email)) {
      setError('Por favor, ingresa un email válido');
      return; // Detenemos la ejecución aquí
    }

    // Si el email es el del admin, exigir contraseña; si no, modo invitado
    let resultado;
    if (esEmailAdmin) {
      // VALIDACIÓN 3 (solo admin): contraseña no vacía
      if (!password.trim()) {
        setError('Por favor, ingresa tu contraseña de administrador');
        return;
      }
      resultado = iniciarSesion(email, password);
    } else {
      // Invitado: iniciar sin contraseña
      resultado = iniciarSesion(email);
    }
    
    // Verificamos si la autenticación fue exitosa (AuthContext)
    if (resultado.exito) {
      toast.success('Sesión iniciada');
      // Redirigir al usuario a la ruta original
      // replace: true evita volver al login con el botón "Atrás"
      navigate(from, { replace: true });
    } else {
      // Caso fallido: mostrar error proveniente de AuthContext
      // Ejemplos: "email no registrado" o "contraseña incorrecta"
      setError(resultado.mensaje);
      toast.error(resultado.mensaje);
    }
  };

  // ====================================================
  // RENDERIZADO DEL COMPONENTE
  // ====================================================
  /**
   * JSX - JavaScript XML
   * Permite escribir HTML dentro de JavaScript
   * React lo convierte en elementos de React
   */
  return (
    <div className="login-container" role="main" aria-labelledby="titulo-login">
      <Helmet>
        <title>Iniciar Sesión</title>
        <meta name="description" content="Accede como invitado o administrador para continuar con tus compras." />
      </Helmet>
      <div className="login-card">
        <h2 id="titulo-login" className="login-titulo">Iniciar Sesión</h2>
        <p className="login-descripcion">
          Ingresa tu email para continuar.
        </p>

        {/* ================================================
            FORMULARIO DE LOGIN
            ================================================
            onSubmit: Evento que se dispara al hacer submit
            Llamamos a manejarSubmit que maneja las validaciones
        */}
        <form onSubmit={manejarSubmit} className="login-form">
          {/* ================================================
              CAMPO DE EMAIL
              ================================================ */}
          <div className="form-group">
            {/* htmlFor: Conecta el label con el input (accesibilidad) */}
            <label htmlFor="email" className="form-label">
              Email
            </label>
            
            {/* ================================================
                INPUT DE EMAIL
                ================================================
                type="email": Tipo de input (HTML5)
                id="email": Identificador único del input
                className: En JSX usamos className en vez de class
                placeholder: Texto de ayuda dentro del input
                value={email}: Valor controlado por React (estado)
                onChange: Se ejecuta cada vez que el usuario escribe
                  - (e) => setEmail(e.target.value)
                  - e.target.value es el texto actual del input
                  - setEmail actualiza el estado con ese valor
                autoFocus: El input recibe el foco automáticamente
            */}
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="tuemail@gmail.com.ar"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          {/* ================================================
              CAMPO DE CONTRASEÑA (SE MUESTRA SOLO SI EMAIL ES ADMIN)
              ================================================ */}
          {esEmailAdmin && (
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña (admin)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="Contraseña de administrador"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="btn-toggle-password"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {/* ================================================
              MENSAJE DE ERROR CONDICIONAL
              ================================================
              {error && <p>...</p>}
              
              Explicación del operador &&:
              - Si 'error' es un string vacío '', es falsy, no renderiza nada
              - Si 'error' tiene texto, es truthy, renderiza el <p>
              
              Esto es un "short-circuit evaluation":
              - false && cualquierCosa = false (no evalúa la derecha)
              - true && cualquierCosa = cualquierCosa (evalúa y retorna la derecha)
          */}
          {error && <p className="error-mensaje">{error}</p>}

          {/* Botón de submit del formulario */}
          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>

        {/* Nota informativa para el usuario */}
        <p className="login-nota">
          Si no tienes cuenta, puedes solo identificarte con tu email.
          <br />
          No es necesario crear una cuenta para realizar compras.
        </p>
      </div>
    </div>
  );
}

// Exportamos el componente para poder importarlo en otros archivos
export default IniciarSesion;
