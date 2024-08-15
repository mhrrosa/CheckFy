import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import EtapaAtividadesPlanejamento from '../components/EtapaAtividadesPlanejamento';
import EtapaEmpresa from '../components/EtapaEmpresa';
import EtapaInstituicao from '../components/EtapaInstituicao';
import Etapa1 from '../components/Etapa1';
import Etapa2 from '../components/Etapa2';
import Etapa3 from '../components/Etapa3';
import Etapa4 from '../components/Etapa4';
import Etapa5 from '../components/Etapa5';
import { getAvaliacaoById, updateIdAtividade } from '../services/Api';
import { UserContext } from '../contexts/UserContext';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Button.css';
import '../pages/styles/Evaluation.css';

const etapaComponents = {
  1: EtapaEmpresa,
  2: EtapaInstituicao,
  3: EtapaAtividadesPlanejamento,
  4: Etapa1,
  5: Etapa2,
  6: Etapa3,
  7: Etapa4,
  8: Etapa5
};

const etapaUsuarioMap = { 
  1: [1, 2],
  2: [1, 2],
  3: [1, 2],
  4: [1, 2],
  5: [1, 3],
  6: [1, 3],
  7: [1, 2],
  8: [1, 2]
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

  useEffect(() => {
    const avaliacaoId = location.state?.id;
    if (avaliacaoId) {
      fetchAvaliacaoData(avaliacaoId);
    }
  }, [location.state]);

  const fetchAvaliacaoData = async (id) => {
    try {
      const avaliacao = await getAvaliacaoById(id);
      setAvaliacaoId(avaliacao.id);
      setIdAtividade(avaliacao.id_atividade);
      setIdVersaoModelo(avaliacao.id_versao_modelo);
      setSelectedEtapa(avaliacao.id_atividade);
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEtapa !== null) {
      const validEtapa = etapaUsuarioMap[selectedEtapa];
      setHasPermission(validEtapa?.includes(Number(userType)) || false);
    }
  }, [selectedEtapa, userType]);

  const handleNextStep = async () => {
    // Verifica se está na última etapa disponível
    if (selectedEtapa === idAtividade) {
      const newIdAtividade = idAtividade + 1;
      await updateIdAtividade(avaliacaoId, newIdAtividade);
      setIdAtividade(newIdAtividade);
      setSelectedEtapa(newIdAtividade);
    } else {
      // Se estiver em uma etapa anterior, apenas avança para a próxima
      setSelectedEtapa(selectedEtapa + 1);
    }
  };

  const handleStepClick = (etapa) => {
    setSelectedEtapa(etapa);
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!selectedEtapa) {
    return <p>Etapa não encontrada</p>;
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
            />
          ) : (
            <p>
              {userType === 2
                ? 'O colaborador é o responsável dessa atividade.'
                : 'O avaliador é o responsável dessa atividade.'}
            </p>
          )}
        </div>
      </div>
      <div className="sidebar">
        <h3>Etapas:</h3>
        {Object.keys(etapaComponents).map((etapa) => {
          const etapaNumber = parseInt(etapa);
          const isDisabled = etapaNumber > idAtividade && idAtividade !== 5;
          return (
            <button
              key={etapa}
              onClick={() => handleStepClick(etapaNumber)}
              className={`${etapaNumber === selectedEtapa ? 'current-step' : ''} ${isDisabled ? 'button-disabled' : ''}`}
              disabled={isDisabled}
            >
              Etapa {etapa}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Evaluation;