import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api'; // Função para buscar a avaliação
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaConsultarRelatorioAjuste.css';
import CarregandoEtapa from './common/CarregandoEtapa';

function EtapaConsultarRelatorioAjuste({ onNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    descricao_relatorio_ajuste_inicial: '',
    caminho_arquivo_relatorio_ajuste_inicial: ''
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setCarregando(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleNext = () => {
    onNext(); // Navega para a próxima etapa ao clicar em próximo
  };

  if (carregando) {
    return (
      <div className='container-etapa'>
        <CarregandoEtapa />
      </div>
    );
  }

    return (
    <div className='container-etapa'>
      <h1 className='title-form'>CONSULTAR RELATÓRIO DE AJUSTE</h1>
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação:</strong>
        <p className='dica-texto'>
          Visualize os ajustes necessários para a avaliação final. Acesse os relatórios detalhados para realizar as correções e garantir que tudo esteja em conformidade, antes da data da avaliação final.
        </p>
      </div>
      <div className="lista-input">
        <table className='tabela-etapas'>
          <tbody>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Relatório de Ajuste:</th>
              <td className='valor-etapas'>
                {avaliacao.descricao_relatorio_ajuste_inicial}
              </td>
            </tr>
            {avaliacao.caminho_arquivo_relatorio_ajuste_inicial && (
              <tr className='linha-etapas'>
                <th className='label-etapas'>Arquivo de Relatório de Ajuste:</th>
                <td className='valor-etapas'>
                  <button
                    className='button-mostrar-relatorio'
                    onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
                  >
                    MOSTRAR
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <button
          className='button-next'
          onClick={handleNext}
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default EtapaConsultarRelatorioAjuste;