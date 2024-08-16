import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/GerenciamentoVersaoModelo.css';
import '../components/styles/Button.css';
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
    navigate('/gerenciamento', { state: { anoSelecionado: ano } });
  };

  return (
    <div className='container-versao-modelo centralizado'>
      <p className='p-selecione-ano'>Selecionar Ano do Modelo MPS-BR</p>
      <div className='botoes-anos'>
        <select className='select-home-gerenciamento' onChange={(e) => handleAnoClick(e.target.value)}>
          {anos.map((ano) => (
            <option key={ano[0]} value={ano[0]}>
              {ano[1]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default GerenciamentoAnos;