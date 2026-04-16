import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobal } from '../Context/GlobalContext';

const ProtectedRoute = ({ children, adminOnly = false, staffOnly = false }) => {
  const { usuarioActual } = useGlobal();

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere ser admin y no lo es
  if (adminOnly && usuarioActual.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si requiere ser empleado/admin (personal) y no es ninguno
  if (staffOnly && usuarioActual.rol !== 'admin' && usuarioActual.rol !== 'empleado') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
