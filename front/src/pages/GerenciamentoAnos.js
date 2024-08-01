import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/GerenciamentoAnos.css';

const anos = [2021, 2022, 2023]; // Adicione aqui todos os anos disponíveis

function GerenciamentoAnos() {
  const navigate = useNavigate();

  const handleAnoClick = (ano) => {
    navigate(`/modelo/${ano}`);
  };

  return (
    <div className="gerenciamento-anos-container">
      <h1>Selecionar Ano do Modelo MPS-BR</h1>
      <div className='botoes-anos'>
        {anos.map((ano) => (
          <button key={ano} className='botao-ano' onClick={() => handleAnoClick(ano)}>
            {ano}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GerenciamentoAnos;
