import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '../services/Api';
import EvaluationElement from '../components/EvaluationElement';
import '../styles/Evaluation.css';

function Evaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [setup, setSetup] = useState([]);
  const [responses, setResponses] = useState({});
  const [allResponses, setAllResponses] = useState({}); // Para armazenar todas as respostas acumuladas

  useEffect(() => {
    if (location.state && location.state.setup) {
      setSetup(location.state.setup);
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
    const combinedResponses = { ...allResponses, ...responses }; // Combina respostas anteriores com as atuais
    Api.submitEvaluationData(responses).then(response => {
      if (response.finalizada) {
        navigate('/results', { state: { finalResponses: combinedResponses } });
      } else {
        setAllResponses(combinedResponses); // Atualiza allResponses com a combinação
        setSetup(response.setup);
        setResponses({}); // Limpa as respostas atuais para a próxima etapa
      }
    });
  }

  return (
    <div className="evaluation-container">
      <h1 className="evaluation-title">Avaliação</h1>
      <div className="form-section">
        {setup.map((type, index) => (
          <EvaluationElement
            key={index}
            type={type}
            index={index}
            value={responses[index] || ''}
            onChange={handleInputChange}
          />
        ))}
        <button className="button" onClick={handleSubmit}>Concluir Etapa</button>
      </div>
    </div>
  );
}

export default Evaluation;