import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CerrarSesión: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Eliminar el campo 'cargo' del localStorage
    localStorage.removeItem('cargo');
    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
  }, [navigate]);

  return null; // Retorna null ya que no necesitamos renderizar nada
};

export default CerrarSesión;
