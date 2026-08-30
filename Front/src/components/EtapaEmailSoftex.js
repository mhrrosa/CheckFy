import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import { enviarEmailAvaliacao } from '../services/Api';
import BotaoCarregando from './common/BotaoCarregando';
import { useToast } from '../contexts/ToastContext';

function EtapaEmailSoftex({ onNext, avaliacaoId }) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { showToast } = useToast();

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await enviarEmailAvaliacao(avaliacaoId);
      setEmailSent(true);
      showToast('E-mail enviado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      showToast('Erro ao enviar e-mail. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>ENVIAR EMAIL PARA A SOFTEX</h1>
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação:</strong>
        <p className='dica-texto'>
          Ao clicar no botão abaixo, um e-mail será enviado para a Softex com os dados da avaliação.
        </p>
      </div>
      <BotaoCarregando
        className='button-next'
        onClick={handleSendEmail}
        loading={loading}
        disabled={emailSent}
        loadingText="Enviando..."
        style={{
          backgroundColor: emailSent ? '#28a745' : '',
          cursor: emailSent ? 'not-allowed' : 'pointer'
        }}
      >
        {emailSent ? 'Enviado' : 'ENVIAR EMAIL'}
      </BotaoCarregando>
      <br />
      <button className='button-next' onClick={onNext} disabled={loading}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaEmailSoftex;