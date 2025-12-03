import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaSoloAdmin({ children }) {
  const { esAdmin, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!esAdmin()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default RutaSoloAdmin;
