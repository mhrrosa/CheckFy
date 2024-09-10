import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAvaliacaoById,
  updateEmpresaAjusteAvaliacaoInicial,
  updateAvaliacaoAjusteInicial,
  atualizarRelatorioInicial
} from '../services/Api'; // Funções de atualização do backend
import '../components/styles/Body.css';
import logo from '../img/logo_horizontal.png';

function EtapaRealizarAjusteAvaliacaoInicial({ onBack }) {
  const location = useLocation();
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
  const [isSaving, setIsSaving] = useState(false); // Controle de múltiplas submissões
  const [file, setFile] = useState(null); // Estado para armazenar o arquivo selecionado

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
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
    setIsSaving(true);
    try {
      await updateEmpresaAjusteAvaliacaoInicial(avaliacao.id_empresa, { nome: avaliacao.nome_empresa });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      alert('Erro ao salvar empresa.');
    } finally {
      setIsSaving(false);
    }
  };

  const salvarAvaliacao = async () => {
    setIsSaving(true);
    try {
      await updateAvaliacaoAjusteInicial(location.state.id, {
        descricao: avaliacao.descricao,
        cronograma_planejamento: avaliacao.cronograma_planejamento,
        atividade_planejamento: avaliacao.atividade_planejamento
      });
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert('Erro ao salvar avaliação.');
    } finally {
      setIsSaving(false);
    }
  };

  const salvarRelatorio = async (caminhoArquivo) => {
    setIsSaving(true);
    try {
      await atualizarRelatorioInicial({
        descricao: avaliacao.descricao_relatorio_ajuste_inicial,
        idAvaliacao: location.state.id,
        caminhoArquivo // Passa o caminho do arquivo, se houver
      });
      alert("Dados salvos com sucesso");
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      alert('Erro ao salvar relatório.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSalvar = async () => {
    setIsSaving(true);
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
      setIsSaving(false);
    }
  };
  

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: 'auto'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
      }}>EDIÇÃO DA AVALIAÇÃO</h1>

      <div className="lista-input">
        {/* Nome da Empresa */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Nome da empresa:</label>
          <input
            type="text"
            value={avaliacao.nome_empresa}
            onChange={(e) => setAvaliacao({ ...avaliacao, nome_empresa: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Descrição:</label>
          <input
            type="text"
            value={avaliacao.descricao}
            onChange={(e) => setAvaliacao({ ...avaliacao, descricao: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>

        {/* Relatório de Ajuste */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Relatório de Ajuste:</label>
          <textarea
            value={avaliacao.descricao_relatorio_ajuste_inicial}
            onChange={(e) => setAvaliacao({ ...avaliacao, descricao_relatorio_ajuste_inicial: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>

        {/* Upload de Arquivo */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Anexar Arquivo:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ width: '55%' }}
          />
        </div>

        {/* Botão para mostrar o arquivo se existir */}
        {avaliacao.caminho_arquivo_relatorio_ajuste_inicial && (
          <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Arquivo de Relatório de Ajuste:</label>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                color: '#fff',
                fontWeight: 'bold',
                backgroundColor: '#2196F3',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
              onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
            >
              MOSTRAR
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <img src={logo} alt="Logo Checkfy" style={{ height: '50px' }} />
        <button
          onClick={handleSalvar}
          className='button-next'
          disabled={isSaving} // Desabilitar o botão enquanto salva
        >
          SALVAR
        </button>
        <button
          onClick={onBack}
          className='button-next'
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default EtapaRealizarAjusteAvaliacaoInicial;