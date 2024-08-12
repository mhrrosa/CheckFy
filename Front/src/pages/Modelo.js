import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Modelo() {
  const navigate = useNavigate();
  const { ano } = useParams();

  return (
    <div className="modelo-container">
      <h1>GERENCIAMENTO - Modelo MPS-BR {ano}</h1>
      <div className='botoes-modelo'>
        <button className='botao-modelo' onClick={() => navigate(`/niveis/${ano}`)}>Gerenciar Níveis</button>
        <button className='botao-modelo' onClick={() => navigate(`/processos/${ano}`)}>Gerenciar Processos</button>
        <button className='botao-modelo' onClick={() => navigate(`/resultados-esperados/${ano}`)}>Gerenciar Resultados Esperados</button>
      </div>
    </div>
  );
}

export default Modelo;