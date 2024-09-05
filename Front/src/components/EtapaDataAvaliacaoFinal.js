import React, { useState, useEffect } from 'react';
import { addData, getData, updateData } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function CadastroDataAvaliacao({ onNext, avaliacaoId }) {
  const [dataAvaliacaoFinal, setDataAvaliacaoFinal] = useState(''); // Estado para controlar a data de avaliação
  const [dataExiste, setDataExiste] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  // Controle de múltiplas submissões

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);  // Ativa o estado de carregamento
      try {
        const response = await getData(avaliacaoId);
        if (response) {
          setDataAvaliacaoFinal(response.dataAvaliacaoFinal || '');  // Atualiza o estado da data
          setDataExiste(true);  // Data já cadastrada
        } else {
          setDataExiste(false);  // Data não cadastrada
        }
      } catch (error) {
        console.error('Erro ao buscar a data da avaliação final:', error);
      } finally {
        setIsLoading(false);  // Desativa o estado de carregamento
      }
    }

    fetchData();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!dataAvaliacaoFinal) {
      alert('Por favor, selecione a data da avaliação final.');
      return;
    }

    if (isSaving) return;  // Impede múltiplas submissões enquanto está salvando

    setIsSaving(true);  // Bloqueia múltiplas submissões
    try {
      setIsLoading(true);  // Ativa o estado de carregamento ao salvar os dados

      if (dataExiste) {
        // Atualiza a data da avaliação final existente
        await updateData(avaliacaoId, { dataAvaliacaoFinal });
        alert('Data da avaliação final atualizada com sucesso!');
      } else {
        // Cadastra uma nova data de avaliação final
        await addData({ idAvaliacao: avaliacaoId, dataAvaliacaoFinal });
        alert('Data da avaliação final cadastrada com sucesso!');
        setDataExiste(true);  // Marca que a data foi cadastrada
      }
    } catch (error) {
      console.error('Erro ao salvar a data da avaliação final:', error);
      alert('Erro ao salvar a data da avaliação final.');
    } finally {
      setIsSaving(false);  // Libera para novas submissões
      setIsLoading(false);  // Desativa o estado de carregamento após salvar os dados
    }
  };

  const proximaEtapa = () => {
    if (!dataAvaliacaoFinal) {
      alert('Por favor, selecione a data da avaliação final antes de continuar.');
      return;
    }

    // Alerta com opções de confirmação
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando a data da avaliação final. Deseja continuar?');

    if (confirmacao) {
      onNext();  // Navega para a próxima etapa se confirmado
    }
  };

  return (
        <div className='container-etapa'>
        <h1 className='title-form'>Cadastro da Data de Avaliação Final</h1>
        <p className='dica-text' style={{ color: 'grey', marginBottom: '15px', fontSize: '13px' }}>
            <strong>Dica: </strong>
            A data da avaliação final deve ser confirmada para garantir a conformidade com o cronograma,
            participantes da avaliação serão notificados caso houver atualização da data.
        </p>
        <br></br>
        <div className="input-container">
            <label
            className="label"
            style={{
                marginRight: '10px',  // Espaçamento entre o label e o input
                fontWeight: 'bold'    // Estilo negrito para o texto do label
            }}
            >
            Data da Avaliação Final:
            </label>
            <input
            type="date"
            className="input-date"
            value={dataAvaliacaoFinal}
            onChange={(e) => setDataAvaliacaoFinal(e.target.value)}
            disabled={isLoading}
            style={{width: 200}}
            />
        </div>
        <br></br>
        <button className='button-next' onClick={salvarDados} disabled={isLoading || isSaving}>
            {isLoading ? 'SALVANDO...' : 'SALVAR'}
        </button>
        <button 
            className='button-next' 
            onClick={proximaEtapa} 
            disabled={isLoading || !dataAvaliacaoFinal}>
                PRÓXIMA ETAPA
            </button>
            </div>


  );
}

export default CadastroDataAvaliacao;
