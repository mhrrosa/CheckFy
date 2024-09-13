import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById, enviarEmailResultadoAvaliacaoInicial } from '../services/Api';
import '../components/styles/Body.css';
import logo from '../img/logo_horizontal.png';

function EtapaAtribuirNivelMaturidade({ onNext, onDuploNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    nivel_solicitado: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      setIsLoading(true);
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleNext = () => {
    onNext();
  };

  const handleDuploNext = async () => {
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando o resultado da auditoria inicial. Deseja continuar?');

    if (confirmacao) {
      try {
        await enviarEmailResultadoAvaliacaoInicial(location.state.id);
        alert('E-mail enviado com sucesso!');
        onDuploNext();
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Houve um erro ao enviar o e-mail. Tente novamente.');
      }
    }
  };

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
      }}>ATRIBUIR NÍVEL DE MATURIDADE</h1>

    <div style={{
            backgroundColor: '#e0e0e0', // Fundo mais escuro para maior contraste
            borderLeft: '4px solid #a0a0a0', // Borda levemente destacada
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
        }}>
            <strong style={{ color: '#555' }}>Dica:</strong> {/* Texto de dica mais escuro */}
            <p style={{ color: '#333', margin: '5px 0' }}>
            Rever a Caracterização dos Processos: Antes de iniciar a atividade, certifique-se de que todos os processos foram devidamente caracterizados. Esta revisão é fundamental para garantir que todas as informações estejam corretas e atualizadas.
            </p>
        </div>

      {/* Exibindo somente o campo "Nível Solicitado" */}
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
      {/* Exibindo o campo "Nível Solicitado" */}
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
      
      {/* Botões de ação */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <img src={logo} alt="Logo Checkfy" style={{ height: '50px' }} />
        <button
          onClick={handleDuploNext}
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
          SATISFEITO
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            backgroundColor: '#f44336',
            transition: 'background-color 0.3s ease',
            marginLeft:'10px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
          disabled={isLoading}
        >
          NÃO SATISFEITO
        </button>
      </div>
    </div>
  );
}

export default EtapaAtribuirNivelMaturidade;
