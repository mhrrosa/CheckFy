import React, { useState, useEffect } from 'react';
import { addAuditor, getEmailAuditor, updateEmailAuditor } from '../services/Api';
import '../components/styles/Etapas.css';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import BotaoCarregando from './common/BotaoCarregando';
import CarregandoEtapa from './common/CarregandoEtapa';
import { useToast } from '../contexts/ToastContext';

function CadastroAuditor({ onNext, avaliacaoId }) {
  const { showToast } = useToast();
  const [emailAuditor, setEmailAuditor] = useState(''); // Estado para controlar o valor do campo
  const [auditorExiste, setAuditorExiste] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function fetchEmailAuditor() {
      try {
        const response = await getEmailAuditor(avaliacaoId);
        if (response) {
          setEmailAuditor(response);  // Atualiza o estado do e-mail
          setAuditorExiste(true);  // Auditor já cadastrado
        } else {
          setAuditorExiste(false);  // Auditor não cadastrado
        }
      } catch (error) {
        console.error('Erro ao buscar o e-mail do auditor:', error);
      } finally {
        setCarregando(false);
      }
    }

    fetchEmailAuditor();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!emailAuditor) {
      showToast('Por favor, preencha o e-mail do auditor.', 'warning');
      return;
    }

    setSalvando(true);
    try {
      if (auditorExiste) {
        // Atualiza o e-mail do auditor existente
        await updateEmailAuditor(avaliacaoId, { novo_email: emailAuditor });
        showToast('E-mail do auditor atualizado com sucesso!', 'success');
      } else {
        // Adiciona um novo auditor
        await addAuditor({ auditorEmails: [emailAuditor], idAvaliacao: avaliacaoId });
        showToast('Auditor inserido com sucesso!', 'success');
        setAuditorExiste(true);  // Marca que o auditor foi cadastrado
      }
    } catch (error) {
      console.error('Erro ao salvar o auditor:', error);
      showToast('Erro ao salvar o auditor.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const proximaEtapa = async () => {
    if (!emailAuditor) {
      showToast('Por favor, preencha o e-mail do auditor antes de continuar.', 'warning');
      return;
    }

    onNext();  // Navega para a próxima etapa
  };

  if (carregando) {
    return (
      <div className='container-etapa'>
        <CarregandoEtapa />
      </div>
    );
  }

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>CADASTRO DO AUDITOR</h1>
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação: </strong>
        <p className='dica-texto'>
          O auditor é responsável por garantir que todos os processos estejam em conformidade com os requisitos da avaliação.
        </p>
      </div>

      <div className="input-wrapper">
        <label className="label">E-mail do Auditor:</label>
        <input
          type="email"
          className='input-field'
          value={emailAuditor}
          onChange={(e) => setEmailAuditor(e.target.value)}
          placeholder="Digite o e-mail do auditor"
          disabled={salvando}
        />
      </div>

      <BotaoCarregando className='button-save' onClick={salvarDados} loading={salvando} loadingText="Salvando...">
        SALVAR
      </BotaoCarregando>
      <button className='button-next' onClick={proximaEtapa} disabled={salvando}>
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default CadastroAuditor;