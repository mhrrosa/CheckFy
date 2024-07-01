import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Body.css';
import '../styles/Container.css';
import '../styles/Modelo.css';

function Modelo() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>GERENCIAMENTO</h1>
      <div className='botoes-modelo'>
        <button className='botao-modelo' onClick={() => navigate('/niveis')}>Gerenciar Níveis</button>
        <button className='botao-modelo' onClick={() => navigate('/processos')}>Gerenciar Processos</button>
        <button className='botao-modelo' onClick={() => navigate('/resultados-esperados')}>Gerenciar Resultados Esperados</button>
      </div>
    </div>
  );
}

export default Modelo;