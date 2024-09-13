import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import EtapaAtividadesPlanejamento from '../components/EtapaAtividadesPlanejamento';
import EtapaEmpresa from '../components/EtapaEmpresa';
import EtapaEmailSoftex from '../components/EtapaEmailSoftex';
import EtapaInstituicao from '../components/EtapaInstituicao';
import EtapaAcordoConfidencialidade from '../components/EtapaAcordoConfidencialidade';
import EtapaProjeto from '../components/EtapaProjeto';
import EtapaEvidencia from '../components/EtapaEvidencia';
import EtapaCaracterizacao from '../components/EtapaCaracterizacao';
import EtapaResumoCaracterizacao from '../components/EtapaResumoCaracterizacao';
import EtapaEmailAuditor from '../components/EtapaEmailAuditor';
import EtapaApresentacoesIniciais from '../components/EtapaApresentacoesIniciais';
import EtapaRelatorioAjusteInicial from '../components/EtapaRelatorioAjusteInicial';
import EtapaAuditoriaInicial from '../components/EtapaAuditoriaInicial';
import EtapaRealizarAjusteAvaliacaoInicial from '../components/EtapaRealizarAjusteAvaliacaoInicial';
import EtapaDataAvaliacaoFinal from  '../components/EtapaDataAvaliacaoFinal';
import EtapaEmailFeedbackSoftex from '../components/EtapaEmailFeedbackSoftex';
import EtapaAtaAbertura from '../components/EtapaAtaAbertura'
import EtapaConsultarRelatorioAjuste from '../components/EtapaConsultarRelatorioAjuste'
import { getAvaliacaoById, updateIdAtividade, getAtividade } from '../services/Api';
import { UserContext } from '../contexts/UserContext';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Button.css';
import '../pages/styles/Evaluation.css';

const etapaComponents = {
  1: EtapaEmpresa,
  2: EtapaInstituicao,
  3: EtapaEmailSoftex,
  4: EtapaAtividadesPlanejamento,
  5: EtapaAcordoConfidencialidade,
  6: EtapaEmailAuditor,
  7: EtapaProjeto,// esse
  8: EtapaEvidencia,// esse
  9: EtapaApresentacoesIniciais,//no
  10: EtapaRelatorioAjusteInicial,
  11: EtapaAuditoriaInicial,
  12: EtapaRealizarAjusteAvaliacaoInicial,
  13: EtapaDataAvaliacaoFinal,
  14: EtapaEmailFeedbackSoftex,
  15: EtapaConsultarRelatorioAjuste,
  16: EtapaAtaAbertura,
  17: EtapaCaracterizacao,
  18: EtapaResumoCaracterizacao
};

const etapaUsuarioMap = { 
  1: [1, 2],
  2: [1, 2],
  3: [1, 2],
  4: [1, 2],
  5: [1, 2],
  6: [1, 2],
  7: [1, 5],// esse
  8: [1, 2],// esse
  9: [1, 2],// no
  10: [1, 2],
  11: [1, 3],
  12: [1, 5],
  13: [1, 2],
  14: [1, 2],
  15: [1, 5],
  16: [1, 2],
  17: [1, 2],
  18: [1, 2]
  
};

function Evaluation() {
  const location = useLocation();
  const { userType } = useContext(UserContext);
  const [idAtividade, setIdAtividade] = useState(null);
  const [avaliacaoId, setAvaliacaoId] = useState(null);
  const [idVersaoModelo, setIdVersaoModelo] = useState(null);
  const [selectedEtapa, setSelectedEtapa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    const fetchAtividadesAndAvaliacao = async () => {
      try {
        // Primeiro, busca as atividades
        const atividadesResponse = await getAtividade();
        setAtividades(atividadesResponse);

        // Após buscar as atividades, busca a avaliação
        const avaliacaoId = location.state?.id;
        if (avaliacaoId) {
          const avaliacao = await getAvaliacaoById(avaliacaoId);
          setAvaliacaoId(avaliacao.id);
          setIdAtividade(avaliacao.id_atividade);
          setIdVersaoModelo(avaliacao.id_versao_modelo);
          setSelectedEtapa(avaliacao.id_atividade);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAtividadesAndAvaliacao();
  }, [location.state]);

  useEffect(() => {
    if (selectedEtapa !== null) {
      const validEtapa = etapaUsuarioMap[selectedEtapa];
      setHasPermission(validEtapa?.includes(Number(userType)) || false);
    }
  }, [selectedEtapa, userType]);

  const calcularProgresso = () => {
    const totalAtividades = atividades.length;
    const progresso = ((idAtividade - 1) / totalAtividades) * 100;
    return Math.round(progresso); // Arredondar para mostrar valor inteiro
  };

  const handleNextStep = async () => {
    if (selectedEtapa === idAtividade) {
      const newIdAtividade = idAtividade + 1;
      await updateIdAtividade(avaliacaoId, newIdAtividade);
      setIdAtividade(newIdAtividade);
      setSelectedEtapa(newIdAtividade);
    } else {
      setSelectedEtapa(selectedEtapa + 1);
    }
  };

  const handleDuploNextStep = async () => {
    if (selectedEtapa === idAtividade) {
      const newIdAtividade = idAtividade + 2; // Adiciona +2
      await updateIdAtividade(avaliacaoId, newIdAtividade);
      setIdAtividade(newIdAtividade);
      setSelectedEtapa(newIdAtividade);
    } else {
      setSelectedEtapa(selectedEtapa + 2); // Avança duas etapas
    }
  };

  const handleBackStep = async () => {
    if (selectedEtapa === idAtividade) {
      const newIdAtividade = idAtividade - 1 ;
      await updateIdAtividade(avaliacaoId, newIdAtividade);
      setIdAtividade(newIdAtividade);
      setSelectedEtapa(newIdAtividade);
    } else {
      setSelectedEtapa(selectedEtapa + 1); // Avança duas etapas
    }
  };


  const handleStepClick = (etapa) => {
    setSelectedEtapa(etapa);
  };

  if (isLoading) {
    return <p className='mensagem-usuario'>Carregando...</p>;
  }

  if (!selectedEtapa) {
    return <p className='mensagem-usuario'>Etapa não encontrada</p>;
  }

  const EtapaComponent = etapaComponents[selectedEtapa];

  return (
    <div className="container-avaliacao">
      <div className="main-content-evaluation">
        <h1 className="evaluation-title">AVALIAÇÃO</h1>
        <div className="form-section-evaluation">
          {hasPermission ? (
            <EtapaComponent
              onNext={handleNextStep}
              onDuploNext={handleDuploNextStep}
              onBack={handleBackStep}
              avaliacaoId={avaliacaoId}
              idVersaoModelo={idVersaoModelo}
              idAtividade={idAtividade}
            />
          ) : (
            <p className='mensagem-usuario'>
              {userType === 2
                ? 'Você não é o responsável por essa atividade.'
                : 'Você não é o responsável por essa atividade.'}
            </p>
          )}
        </div>
      </div>
      <Sidebar
        calcularProgresso={calcularProgresso}
        atividades={atividades}
        idAtividade={idAtividade}
        handleStepClick={handleStepClick}
        selectedEtapa={selectedEtapa}
      />
    </div>
  );
}

export default Evaluation;