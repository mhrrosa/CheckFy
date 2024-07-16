import React from 'react';
import '../styles/Body.css';
import '../styles/Container.css';
import '../styles/Form.css';
import '../styles/Button.css';
import '../styles/Etapa1.css'

function Etapa1({ onNext }) {
  return (
    <div className='container-etapa'>
      <h2 className='title-form'>ETAPA</h2>
      <p className='conteudo-etapa'>Etapa em desenvolvimento...</p>
      <br />
      <p className='conteudo-etapa'>Siga @checkfy para novas atualizações</p>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default Etapa1;