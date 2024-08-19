import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { userType } = useContext(UserContext);

  console.log('userType no ProtectedRoute:', userType);

  if (userType === null) {
    console.log('ProtectedRoute: Redirecionando para /login-cadastro');
    return <Navigate to="/login-cadastro" replace />;
  }

  console.log('ProtectedRoute: Autorizado, renderizando a rota');
  return children; // Se estiver logado, renderiza a rota normalmente
};

export default ProtectedRoute;