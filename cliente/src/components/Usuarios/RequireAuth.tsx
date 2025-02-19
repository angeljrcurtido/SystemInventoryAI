import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface RequireAuthProps {
  allowedRoles: string[];
}

// Componente para proteger rutas basadas en el cargo del usuario
const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  // Obtener el cargo del usuario desde el localStorage
  const userRole = localStorage.getItem('cargo');

  // Verificar si el cargo del usuario está en la lista de roles permitidos
  return allowedRoles.includes(userRole || '') ? (
    <Outlet />
  ) : (
    // Redirigir al login o a una página de acceso denegado si no tiene permiso
    <Navigate to="/login" replace />
  );
};

export default RequireAuth;
