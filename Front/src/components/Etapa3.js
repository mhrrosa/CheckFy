import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getDocumentosPorProjeto,
  addDocumento,
  updateDocumento,
  deleteDocumento,
  addEvidencia,
  getEvidenciasPorResultado,
  deleteEvidencia
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapa3.css';

Modal.setAppElement('#root');

function Etapa3({ avaliacaoId, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [selectedResultadoId, setSelectedResultadoId] = useState(null);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [novoDocumentoNome, setNovoDocumentoNome] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const data = await getResultadosEsperadosPorProcesso(processoId, avaliacaoId);
      setResultadosEsperados(prevResultados => ({
        ...prevResultados,
        [processoId]: data
      }));

      for (const resultado of data) {
        for (const projeto of projetos) {
          await carregarEvidencias(resultado.ID, projeto.ID);
        }
      }
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
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    }
  };

  const carregarEvidencias = async (resultadoId, projetoId) => {
    try {
      const data = await getEvidenciasPorResultado(resultadoId, projetoId);
      const evidenciasFormatadas = data.map(doc => ({
        id: doc[0],
        caminhoArquivo: doc[1],
        nomeArquivo: doc[2],
        idProjeto: doc[3]
      }));
      setEvidencias(prevEvidencias => ({
        ...prevEvidencias,
        [`${resultadoId}-${projetoId}`]: evidenciasFormatadas
      }));
    } catch (error) {
      console.error('Erro ao carregar evidencias:', error);
    }
  };

  const recarregarEvidencias = async () => {
    const newEvidencias = {};
    for (const processoId of Object.keys(resultadosEsperados)) {
      for (const resultado of resultadosEsperados[processoId]) {
        for (const projeto of projetos) {
          const data = await getEvidenciasPorResultado(resultado.ID, projeto.ID);
          const evidenciasFormatadas = data.map(doc => ({
            id: doc[0],
            caminhoArquivo: doc[1],
            nomeArquivo: doc[2],
            idProjeto: doc[3]
          }));
          newEvidencias[`${resultado.ID}-${projeto.ID}`] = evidenciasFormatadas;
        }
      }
    }
    setEvidencias(newEvidencias);
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
        const documentoResponse = await addDocumento(documentoData);
        const novoDocumento = {
          id: documentoResponse.documentoId,
          caminhoArquivo: result.filepath,
          nomeArquivo: novoDocumentoNome,
          idProjeto: selectedProjetoId
        };
        setDocumentos(prevDocumentos => [...prevDocumentos, novoDocumento]);
        setNovoDocumentoNome('');
        setFileToUpload(null);
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
      await carregarEvidencias(selectedResultadoId, selectedProjetoId);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
    }
  };

  const handleDeletarDocumento = async (documentoId) => {
    try {
      await deleteDocumento(documentoId);
      setDocumentos(prevDocumentos => prevDocumentos.filter(doc => doc.id !== documentoId));
      recarregarEvidencias(); // Recarregar todas as evidências após a exclusão
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
    }
  };

  const handleAdicionarEvidencia = async (documentoId) => {
    try {
      const evidenciaData = { id_resultado_esperado: selectedResultadoId, id_documento: documentoId };
      await addEvidencia(evidenciaData);
      const novaEvidencia = {
        id: documentoId,
        caminhoArquivo: documentos.find(doc => doc.id === documentoId).caminhoArquivo,
        nomeArquivo: documentos.find(doc => doc.id === documentoId).nomeArquivo,
        idProjeto: selectedProjetoId
      };
      setEvidencias(prevEvidencias => ({
        ...prevEvidencias,
        [`${selectedResultadoId}-${selectedProjetoId}`]: [...(prevEvidencias[`${selectedResultadoId}-${selectedProjetoId}`] || []), novaEvidencia]
      }));
    } catch (error) {
      console.error('Erro ao adicionar evidência:', error);
    }
  };

  const handleExcluirEvidencia = async (resultadoId, documentoId) => {
    try {
      await deleteEvidencia({ id_resultado_esperado: resultadoId, id_documento: documentoId });
      recarregarEvidencias(); // Recarregar todas as evidências após a exclusão
    } catch (error) {
      console.error('Erro ao excluir evidência:', error);
    }
  };

  const openModal = async (processoId, resultadoId, projetoId) => {
    setSelectedProcessoId(processoId);
    setSelectedResultadoId(resultadoId);
    setSelectedProjetoId(projetoId);
    await carregarDocumentos(projetoId);
    await carregarEvidencias(resultadoId, projetoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProcessoId(null);
    setSelectedResultadoId(null);
    setSelectedProjetoId(null);
    setDocumentos([]);
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>ADICIONAR EVIDÊNCIAS</h1>
      <div>
        {processos.map(processo => (
          <div key={processo.ID}>
            <h2 className='title-process'>Processo: {processo.Descricao}</h2>
            <button className='button-acao' onClick={() => carregarResultadosEsperados(processo.ID)}>Ver Resultados Esperados</button>
            {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => (
              <div key={resultado.ID}>
                <h3 className='title-result'>Resultado Esperado: {resultado.Descricao}</h3>
                {projetos.filter(proj => proj.ID_Avaliacao === avaliacaoId).map(projeto => (
                  <div key={projeto.ID}>
                    <h4 className='title-project'>Projeto: {projeto.Nome_Projeto}</h4>
                    <button className='button-acao' onClick={() => openModal(processo.ID, resultado.ID, projeto.ID)}>Gerenciar Documentos</button>
                    <div>
                      {evidencias[`${resultado.ID}-${projeto.ID}`] && evidencias[`${resultado.ID}-${projeto.ID}`]
                        .map(evidencia => (
                          <div key={evidencia.id}>
                            <p className='title-evidencia'>Evidencia: {evidencia.nomeArquivo}</p>
                            <button className='button-acao' onClick={() => window.open(`http://127.0.0.1:5000/uploads/${evidencia.caminhoArquivo}`, '_blank')}>Mostrar</button>
                            <button className='button-acao' onClick={() => handleExcluirEvidencia(resultado.ID, evidencia.id)}>Excluir</button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Gerenciar Documentos" className="modal" overlayClassName="modal-overlay">
        <div className="form-section-document">
          <div className='title-document'>
            <h2>GERENCIAR DOCUMENTOS</h2>
          </div>
          <div className='input-wrapper'>
            <label className="label">Nome do Novo Documento:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Digite uma descrição para o novo documento"
              value={novoDocumentoNome || ''}
              onChange={(e) => setNovoDocumentoNome(e.target.value)}
            />
          </div>
          <div className='input-wrapper-file-document'>
            <label className="label">Upload de Novo Arquivo:</label>
            <input
              className="input-field-file-document"
              type="file"
              id="file"
              onChange={(e) => setFileToUpload(e.target.files[0])}
            />
            <label for="file">Escolha um arquivo</label>
            {fileToUpload && <p className='arquivo-adicionado'>Arquivo adicionado</p>}
          </div>
          <div className='logo-and-button'>
            <button className="button" onClick={handleDocumentoUpload}>INSERIR</button>
            <button className="button" onClick={closeModal}>FECHAR</button>
          </div>
          <h3 className='title-document'>Documentos Existentes:</h3>
          <table>
            <tbody>
              {documentos.map(doc => (
                <tr className='input-botoes-documento-preenchido' key={doc.id}>
                  <td>
                    <input
                      className='input-field-documento-preenchido'
                      type="text"
                      value={doc.nomeArquivo}
                      onChange={(e) => setDocumentos(documentos.map(d => d.id === doc.id ? { ...d, nomeArquivo: e.target.value } : d))}
                    />
                  </td>
                  <td>
                    <button className='acoes-botao-document' onClick={() => window.open(`http://127.0.0.1:5000/uploads/${doc.caminhoArquivo}`, '_blank')}>MOSTRAR</button>
                  </td>
                  <td>
                    <button className='acoes-botao-document' onClick={() => handleAtualizarDocumento(doc.id, doc.nomeArquivo, doc.caminhoArquivo)}>ATUALIZAR</button>
                  </td>
                  <td>
                    <button className='acoes-botao-document' onClick={() => handleDeletarDocumento(doc.id)}>REMOVER</button>
                  </td>
                  <td>
                    <button className='acoes-botao-document' onClick={() => handleAdicionarEvidencia(doc.id)}>ADICIONAR EVIDÊNCIA</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default Etapa3;