import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Modelo.css';

function Modelo() {
  const navigate = useNavigate();

  return (
    <div className="modelo-container">
      <h1>Gerenciamento</h1>
      <button onClick={() => navigate('/niveis')}>Gerenciar Níveis</button>
      <button onClick={() => navigate('/processos')}>Gerenciar Processos</button>
      <button onClick={() => navigate('/resultados-esperados')}>Gerenciar Resultados Esperados</button>
    </div>
  );
}

export default Modelo;