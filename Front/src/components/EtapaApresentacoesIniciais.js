import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaAuditoria({ onNext }) {
  const [apresentacoesRealizadas, setApresentacoesRealizadas] = useState(null);
  const [equipeTreinada, setEquipeTreinada] = useState(null);

  const handleNextStep = () => {
    if (apresentacoesRealizadas && equipeTreinada) {
      onNext();
    }
  };

  const handleCheckboxChangeApresentacoes = (value) => {
    setApresentacoesRealizadas(value);
  };

  const handleCheckboxChangeEquipe = (value) => {
    setEquipeTreinada(value);
  };

  const isNextButtonEnabled = apresentacoesRealizadas === true && equipeTreinada === true;

  return (
    <div className='container-etapa'>
      <h1 className='title-form' style={{ color: 'white' }}>Planejamento de Auditoria</h1>

      {/* Dica sobre o treinamento e apresentações */}
      <div className='dica-container'>
        <p className='dica-text' style={{ color: 'grey', marginBottom: '15px', fontSize: '13px' }}>
          <strong>Dica:</strong> Na etapa inicial, é necessário realizar o treinamento da equipe de 
          avaliação e as apresentações dos processos da unidade organizacional. O treinamento pode ser conduzido por 
          um avaliador adjunto, com a presença obrigatória do avaliador líder, e tem uma duração recomendada de cerca de 
          30 minutos. A apresentação dos processos da unidade organizacional, apoiada pelo implementador MPS, deve durar 
          entre 30 a 60 minutos e focar exclusivamente nos processos da unidade. Em certos casos, a critério do avaliador líder, o treinamento pode ser reduzido ou omitido se todos os representantes da 
          empresa já tiverem participado de avaliações MPS ou de cursos oficiais equivalentes.
        </p>
      </div>

      {/* Seção para "As apresentações iniciais foram realizadas?" */}
      <label className="label" style={{ color: 'white' }}>As apresentações iniciais foram realizadas?</label>
      <div className='checkbox-wrapper-project'>
        <div>
          <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={apresentacoesRealizadas === true}
              onChange={() => handleCheckboxChangeApresentacoes(true)}
            />
            Sim
          </label>
          <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={apresentacoesRealizadas === false}
              onChange={() => handleCheckboxChangeApresentacoes(false)}
            />
            Não
          </label>
        </div>
      </div>

      {/* Seção para "A equipe foi treinada?" */}
      <label className="label" style={{ color: 'white' }}>A equipe foi treinada?</label>
      <div className='checkbox-wrapper-project'>
        <div>
          <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={equipeTreinada === true}
              onChange={() => handleCheckboxChangeEquipe(true)}
            />
            Sim
          </label>
          <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={equipeTreinada === false}
              onChange={() => handleCheckboxChangeEquipe(false)}
            />
            Não
          </label>
        </div>
      </div>

      {/* Botão "Próxima Etapa" */}
      <button
        className={`button-next ${isNextButtonEnabled ? '' : 'button-disabled'}`}
        onClick={handleNextStep}
        disabled={!isNextButtonEnabled}
      >
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default EtapaAuditoria;
