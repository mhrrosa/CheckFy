import React from 'react';

const Stage = ({ elements, onComplete }) => {
  // Renderiza elementos baseados no tipo
  const renderElement = (type) => {
    switch (type) {
      case 1:
        return <input type="text" placeholder="Digite algo..." />;
      case 2:
        return <input type="checkbox" />;
      case 3:
        return <button>Clique-me</button>;
      case 4:
        return <textarea placeholder="Digite uma mensagem..."></textarea>;
      case 5:
        return <p>Texto informativo</p>;
      default:
        return <p>Elemento desconhecido</p>;
    }
  };

  return (
    <div>
      {elements.map((type, index) => (
        <div key={index}>
          {renderElement(type)}
        </div>
      ))}
      <button onClick={onComplete}>Concluir Etapa</button>
    </div>
  );
};

export default Stage;
