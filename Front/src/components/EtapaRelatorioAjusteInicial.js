import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function CadastroAuditor({ onNext }) {
  const [relatorioAjuste, setRelatorioAjuste] = useState('');

  const salvarDados = () => {
    if (!relatorioAjuste) {
      alert('Por favor, preencha o relatório de ajuste.');
      return;
    }
    
    alert('Relatório de ajuste salvo com sucesso!');
  };

  const proximaEtapa = () => {
    if (!relatorioAjuste) {
      alert('Por favor, preencha o relatório de ajuste antes de continuar.');
      return;
    }

    if (window.confirm('Ao confirmar, será enviado um e-mail para o auditor realizar a auditoria. Deseja continuar?')) {
      // Aqui você pode adicionar a lógica para enviar o e-mail ou chamar uma função do backend.
      onNext();
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>Relatório de Ajuste</h1>
      <p className='dica-text' style={{ color: 'grey', marginBottom: '15px', fontSize: '13px' }}>
        <strong>Dica: </strong>
        O relatório detalha todos os pontos que precisam ser 
        ajustados antes da avaliação final. </p>
      
      <div className="input-wrapper">
        <label className="label">Relatório de Ajuste:</label>
        <textarea
          style={{ marginLeft: 10 , width: 500}}
          value={relatorioAjuste}
          onChange={(e) => setRelatorioAjuste(e.target.value)}
          placeholder="Descreva os ajustes necessários"
        />
      </div>
      
      <button className='button-next' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={proximaEtapa}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default CadastroAuditor;
