import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById, enviarEmailResultadoAvaliacaoInicial } from '../services/Api'; // Função para buscar a avaliação
import '../components/styles/Body.css';
import logo from '../img/logo_horizontal.png';

function EtapaAuditoriaInicial({ onNext, onDuploNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    nome: '',
    descricao: '',
    status: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    id_avaliador_lider: '',
    id_atividade: '',
    id_versao_modelo: '',
    relatorio_ajuste: '',
    caminho_arquivo_relatorio_ajuste_inicial: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Controle de carregamento

  useEffect(() => {
    const fetchAvaliacao = async () => {
      setIsLoading(true); // Ativa o estado de carregamento
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false); // Desativa o estado de carregamento
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleNext = () => {
    onNext(); // Navega para a próxima etapa ao clicar em aprovar ou reprovar
  };

  const handleDuploNext = async () => {
    // Alerta de confirmação
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando o resultado da auditoria inicial. Deseja continuar?');
  
    if (confirmacao) {
      try {
        // Chama a função para enviar o e-mail
        await enviarEmailResultadoAvaliacaoInicial(location.state.id);
        alert('E-mail enviado com sucesso!');
        
        // Chama a função para avançar duas etapas após o envio do e-mail
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
      }}>AUDITORIA DA AVALIAÇÃO INICIAL</h1>

      <div className="lista-input">
        {[
          { label: "Nome da empresa", value: avaliacao.nome_empresa },
          { label: "Descrição", value: avaliacao.descricao },
          { label: "Status", value: avaliacao.status },
          { label: "Nível Solicitado", value: avaliacao.nivel_solicitado },
          { label: "Nome do Avaliador Líder", value: avaliacao.nome_avaliador_lider },
          { label: "Cronograma", value: avaliacao.cronograma_planejamento },
          { label: "Atividades Planejadas", value: avaliacao.atividade_planejamento },
          { label: "Relatório de Ajuste", value: avaliacao.descricao_relatorio_ajuste_inicial },
        ].map((item, index) => (
          <div key={index} style={{
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>
              {item.label}:
            </label>
            <span style={{ color: '#333', width: '55%', textAlign: 'left' }}>
              {item.value}
            </span>
          </div>
        ))}

        {/* Adicionando o botão "Mostrar" caso o caminho do arquivo esteja disponível */}
        {avaliacao.caminho_arquivo_relatorio_ajuste_inicial && (
          <div style={{
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>
              Arquivo de Relatório de Ajuste:
            </label>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                color: '#fff',
                fontWeight: 'bold',
                backgroundColor: '#2196F3',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
              onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
              disabled={isLoading} // Desabilitar o botão enquanto carrega
            >
              MOSTRAR
            </button>
          </div>
        )}
      </div>

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
          disabled={isLoading} // Desabilitar o botão enquanto carrega
        >
          APROVAR
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
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
          disabled={isLoading} // Desabilitar o botão enquanto carrega
        >
          REPROVAR
        </button>
      </div>
    </div>
  );
}

export default EtapaAuditoriaInicial