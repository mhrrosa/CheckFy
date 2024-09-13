import React, { useState, useEffect } from 'react';
import { addAuditor, getEmailAuditor, updateEmailAuditor } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function CadastroAuditor({ onNext, avaliacaoId }) {
  const [emailAuditor, setEmailAuditor] = useState(''); // Estado para controlar o valor do campo
  const [auditorExiste, setAuditorExiste] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  // Controle de múltiplas submissões

  useEffect(() => {
    async function fetchEmailAuditor() {
      setIsLoading(true);  // Ativa o estado de carregamento
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
        setIsLoading(false);  // Desativa o estado de carregamento
      }
    }

    fetchEmailAuditor();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!emailAuditor) {
      alert('Por favor, preencha o e-mail do auditor.');
      return;
    }

    if (isSaving) return;  // Impede múltiplas submissões enquanto está salvando

    setIsSaving(true);  // Bloqueia múltiplas submissões
    try {
      setIsLoading(true);  // Ativa o estado de carregamento ao salvar os dados
      
      if (auditorExiste) {
        // Atualiza o e-mail do auditor existente
        await updateEmailAuditor(avaliacaoId, { novo_email: emailAuditor });
        alert('E-mail do auditor atualizado com sucesso!');
      } else {
        // Adiciona um novo auditor
        await addAuditor({ auditorEmails: [emailAuditor], idAvaliacao: avaliacaoId });
        alert('Auditor inserido com sucesso!');
        setAuditorExiste(true);  // Marca que o auditor foi cadastrado
      }
    } catch (error) {
      console.error('Erro ao salvar o auditor:', error);
      alert('Erro ao salvar o auditor.');
    } finally {
      setIsSaving(false);  // Libera para novas submissões
      setIsLoading(false);  // Desativa o estado de carregamento após salvar os dados
    }
  };

  const proximaEtapa = async () => {
    if (!emailAuditor) {
      alert('Por favor, preencha o e-mail do auditor antes de continuar.');
      return;
    }

    onNext();  // Navega para a próxima etapa
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>Cadastro do Auditor</h1>
      <div style={{
            backgroundColor: '#e0e0e0', // Fundo mais escuro para maior contraste
            borderLeft: '4px solid #a0a0a0', // Borda levemente destacada
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
        }}>
            <strong style={{ color: '#555' }}>Dica:</strong> {/* Texto de dica mais escuro */}
            <p style={{ color: '#333', margin: '5px 0' }}>
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
          disabled={isLoading}  // Desabilitar o campo de input enquanto carrega
        />
      </div>

      <button className='button-next' onClick={salvarDados} disabled={isLoading || isSaving}>
        {isLoading ? 'SALVANDO...' : 'SALVAR'}
      </button>
      <button className='button-next' onClick={proximaEtapa} disabled={isLoading}>
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default CadastroAuditor;