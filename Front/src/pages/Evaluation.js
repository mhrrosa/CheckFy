import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Etapa1 from '../components/Etapa1';
import Etapa2 from '../components/Etapa2';
import Etapa3 from '../components/Etapa3';
import Etapa4 from '../components/Etapa4';
import Etapa5 from '../components/Etapa5'; // Adicione esta linha
import { getAvaliacaoById, updateIdAtividade } from '../services/Api';
import '../styles/Evaluation.css';

const etapaComponents = {
  1: Etapa1,
  2: Etapa2,
  3: Etapa3,
  4: Etapa4,
  5: Etapa5 // Adicione esta linha
};

function Evaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [idAtividade, setIdAtividade] = useState(null);
  const [avaliacaoId, setAvaliacaoId] = useState(null);

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
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
    }
  };

  const handleNextStep = async () => {
    try {
      const newIdAtividade = idAtividade + 1;
      await updateIdAtividade(avaliacaoId, newIdAtividade);
      setIdAtividade(newIdAtividade);
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
    }
  };

  const handleStepClick = (etapa) => {
    setIdAtividade(etapa);
  };

  const EtapaComponent = etapaComponents[idAtividade];

  return (
    <div className="evaluation-container">
      <div className="main-content-evaluation">
        <h1 className="evaluation-title">AVALIAÇÃO</h1>
        <div className="form-section-evaluation">
          {EtapaComponent ? <EtapaComponent onNext={handleNextStep} avaliacaoId={avaliacaoId} /> : <p>Etapa não encontrada</p>}
        </div>
      </div>
      <div className="sidebar">
        <h3>Etapas:</h3>
        {Object.keys(etapaComponents).map((etapa) => (
          <button
            key={etapa}
            onClick={() => handleStepClick(parseInt(etapa))}
            className={parseInt(etapa) === idAtividade ? "current-step" : ""}
            disabled={parseInt(etapa) > idAtividade}
          >
            Etapa {etapa}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Evaluation;