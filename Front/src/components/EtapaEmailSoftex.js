import React from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/EtapaEmailSoftex.css'

function EtapaEmailSoftex({ onNext, onSendEmail }) {
  return (
    <div className='container-etapa'>
      <h2 className='title-form'>ENVIAR EMAIL PARA A SOFTEX</h2>
      <p className='conteudo-etapa'>
        Ao clicar no botão abaixo, um e-mail será enviado para a Softex com os dados da avaliação.
      </p>
      <button className='button-next' onClick={onSendEmail}>ENVIAR EMAIL</button>
      <br />
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaEmailSoftex;
