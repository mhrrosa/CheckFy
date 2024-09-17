import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api'; // Função para buscar a avaliação
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaConsultarRelatorioAjuste.css';
import logo from '../img/logo_horizontal.png';

function EtapaConsultarRelatorioAjuste({ onNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    descricao_relatorio_ajuste_inicial: '',
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
    onNext(); // Navega para a próxima etapa ao clicar em próximo
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>CONSULTAR RELATÓRIO DE AJUSTE</h1>
      <div className='dica-div'>
        <strong className='dica-titulo'>Dica:</strong>
        <p className='dica-texto'>
          Visualize os ajustes necessários para a avaliação final. Acesse os relatórios detalhados para realizar as correções e garantir que tudo esteja em conformidade, antes da data da avaliação final.
        </p>
      </div>
      <div className="lista-input">
        {/* Relatório de Ajuste */}
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>
            Relatório de Ajuste:
          </label>
          <span style={{ color: '#333', width: '55%', textAlign: 'left' }}>
            {avaliacao.descricao_relatorio_ajuste_inicial}
          </span>
        </div>

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
        <button
          onClick={handleNext}
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
          PRÓXIMO
        </button>
      </div>
    </div>
  );
}

export default EtapaConsultarRelatorioAjuste;