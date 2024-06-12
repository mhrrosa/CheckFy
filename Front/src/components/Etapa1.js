import React from 'react';

function Etapa1({ onNext }) {
  return (
    <div>
      <h2 className='management-project-title'>ETAPA</h2>
      <p className='conteudo-etapa'>Etapa em desenvolvimento...</p>
      <br />
      <p className='conteudo-etapa'>Siga @checkfy para novas atualizações</p>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default Etapa1;