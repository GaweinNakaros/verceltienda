// Importaciones principales
import React from 'react'
// Componentes de enrutamiento de React Router
import { Routes, Route } from 'react-router-dom'
// Importación de componentes de la aplicación
import Navbar from './pages/navbar'
import Footer from './components/Footer'
import Inicio from './pages/inicio'
import Servicios from './pages/servicios'
import Productos from './pages/productos'
import AdminProductos from './pages/AdminProductos'
import ProductoDetalle from './pages/productoDetalle'
import CarritoCompras from './pages/carrito_simple'
import IniciarSesion from './pages/IniciarSesion'
import Pago from './pages/Pago'
import RutaProtegida from './pages/RutaProtegida'
import RutaSoloAdmin from './pages/RutaSoloAdmin'
// Importación de los proveedores de contexto
import { CarritoProvider } from './context/CarritoContext'
import { AuthProvider } from './context/AuthContext'
import { CategoriasProvider } from './context/CategoriasContext'
import { SliderProvider } from './context/SliderContext'
import { PromocionesProvider } from './context/PromocionesContext'
import { BannersProvider } from './context/BannersContext'
import { ApiProvider } from './context/ApiContext'
// Importacion de estilos globales
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Componente principal de la aplicación
 * 
 * Responsabilidades actualizadas:
 * - Gestionar el enrutamiento de toda la app.
 * - Envolver con proveedores de contexto (Auth, Carrito, Categorías, Slider, Promociones, Banners, Api).
 * - Aplicar tema y estilos globales (ThemeProvider + GlobalStyle).
 * - Proveer SEO por página (HelmetProvider).
 * - Habilitar notificaciones no bloqueantes (ToastContainer).
 * 
 * No implementa la lógica de negocio de cada contexto.
 */
function App() {
  return (
    <HelmetProvider>
    <AuthProvider>
      <CategoriasProvider>
        <SliderProvider>
          <PromocionesProvider>
            <BannersProvider>
              <ApiProvider>
              <ThemeProvider theme={theme}>
              <GlobalStyle />
              <CarritoProvider>
                <div className="app-shell d-flex flex-column min-vh-100">
                  {/* Barra de navegación presente en todas las páginas */}
                  <Navbar />
                  {/* Configuración de rutas de la aplicación */}
                  <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/productos/:id" element={<ProductoDetalle />} />
                    <Route path="/admin/productos" element={
                      <RutaSoloAdmin>
                        <AdminProductos />
                      </RutaSoloAdmin>
                    } />
                    <Route path="/carrito" element={<CarritoCompras />} />
                    <Route path="/login" element={<IniciarSesion />} />
                    <Route path="/pago" element={<RutaProtegida><Pago /></RutaProtegida>} />
                  </Routes>
                  <Footer />
                  <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
                </div>
              </CarritoProvider>
              </ThemeProvider>
              </ApiProvider>
            </BannersProvider>
          </PromocionesProvider>
        </SliderProvider>
      </CategoriasProvider>
    </AuthProvider>
    </HelmetProvider>
  )
}

export default App
