import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api';
import '../components/styles/Body.css';
import logo from '../img/logo_horizontal.png';

function EtapaResultadoAvaliacaoFinal({ onNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    nivel_solicitado: '',
    resultado: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      setIsLoading(true);
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao({
          ...data,
          resultado: data.nivel_solicitado // Preenchendo o resultado com o nível solicitado
        });
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>RESULTADO DA AVALIAÇÃO FINAL</h1>

      <div className='dica-div'>
        <strong className='dica-titulo'>Dica:</strong>
        <p className='dica-texto'>
        Por favor, confirme a visualização do resultado final da avaliação para que a equipe possa prosseguir com os próximos passos do processo.
        </p>
      </div>

      <div style={{
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>
          Nome da Empresa Avaliada:
        </label>
        <span style={{
          color: '#333',
          width: '55%',
          textAlign: 'left',
          border: '1px solid black',
          padding: '5px',
          borderRadius: '4px'
        }}>
          {avaliacao.nome_empresa}
        </span>
      </div>

      <div style={{
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>
          Nível Solicitado:
        </label>
        <span style={{
          color: '#333',
          width: '55%',
          textAlign: 'left',
          border: '1px solid black',
          padding: '5px',
          borderRadius: '4px'
        }}>
          {avaliacao.nivel_solicitado}
        </span>
      </div>

      {/* Campo não editável para o resultado final */}
      <div style={{
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>
          Resultado da Avaliação:
        </label>
        <span style={{
          width: '55%',
          padding: '5px',
          border: '1px solid black',
          borderRadius: '4px',
          backgroundColor: '#e0e0e0',
          color: '#333'
        }}>
          {avaliacao.resultado}
        </span>
      </div>

      {/* Botão para confirmar visualização e avançar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <button
          onClick={onNext}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            backgroundColor: '#4CAF50',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          disabled={isLoading}
        >
          CONFIRMAR VISUALIZAÇÃO
        </button>
      </div>
    </div>
  );
}

export default EtapaResultadoAvaliacaoFinal;
