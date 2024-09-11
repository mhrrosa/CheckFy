import React from 'react';

const Sidebar = ({ calcularProgresso, atividades, idAtividade, handleStepClick, selectedEtapa }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Título Processos com a porcentagem ao lado */}
        <h3>Processos</h3>
      </div>
      {/* Barra de progresso */}
      <div>
        <span className="progresso-porcentagem">{calcularProgresso()}% Concluído</span>
      </div>
      <div className="barra-progresso">
        <div className="barra-preenchida" style={{ width: `${calcularProgresso()}%` }}></div>
      </div>
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
  );
};

export default Sidebar;