import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import EvaluationElement from '../components/EvaluationElement';
import '../styles/Evaluation.css'; // Importando o arquivo CSS

function Evaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [setup, setSetup] = useState([]);
  const [responses, setResponses] = useState({});
  const [allResponses, setAllResponses] = useState({});
  const [etapas, setEtapas] = useState([]);

  useEffect(() => {
    if (location.state?.setup) {
      setSetup(location.state.setup);
      setEtapas(prevEtapas => [...prevEtapas, location.state.setup]);
    }
  }, [location.state]);

  function handleInputChange(e, index) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setResponses({
      ...responses,
      [index]: value
    });
  }

  function handleSubmit() {
    const combinedResponses = { ...allResponses, ...responses };
    Api.submitEvaluationData(responses).then(response => {
      if (response.finalizada) {
        navigate('/results', { state: { finalResponses: combinedResponses } });
      } else {
        setAllResponses(combinedResponses);
        setSetup(response.setup);
        setResponses({});
        setEtapas(prevEtapas => [...prevEtapas, response.setup]);
      }
    });
  }

  function handleNextStep() {
    const currentIndex = etapas.indexOf(setup);
    const hasNextStep = currentIndex < etapas.length - 1;
    if (hasNextStep) {
      const nextSetup = etapas[currentIndex + 1];
      setSetup(nextSetup);
    } else {
      handleSubmit();
    }
  }

  return (
    <>
      <div className="sidebar">
        <h3>Etapas:</h3>
        {etapas.map((etapa, index) => (
          <button
            key={index}
            onClick={() => setSetup(etapa)}
            className={etapa === setup ? "current-step" : ""}
          >
            Etapa {index + 1}
          </button>
        ))}
      </div>
      <div className="evaluation-container">
        <div className="main-content">
          <h1 className="evaluation-title">Avaliação</h1>
          <div className="form-section">
            {setup.map((element, index) => (
              <EvaluationElement
                key={index}
                title={element.titulo}
                type={element.identificador}
                index={index}
                value={responses[index] || ''}
                onChange={handleInputChange}
              />
            ))}
            {etapas.length > 0 && (
              <button className="button" onClick={handleNextStep}>
                {etapas.indexOf(setup) < etapas.length - 1 ? "Próxima Etapa" : "Concluir Etapa"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Evaluation;