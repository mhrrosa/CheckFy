import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById, enviarEmailResultadoAvaliacaoInicial } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaAuditoriaAvaliacaoInicial.css';
import BotaoCarregando from './common/BotaoCarregando';
import CarregandoEtapa from './common/CarregandoEtapa';
import { useToast } from '../contexts/ToastContext';

function EtapaAuditoriaInicial({ onNext, onDuploNext }) {
  const location = useLocation();
  const { showToast } = useToast();
  const [avaliacao, setAvaliacao] = useState({
    nome: '',
    descricao: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    id_avaliador_lider: '',
    id_atividade: '',
    id_versao_modelo: '',
    relatorio_ajuste: '',
    caminho_arquivo_relatorio_ajuste_inicial: ''
  });
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

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
    onNext();
  };

  const handleDuploNext = async () => {
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando o resultado da auditoria inicial. Deseja continuar?');

    if (confirmacao) {
      setEnviando(true);
      try {
        await enviarEmailResultadoAvaliacaoInicial(location.state.id);
        showToast('E-mail enviado com sucesso!', 'success');
        onDuploNext();
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        showToast('Houve um erro ao enviar o e-mail. Tente novamente.', 'error');
      } finally {
        setEnviando(false);
      }
    }
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
      <h1 className='title-form'>AUDITORIA DA AVALIAÇÃO INICIAL</h1>
      <div className="lista-input">
        <table className='tabela-etapas'>
          <tbody>
            {[{ label: "Nome da empresa", value: avaliacao.nome_empresa },
              { label: "Descrição", value: avaliacao.descricao },
              { label: "Nível Solicitado", value: avaliacao.nivel_solicitado },
              { label: "Nome do Avaliador Líder", value: avaliacao.nome_avaliador_lider },
              { label: "Cronograma", value: avaliacao.cronograma_planejamento },
              { label: "Atividades Planejadas", value: avaliacao.atividade_planejamento },
              { label: "Relatório de Ajuste", value: avaliacao.descricao_relatorio_ajuste_inicial }]
              .map((item, index) => (
                <tr key={index} className='linha-etapas'>
                  <th className='label-etapas'>
                    {item.label}:
                  </th>
                  <td className='valor-etapas'>
                    {item.value}
                  </td>
                </tr>
              ))}
            {avaliacao.caminho_arquivo_relatorio_ajuste_inicial && (
              <tr className='linha-etapas'>
                <th className='label-etapas'>
                  Arquivo de Relatório de Ajuste:
                </th>
                <td className='valor-etapas'>
                  <button className='button-mostrar-relatorio'
                    onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
                    disabled={enviando}
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
        <div className='div-botoes-aprovar-reprovar'>
          <BotaoCarregando
            onClick={handleDuploNext}
            className='button-aprovar-relatorio'
            loading={enviando}
            loadingText="Enviando e-mail..."
          >
            APROVAR
          </BotaoCarregando>
          <button
            onClick={handleNext}
            className='button-reprovar-relatorio'
            disabled={enviando}
          >
            REPROVAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default EtapaAuditoriaInicial;
