import React, { useState, useEffect } from 'react';
import { inserirRelatorioInicial, atualizarRelatorioInicial, getRelatorioInicial, enviarEmailRelatorioAjusteInicial } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaRelatorioAjusteInicial({ onNext, avaliacaoId }) {
  const [relatorioAjuste, setRelatorioAjuste] = useState('');
  const [relatorioExiste, setRelatorioExiste] = useState(false);

  useEffect(() => {
    async function fetchRelatorio() {
      try {
        const response = await getRelatorioInicial(avaliacaoId);
        if (response.descricao) {
          setRelatorioAjuste(response.descricao);
          setRelatorioExiste(true);  // Marca que o relatório já existe
        } else if (response.message === "Relatório não encontrado, ainda não foi criado") {
          console.log(response.message);
          setRelatorioExiste(false);  // Marca que o relatório não existe ainda
        }
      } catch (error) {
        console.error('Erro ao buscar o relatório:', error);
      }
    }

    fetchRelatorio();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!relatorioAjuste) {
      alert('Por favor, preencha o relatório de ajuste.');
      return;
    }

    try {
      if (relatorioExiste) {
        await atualizarRelatorioInicial({ descricao: relatorioAjuste, idAvaliacao: avaliacaoId });
        alert('Relatório atualizado com sucesso!');
      } else {
        await inserirRelatorioInicial({ descricao: relatorioAjuste, idAvaliacao: avaliacaoId });
        alert('Relatório inserido com sucesso!');
        setRelatorioExiste(true);  // Atualiza o estado para indicar que o relatório agora existe
      }
    } catch (error) {
      console.error('Erro ao salvar o relatório:', error);
    }
  };

  const proximaEtapa = async () => {
    if (!relatorioAjuste) {
      alert('Por favor, preencha o relatório de ajuste antes de continuar.');
      return;
    }

    if (window.confirm('Ao confirmar, será enviado um e-mail para o auditor realizar a auditoria. Deseja continuar?')) {
      try {
        // Chama a API para enviar o e-mail
        await enviarEmailRelatorioAjusteInicial(avaliacaoId);
        alert('E-mail enviado com sucesso!');
        onNext();  // Chama a próxima etapa após o envio do e-mail
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Ocorreu um erro ao enviar o e-mail.');
      }
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>Relatório de Ajuste</h1>
      <p className='dica-text' style={{ color: 'grey', marginBottom: '15px', fontSize: '13px' }}>
        <strong>Dica: </strong>
        O relatório detalha todos os pontos que precisam ser ajustados antes da avaliação final. 
      </p>
      
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

export default EtapaRelatorioAjusteInicial;