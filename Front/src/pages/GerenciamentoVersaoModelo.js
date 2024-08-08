import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/GerenciamentoAnos.css';
import { getVersaoModelo } from '../services/Api';

function GerenciamentoAnos() {
  const [anos, setAnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAnos() {
      try {
        const response = await getVersaoModelo();
        const anosNomes = response.map(versao => versao);
        setAnos(anosNomes);
      } catch (error) {
        console.error('Erro ao buscar versões do modelo:', error);
      }
    }

    fetchAnos();
  }, []);

  const handleAnoClick = (ano) => {
    localStorage.setItem('anoSelecionado', ano);  // Armazena no localStorage
    navigate('/modelo', { state: { anoSelecionado: ano } });
  };

  return (
    <div className="gerenciamento-anos-container">
      <h1>Selecionar Ano do Modelo MPS-BR</h1>
      <div className='botoes-anos'>
        {anos.map((ano) => (
          <button key={ano} className='botao-ano' onClick={() => handleAnoClick(ano[0])}>
            {ano[1]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GerenciamentoAnos;