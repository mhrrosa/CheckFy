import React from 'react';
import '../styles/Stage.css';

const Stage = ({ elements, onComplete }) => {
  // Renderiza elementos baseados no tipo
  const renderElement = (type) => {
    switch (type) {
      case 1:
        return <input type="text" className="input-text" placeholder="Digite algo..." />;
      case 2:
        return <input type="checkbox" className="input-checkbox" />;
      case 3:
        return <button className="button">Clique-me</button>;
      case 4:
        return <textarea className="input-textarea" placeholder="Digite uma mensagem..."></textarea>;
      case 5:
        return <p className="text-info">Texto informativo</p>;
      default:
        return <p className="text-info">Elemento desconhecido</p>;
    }
  };

  return (
    <div className="stage-container">
      {elements.map((type, index) => (
        <div key={index}>
          {renderElement(type)}
        </div>
      ))}
      <button className="stage-button" onClick={onComplete}>Concluir Etapa</button>
    </div>
  );
};

export default Stage;