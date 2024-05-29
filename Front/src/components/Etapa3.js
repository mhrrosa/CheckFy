import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getProcessosPorAvaliacao, getResultadosEsperadosPorProcesso, getProjetosByAvaliacao, getDocumentosPorProjeto, addDocumento, updateDocumento, deleteDocumento } from '../services/Api';
import '../styles/Processos.css';

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

function Etapa3({ avaliacaoId }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [selectedResultadoId, setSelectedResultadoId] = useState(null);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [novoDocumentoNome, setNovoDocumentoNome] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Adiciona o estado do modal

  useEffect(() => {
    if (avaliacaoId) {
      carregarDados();
    }
  }, [avaliacaoId]);

  const carregarDados = async () => {
    await carregarProcessos();
    await carregarProjetos();
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId);
      setProcessos(data.processos);
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const carregarResultadosEsperados = async (processoId) => {
    try {
      const data = await getResultadosEsperadosPorProcesso(processoId);
      setResultadosEsperados(data);
    } catch (error) {
      console.error('Erro ao carregar resultados esperados:', error);
    }
  };

  const carregarDocumentos = async (projetoId) => {
    try {
      const data = await getDocumentosPorProjeto(projetoId);
      const documentosFormatados = data.map(doc => ({
        id: doc[0],
        caminhoArquivo: doc[1],
        nomeArquivo: doc[2],
        idProjeto: doc[3]
      }));
      setDocumentos(documentosFormatados);
      console.log('Documentos carregados:', documentosFormatados);  // Adicionando console.log
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    }
  };

  const handleDocumentoUpload = async () => {
    if (!fileToUpload) {
      console.error('Nenhum arquivo selecionado');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        const documentoData = { caminho_arquivo: result.filepath, nome_arquivo: novoDocumentoNome, id_projeto: selectedProjetoId };
        await addDocumento(documentoData);
        carregarResultadosEsperados(selectedProcessoId);
        carregarDocumentos(selectedProjetoId);  // Recarregar documentos após adicionar
        closeModal();
      } else {
        console.error('Erro ao fazer upload do arquivo:', result.message);
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const handleAtualizarDocumento = async (id, nomeArquivo, caminhoArquivo) => {
    const documentoData = { caminho_arquivo: caminhoArquivo, nome_arquivo: nomeArquivo, id_projeto: selectedProjetoId };
    try {
      await updateDocumento(id, documentoData);
      carregarResultadosEsperados(selectedProcessoId);
      carregarDocumentos(selectedProjetoId);  // Recarregar documentos após atualizar
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
    }
  };

  const handleDeletarDocumento = async (documentoId) => {
    try {
      await deleteDocumento(documentoId);
      carregarResultadosEsperados(selectedProcessoId);
      carregarDocumentos(selectedProjetoId);  // Recarregar documentos após deletar
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
    }
  };

  const openModal = async (processoId, resultadoId, projetoId) => {
    setSelectedProcessoId(processoId);
    setSelectedResultadoId(resultadoId);
    setSelectedProjetoId(projetoId);
    await carregarDocumentos(projetoId);  // Carregar documentos ao abrir a modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProcessoId(null);
    setSelectedResultadoId(null);
    setSelectedProjetoId(null);
    setNovoDocumentoNome('');
    setFileToUpload(null);
    setDocumentos([]);  // Limpar documentos ao fechar a modal
  };

  return (
    <div className="management-process-container">
      <h1 className='management-process-title'>PROCESSOS, RESULTADOS ESPERADOS E PROJETOS</h1>
      <div>
        {processos.map(processo => (
          <div key={processo.ID}>
            <h2>Processo: {processo.Descricao}</h2>
            <button onClick={() => carregarResultadosEsperados(processo.ID)}>Ver Resultados Esperados</button>
            {resultadosEsperados.filter(re => re.ID_Processo === processo.ID).map(resultado => (
              <div key={resultado.ID}>
                <h3>Resultado Esperado: {resultado.Descricao}</h3>
                {projetos.filter(proj => proj.ID_Avaliacao === avaliacaoId).map(projeto => (
                  <div key={projeto.ID}>
                    <h4>Projeto: {projeto.Nome_Projeto}</h4>
                    <button onClick={() => openModal(processo.ID, resultado.ID, projeto.ID)}>Gerenciar Documentos</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Gerenciar Documentos" className="modal" overlayClassName="modal-overlay">
        <div className="form-section">
          <h2>Gerenciar Documentos</h2>
          <div className='input-wrapper'>
            <label className="label">Nome do Novo Documento:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Digite o nome do novo documento"
              value={novoDocumentoNome || ''}
              onChange={(e) => setNovoDocumentoNome(e.target.value)}
            />
          </div>
          <div className='input-wrapper'>
            <label className="label">Upload de Novo Arquivo:</label>
            <input
              className="input-field"
              type="file"
              onChange={(e) => setFileToUpload(e.target.files[0])}
            />
          </div>
          <div className='logo-and-button'>
            <button className="button" onClick={handleDocumentoUpload}>Inserir Novo Documento</button>
            <button className="button" onClick={closeModal}>Cancelar</button>
          </div>
          <h3>Documentos Existentes:</h3>
          <table>
            <tbody>
              {documentos.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <input
                      className='input-field'
                      type="text"
                      value={doc.nomeArquivo}
                      onChange={(e) => setDocumentos(documentos.map(d => d.id === doc.id ? { ...d, nomeArquivo: e.target.value } : d))}
                    />
                  </td>
                  <td>
                    <button onClick={() => window.open(`http://127.0.0.1:5000/uploads/${doc.caminhoArquivo}`, '_blank')}>Mostrar</button>
                  </td>
                  <td>
                    <button onClick={() => handleAtualizarDocumento(doc.id, doc.nomeArquivo, doc.caminhoArquivo)}>Atualizar</button>
                  </td>
                  <td>
                    <button onClick={() => handleDeletarDocumento(doc.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

export default Etapa3;