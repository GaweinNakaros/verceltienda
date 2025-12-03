// ====================================================
// IMPORTACIONES
// ====================================================

import React from "react";
import { FiHome, FiBox, FiTool, FiShoppingCart, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { NavLink } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import './navbar.css';

// Navbar con iconografía accesible, contador de carrito y acciones de sesión
function Navbar() {
  const { cantidadTotal } = useCarrito();
  const { usuario, cerrarSesion, estaAutenticado, esAdmin } = useAuth();

  // Cierre de sesión con feedback mediante toast (sin confirm modal)
  const manejarCerrarSesion = () => {
    cerrarSesion();
    toast.success('Sesión cerrada');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-gradient sticky-top shadow">
      <div className="container-fluid py-0">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link px-3 d-flex align-items-center gap-1" to="/" end aria-label="Ir a inicio">
                <FiHome aria-hidden="true" /> <span>Inicio</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 d-flex align-items-center gap-1" to="/productos" aria-label="Ver productos">
                <FiBox aria-hidden="true" /> <span>Productos</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 d-flex align-items-center gap-1" to="/servicios" aria-label="Ver servicios">
                <FiTool aria-hidden="true" /> <span>Servicios</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 d-flex align-items-center" to="/carrito" aria-label="Ver carrito de compras">
                <FiShoppingCart aria-hidden="true" className="me-1" /> Carrito
                {cantidadTotal > 0 && (
                  <span className="badge bg-danger rounded-pill ms-2">
                    {cantidadTotal}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3 ms-auto navbar-auth">
            {estaAutenticado() ? (
              <>
                {esAdmin() && (
                  <NavLink className="nav-link px-3 d-flex align-items-center" to="/admin/productos" aria-label="Administrar productos">
                    <FiTool aria-hidden="true" className="me-1" /> <span>Administrar Productos</span>
                  </NavLink>
                )}
                <div className="d-flex align-items-center gap-2 bg-light bg-opacity-25 rounded px-2 py-1 text-white">
                  <FiUser aria-hidden="true" />
                  <span className="fw-semibold">{usuario?.email}</span>
                </div>
                <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" onClick={manejarCerrarSesion} aria-label="Cerrar sesión">
                  <FiLogOut aria-hidden="true" /> <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <NavLink className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" to="/login" aria-label="Iniciar sesión">
                <FiLogIn aria-hidden="true" /> <span>Iniciar Sesión</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
