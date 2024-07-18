import React from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapa1.css'

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