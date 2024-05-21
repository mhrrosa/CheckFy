import React from 'react';

function Etapa3({ onNext }) {
  return (
    <div>
      <h2>Etapa 3</h2>
      <p>Conteúdo da Etapa 3...</p>
      <button onClick={onNext}>Concluir Etapa 3</button>
    </div>
  );
}

export default Etapa3;