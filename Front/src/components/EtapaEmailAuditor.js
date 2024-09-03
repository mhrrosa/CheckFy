import React, { useState, useEffect } from 'react';
import { addAuditor, getEmailAuditor } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function CadastroAuditor({ onNext, avaliacaoId }) {
  const [emailAuditor, setEmailAuditor] = useState('');
  const [existingAuditorEmail, setExistingAuditorEmail] = useState('');

  useEffect(() => {
    // Buscar email do auditor quando o componente for montado
    async function fetchEmailAvaliador() {
      try {
        const email = await getEmailAuditor(avaliacaoId);
        if (email) {
          setExistingAuditorEmail(email);
          setEmailAuditor(email);  // Preenche o campo com o email já existente
        }
      } catch (error) {
        console.error('Erro ao buscar email do auditor:', error);
      }
    }

    fetchEmailAvaliador();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!emailAuditor) {
      alert('Por favor, preencha o e-mail do auditor.');
      return;
    }

    try {
      const response = await addAuditor({
        idAvaliacao: avaliacaoId,
        auditorEmails: [emailAuditor],
      });

      if (response.ok) {
        alert('Auditor adicionado com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao adicionar auditor: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar auditor:', error);
      alert('Erro ao adicionar auditor.');
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>Cadastro do Auditor</h1>
      <p className='dica' style={{ color: 'white' }}>
        {existingAuditorEmail ? `Auditor já cadastrado: ${existingAuditorEmail}` : 'Insira o e-mail do auditor responsável pela avaliação.'}
      </p>

      <div className="input-wrapper">
        <label className="label">E-mail do Auditor:</label>
        <div className="input-group">
          <input
            type="email"
            className="input-field"
            value={emailAuditor}
            onChange={(e) => setEmailAuditor(e.target.value)}
            placeholder="Digite o e-mail do auditor"
          />
        </div>
      </div>

      <button className='button-next' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default CadastroAuditor;