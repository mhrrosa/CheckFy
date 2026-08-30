import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAvaliacaoById,
  updateEmpresaAjusteAvaliacaoInicial,
  updateAvaliacaoAjusteInicial,
  atualizarRelatorioInicial
} from '../services/Api'; // Funções de atualização do backend
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaRealizarAjusteAvaliacaoInicial.css';
import BotaoCarregando from './common/BotaoCarregando';
import CarregandoEtapa from './common/CarregandoEtapa';
import { useToast } from '../contexts/ToastContext';

function EtapaRealizarAjusteAvaliacaoInicial({ onBack }) {
  const location = useLocation();
  const { showToast } = useToast();
  const [avaliacao, setAvaliacao] = useState({
    nome_empresa: '',
    descricao: '',
    status: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    nome_avaliador_lider: '',
    cronograma_planejamento: '',
    atividade_planejamento: '',
    descricao_relatorio_ajuste_inicial: '',
    caminho_arquivo_relatorio_ajuste_inicial: '' // Campo para armazenar o caminho do arquivo
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false); // Controle de múltiplas submissões
  const [file, setFile] = useState(null); // Estado para armazenar o arquivo selecionado

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setCarregando(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleFileUpload = async () => {
    if (!file) return null;  // Retorna null se não houver arquivo
  
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://127.0.0.1:5000/upload`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        return result.filepath; // Retorna o caminho do arquivo enviado
      } else {
        console.error('Erro ao fazer upload do arquivo:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      return null;
    }
  };

  const salvarEmpresa = async () => {
    setSalvando(true);
    try {
      await updateEmpresaAjusteAvaliacaoInicial(avaliacao.id_empresa, { nome: avaliacao.nome_empresa });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      showToast('Erro ao salvar empresa.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const salvarAvaliacao = async () => {
    setSalvando(true);
    try {
      await updateAvaliacaoAjusteInicial(location.state.id, {
        descricao: avaliacao.descricao,
        cronograma_planejamento: avaliacao.cronograma_planejamento,
        atividade_planejamento: avaliacao.atividade_planejamento
      });
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      showToast('Erro ao salvar avaliação.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const salvarRelatorio = async (caminhoArquivo) => {
    setSalvando(true);
    try {
      await atualizarRelatorioInicial({
        descricao: avaliacao.descricao_relatorio_ajuste_inicial,
        idAvaliacao: location.state.id,
        caminhoArquivo // Passa o caminho do arquivo, se houver
      });
      showToast('Dados salvos com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      showToast('Erro ao salvar relatório.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      
      await salvarEmpresa();
      await salvarAvaliacao();
      let caminhoArquivo = avaliacao.caminho_arquivo_relatorio_ajuste_inicial;
      
      if (file) {
        const uploadedFilePath = await handleFileUpload(); // Faz o upload do arquivo
        if (uploadedFilePath) {
          caminhoArquivo = uploadedFilePath; // Atualiza o caminho do arquivo se houver upload
          setAvaliacao({ ...avaliacao, caminho_arquivo_relatorio_ajuste_inicial: uploadedFilePath }); // Atualiza o estado da avaliação
        }
      }
      await salvarRelatorio(caminhoArquivo); // Salva o relatório com o caminho do arquivo atualizado
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    } finally {
      setSalvando(false);
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
      <h1 className='title-form'>AJUSTE DA AVALIAÇÃO INICIAL</h1>
      <div className="lista-input">
        <table className='tabela-etapas'>
          <tbody>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Nome da empresa:</th>
              <td className='valor-etapas'>
                <input
                  type="text"
                  className='input-field'
                  value={avaliacao.nome_empresa}
                  onChange={(e) => setAvaliacao({ ...avaliacao, nome_empresa: e.target.value })}
                />
              </td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Descrição:</th>
              <td className='valor-etapas'>
                <input
                  type="text"
                  className='input-field-etapas'
                  value={avaliacao.descricao}
                  onChange={(e) => setAvaliacao({ ...avaliacao, descricao: e.target.value })}
                  style={{ width: '100%' }}
                />
              </td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Relatório de Ajuste:</th>
              <td className='valor-etapas'>
                <textarea className='input-textarea-avaliacao-tabela'
                  value={avaliacao.descricao_relatorio_ajuste_inicial}
                  onChange={(e) => setAvaliacao({ ...avaliacao, descricao_relatorio_ajuste_inicial: e.target.value })}
                />
              </td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Anexar Arquivo:</th>
              <td className='valor-etapas'>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ width: '100%' }}
                />
              </td>
            </tr>
            {avaliacao.caminho_arquivo_relatorio_ajuste_inicial && (
              <tr className='linha-etapas'>
                <th className='label-etapas'>Arquivo de Relatório de Ajuste:</th>
                <td className='valor-etapas'>
                  <button
                    className='button-mostrar-relatorio'
                    onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
                  >
                    MOSTRAR
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      <BotaoCarregando onClick={handleSalvar} className='button-save' loading={salvando} loadingText="Salvando...">
        SALVAR
      </BotaoCarregando>
      <button onClick={onBack} className='button-next' disabled={salvando}>
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default EtapaRealizarAjusteAvaliacaoInicial;
