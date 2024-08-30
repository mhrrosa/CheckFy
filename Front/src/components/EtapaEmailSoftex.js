import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import { enviarEmailAvaliacao } from '../services/Api';

function EtapaEmailSoftex({ onNext, avaliacaoId }) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await enviarEmailAvaliacao(avaliacaoId);
      setEmailSent(true);
      alert('E-mail enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-etapa'>
      <h2 className='title-form'>ENVIAR EMAIL PARA A SOFTEX</h2>
      <p className='conteudo-etapa'>
        Ao clicar no botão abaixo, um e-mail será enviado para a Softex com os dados da avaliação.
      </p>
      <button
        className='button-next'
        onClick={handleSendEmail}
        disabled={loading || emailSent} // O botão será desabilitado se estiver carregando ou se o e-mail já foi enviado
        style={{
          backgroundColor: emailSent ? 'gray' : '',
          cursor: emailSent ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enviando...' : emailSent ? 'Enviado' : 'ENVIAR EMAIL'}
      </button>
      <br />
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaEmailSoftex;