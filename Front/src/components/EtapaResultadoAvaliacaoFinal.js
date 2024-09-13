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
    <div style={{
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: 'auto'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
      }}>RESULTADO DA AVALIAÇÃO FINAL</h1>

      <div style={{
        backgroundColor: '#e0e0e0',
        borderLeft: '4px solid #a0a0a0',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong style={{ color: '#555' }}>Dica:</strong>
        <p style={{ color: '#333', margin: '5px 0' }}>
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
        <img src={logo} alt="Logo Checkfy" style={{ height: '50px' }} />
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
