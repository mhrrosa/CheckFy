import React, { useState, useEffect } from 'react';
import { addData, getData, updateData, enviarEmailDataAvaliacao } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Etapas.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/EtapaDataAvaliacaoFinal.css';
import '../components/styles/Button.css';
import BotaoCarregando from './common/BotaoCarregando';
import CarregandoEtapa from './common/CarregandoEtapa';
import { useToast } from '../contexts/ToastContext';

function CadastroDataAvaliacao({ onNext, avaliacaoId }) {
  const { showToast } = useToast();
  const [dataAvaliacaoFinal, setDataAvaliacaoFinal] = useState(''); // Estado para controlar a data de avaliação
  const [dataExiste, setDataExiste] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData(avaliacaoId);
        if (response && response.dataAvaliacaoFinal) {
          // Converte a data para o formato 'YYYY-MM-DD' aceito pelo input de data
          const dataFormatada = new Date(response.dataAvaliacaoFinal).toISOString().split('T')[0];
          setDataAvaliacaoFinal(dataFormatada);  // Atualiza o estado da data
          setDataExiste(true);  // Data já cadastrada
        } else {
          setDataExiste(false);  // Data não cadastrada
        }
      } catch (error) {
        console.error('Erro ao buscar a data da avaliação final:', error);
      } finally {
        setCarregando(false);
      }
    }

    fetchData();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!dataAvaliacaoFinal) {
      showToast('Por favor, selecione a data da avaliação final.', 'warning');
      return;
    }

    setSalvando(true);
    try {
      if (dataExiste) {
        // Atualiza a data da avaliação final existente
        await updateData(avaliacaoId, { dataAvaliacaoFinal });
        showToast('Data da avaliação final atualizada com sucesso!', 'success');
      } else {
        // Cadastra uma nova data de avaliação final
        await addData({ idAvaliacao: avaliacaoId, dataAvaliacaoFinal });
        showToast('Data da avaliação final cadastrada com sucesso!', 'success');
        setDataExiste(true);  // Marca que a data foi cadastrada
      }
    } catch (error) {
      console.error('Erro ao salvar a data da avaliação final:', error);
      showToast('Erro ao salvar a data da avaliação final.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const proximaEtapa = async () => {
    if (!dataAvaliacaoFinal) {
      showToast('Por favor, selecione a data da avaliação final antes de continuar.', 'warning');
      return;
    }

    // Alerta com opções de confirmação
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando a data da avaliação final. Deseja continuar?');

    if (confirmacao) {
      setEnviando(true);
      try {
        // Chama a função para enviar o e-mail
        await enviarEmailDataAvaliacao(avaliacaoId);
        showToast('E-mail enviado com sucesso!', 'success');

        // Navega para a próxima etapa após o envio do e-mail
        onNext();
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        showToast('Houve um erro ao enviar o e-mail. Tente novamente.', 'error');
      } finally {
        setEnviando(false);
      }
    }
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
      <h1 className='title-form'>DEFINIÇÃO DA DATA DE AVALIAÇÃO FINAL</h1>
      <div className='dica-div'>
        <strong className='div-titulo'>Observação: </strong>
        <p className='dica-texto'>
          A data da avaliação final deve ser confirmada para garantir a conformidade com o cronograma,
          participantes da avaliação serão notificados caso houver atualização da data.
        </p>
      </div>
      <br></br>
      <div className="input-container">
          <label
          className="label-etapas"
          >
          Data da Avaliação Final:
          </label>
          <input
            type="date"
            className="input-date"
            value={dataAvaliacaoFinal}
            onChange={(e) => setDataAvaliacaoFinal(e.target.value)}
            disabled={salvando || enviando}
          />
      </div>
      <br></br>
      <BotaoCarregando className='button-save' onClick={salvarDados} loading={salvando} disabled={enviando} loadingText="Salvando...">
          SALVAR
      </BotaoCarregando>
      <BotaoCarregando
        className='button-next'
        onClick={proximaEtapa}
        loading={enviando}
        disabled={salvando || !dataAvaliacaoFinal}
        loadingText="Enviando..."
      >
        PRÓXIMA ETAPA
      </BotaoCarregando>
    </div>
  );
}

export default CadastroDataAvaliacao;
