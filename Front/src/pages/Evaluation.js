import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const etapaUsuarioMap = { // Constante que define quais usuários podem ver quais etapas
  1: [1, 2, 3],
  2: [1, 3],
  3: [1, 3],
  4: [1, 2],
  5: [1, 2]
};

function Evaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType } = useContext(UserContext);
  const [idAtividade, setIdAtividade] = useState(null);
  const [avaliacaoId, setAvaliacaoId] = useState(null);
  const [idVersaoModelo, setIdVersaoModelo] = useState(null);
  const [selectedEtapa, setSelectedEtapa] = useState(null); // Estado separado para etapa selecionada

  useEffect(() => {
    if (location.state?.id) {
      fetchAvaliacaoData(location.state.id);
    }
  }, [location.state]);

  const fetchAvaliacaoData = async (id) => {
    try {
      const avaliacao = await getAvaliacaoById(id);
      setAvaliacaoId(avaliacao.id);
      setIdAtividade(avaliacao.id_atividade);
      setIdVersaoModelo(avaliacao.id_versao_modelo);
      setSelectedEtapa(avaliacao.id_atividade); // Define a etapa selecionada como a idAtividade inicial
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
    }
  };

  useEffect(() => {
    if (idAtividade !== null && selectedEtapa !== idAtividade) {
      setSelectedEtapa(idAtividade); // Sincroniza selectedEtapa com idAtividade
    }
  }, [idAtividade]);

  const handleNextStep = async () => {
    try {
      const newIdAtividade = idAtividade + 1;
      await updateIdAtividade(avaliacaoId, newIdAtividade);
      setIdAtividade(newIdAtividade);
      setSelectedEtapa(newIdAtividade); // Atualiza também a etapa selecionada
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
    }
  };

  const handleStepClick = (etapa) => {
    setSelectedEtapa(etapa); // Atualiza apenas a etapa selecionada, sem alterar idAtividade
  };

  const EtapaComponent = etapaComponents[selectedEtapa]; // Renderiza com base na etapa selecionada

  const hasPermission = selectedEtapa && etapaUsuarioMap[selectedEtapa]?.includes(userType);

  return (
    <div className="container">
      <div className="main-content-evaluation">
        <h1 className="evaluation-title">AVALIAÇÃO</h1>
        <div className="form-section-evaluation">
          {EtapaComponent ? (
            hasPermission ? (
              <EtapaComponent
                onNext={handleNextStep}
                avaliacaoId={avaliacaoId}
                idVersaoModelo={idVersaoModelo}
              />
            ) : (
              <p>
                {userType === 2
                  ? 'O usuário comum está realizando o trabalho nesta etapa.'
                  : 'O avaliador está realizando o trabalho nesta etapa.'}
              </p>
            )
          ) : (
            <p>Etapa não encontrada</p>
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