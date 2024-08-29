import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import EtapaAtividadesPlanejamento from '../components/EtapaAtividadesPlanejamento';
import EtapaEmpresa from '../components/EtapaEmpresa';
import EtapaEmailSoftex from '../components/EtapaEmailSoftex';
import EtapaInstituicao from '../components/EtapaInstituicao';
import EtapaAcordoConfidencialidade from '../components/EtapaAcordoConfidencialidade';
import EtapaProjeto from '../components/EtapaProjeto';
import EtapaEvidencia from '../components/EtapaEvidencia';
import EtapaCaracterizacao from '../components/EtapaCaracterizacao';
import EtapaResumoCaracterizacao from '../components/EtapaResumoCaracterizacao';
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
  6: EtapaProjeto,
  7: EtapaEvidencia,
  8: EtapaCaracterizacao,
  9: EtapaResumoCaracterizacao
};

const etapaUsuarioMap = { 
  1: [1, 2],
  2: [1, 2],
  3: [1, 2],
  4: [1, 2],
  5: [1, 2],
  6: [1, 3],
  7: [1, 3],
  8: [1, 2],
  9: [1, 2]
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
    <div className="container">
      <div className="main-content-evaluation">
        <h1 className="evaluation-title">AVALIAÇÃO</h1>
        <div className="form-section-evaluation">
          {hasPermission ? (
            <EtapaComponent
              onNext={handleNextStep}
              avaliacaoId={avaliacaoId}
              idVersaoModelo={idVersaoModelo}
              idAtividade={idAtividade}
            />
          ) : (
            <p className='mensagem-usuario'>
              {userType === 2
                ? 'O colaborador é o responsável dessa atividade.'
                : 'O avaliador é o responsável dessa atividade.'}
            </p>
          )}
        </div>
      </div>
      <div className="sidebar">
        <h3>Etapas:</h3>
        {atividades.map((atividade) => {
          const etapaNumber = atividade.ID;
          const isDisabled = etapaNumber > idAtividade;
          return (
            <button
              key={atividade.ID}
              onClick={() => handleStepClick(etapaNumber)}
              className={`${etapaNumber === selectedEtapa ? 'current-step' : ''} ${isDisabled ? 'button-disabled' : ''}`}
              disabled={isDisabled}
            >
              {atividade.Descricao}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Evaluation;