import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById, enviarEmailResultadoAvaliacaoInicial } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/EtapaAtribuirNivelMaturidade.css';
import logo from '../img/logo_horizontal.png';

function EtapaAtribuirNivelMaturidade({ onNext, onDuploNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    nivel_solicitado: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('SATISFEITO');

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

  const handleNext = async () => {
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando o resultado da auditoria inicial. Deseja continuar?');

    if (confirmacao) {
      setButtonText('ENVIANDO E-MAIL'); // Muda o texto do botão
      setIsLoading(true); // Ativa o loading

      try {
        await enviarEmailResultadoAvaliacaoInicial(location.state.id);
        alert('E-mail enviado com sucesso!');
        onNext();
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Houve um erro ao enviar o e-mail. Tente novamente.');
      } finally {
        setIsLoading(false); // Desativa o loading
        setButtonText('SATISFEITO'); // Restaura o texto original
      }
    }
  };

  return (
    <div className='cotainer-etapa'>
      <h1 className='title-form'>ATRIBUIR NÍVEL DE MATURIDADE</h1>

      <div className='dica-div'>
        <strong className='dica-titulo'>Dica:</strong>
        <p className='dica-texto'>
          Rever a Caracterização dos Processos: Antes de iniciar a atividade, certifique-se de que todos os processos foram devidamente caracterizados. Esta revisão é fundamental para garantir que todas as informações estejam corretas e atualizadas.
        </p>
      </div>

      {/* Exibindo o campo "Nome da Empresa Avaliada" */}
      <div style={{
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <label className='label-etapas'>
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
        <label className='label-etapas'>
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleNext}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 'bold',
              backgroundColor: isLoading ? '#ccc' : '#4CAF50', // Desabilita a cor quando carregando
              transition: 'background-color 0.3s ease',
              position: 'relative', // Para alinhar o spinner
              display: 'flex',
              alignItems: 'center', // Centraliza verticalmente
              justifyContent: 'center', // Centraliza horizontalmente
              minWidth: '150px' // Garantir espaço suficiente para o texto e o spinner
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#45a049')}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#4CAF50')}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner" style={{
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                animation: 'spin 1s linear infinite',
                display: 'inline-block'
              }}></div>
            ) : (
              buttonText
            )}
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
              minWidth: '150px' // Garantir o mesmo tamanho que o outro botão
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
            disabled={isLoading}
          >
            NÃO SATISFEITO
          </button>
        </div>
      </div>
    </div>
  );
}

export default EtapaAtribuirNivelMaturidade;
