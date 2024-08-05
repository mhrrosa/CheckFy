import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Button.css';
import '../pages/styles/Gerenciamento.css';

function Modelo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { anoSelecionado } = location.state || {};

  return (
    <div className="container">
      <h1>GERENCIAMENTO</h1>
      <div className='botoes-home-gerenciamento'>
        <button className='button-home-gerenciamento' onClick={() => navigate('/processos')}>PROCESSOS</button>
        <button className='button-home-gerenciamento' onClick={() => navigate('/niveis')}>NÍVEIS</button>
        <button className='button-home-gerenciamento' onClick={() => navigate('/resultados-esperados')}>RESULTADOS ESPERADOS</button>
      </div>
      {anoSelecionado && <p>Ano Selecionado: {anoSelecionado}</p>} {/* Exibe o ano selecionado */}
    </div>
  );
}

export default Modelo;