import React from 'react';

function Etapa1({ onNext }) {
  return (
    <div>
      <h2>Etapa 1</h2>
      <p>Conteúdo da Etapa 1...</p>
      <button onClick={onNext}>Concluir Etapa 1</button>
    </div>
  );
}

export default Etapa1;