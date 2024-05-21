import React from 'react';

function Etapa2({ onNext }) {
  return (
    <div>
      <h2>Etapa 2</h2>
      <p>Conteúdo da Etapa 2...</p>
      <button onClick={onNext}>Concluir Etapa 2</button>
    </div>
  );
}

export default Etapa2;