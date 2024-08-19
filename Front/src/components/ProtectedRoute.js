import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { userType } = useContext(UserContext);
  console.log('userType no ProtectedRoute:', userType);

  if (!userType) {
    console.log('Redirecionando para login-cadastro, userType não definido.');
    return <Navigate to="/login-cadastro" replace />;
  }

  console.log('Autorizado, renderizando a rota');
  return children; // Se estiver logado, renderiza a rota normalmente
};

export default ProtectedRoute;