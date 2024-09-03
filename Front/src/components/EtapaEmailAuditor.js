import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function CadastroAuditor({ onNext }) {
  const [emailAuditor, setEmailAuditor] = useState('');

  const salvarDados = () => {
    if (!emailAuditor) {
      alert('Por favor, preencha o e-mail do auditor.');
      return;
    }
    
    alert(`E-mail do auditor (${emailAuditor}) salvo com sucesso!`);
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>Cadastro do Auditor</h1>
      <p className='dica'style={{ color: 'white'}}>Insira o e-mail do auditor responsável pela avaliação.</p>
      
      <div className="input-wrapper">
        <label className="label">E-mail do Auditor:</label>
        <input
          type="email"
          className="input-field"
          value={emailAuditor}
          onChange={(e) => setEmailAuditor(e.target.value)}
          placeholder="Digite o e-mail do auditor"
        />
      </div>
      
      <button className='button-next' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default CadastroAuditor;
