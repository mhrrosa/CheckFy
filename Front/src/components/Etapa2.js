import React, { useState, useEffect } from 'react';
import { getProjetosByAvaliacao, createProjeto, updateProjeto, addDocumento, updateDocumento } from '../services/Api';
import '../styles/Processos.css'; // Reutilizando o estilo de Processos.css

function Etapa2({ onNext, avaliacaoId }) {
  const [projetos, setProjetos] = useState([]);
  const [novoProjetoHabilitado, setNovoProjetoHabilitado] = useState(false);
  const [novoDocumentoNome, setNovoDocumentoNome] = useState('');
  const [novoDocumentoCaminho, setNovoDocumentoCaminho] = useState('');
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [editandoProjeto, setEditandoProjeto] = useState(false);

  useEffect(() => {
    if (avaliacaoId) {
      carregarProjetos();
    }
  }, [avaliacaoId]);

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const salvarProjeto = async () => {
    try {
      const projetoData = {
        avaliacaoId,
        habilitado: novoProjetoHabilitado
      };
      let response;
      if (editandoProjeto) {
        response = await updateProjeto(selectedProjetoId, projetoData);
      } else {
        response = await createProjeto(projetoData);
        const novoProjetoId = response.projetoId;
        if (novoDocumentoNome && novoDocumentoCaminho) {
          const documentoData = {
            id_projeto: novoProjetoId,
            caminho_arquivo: novoDocumentoCaminho,
            nome_arquivo: novoDocumentoNome
          };
          await addDocumento(documentoData);
        }
      }
      carregarProjetos();
      setNovoProjetoHabilitado(false);
      setEditandoProjeto(false);
      setSelectedProjetoId(null);
      setNovoDocumentoNome('');
      setNovoDocumentoCaminho('');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  const handleFileUpload = async (e, documentoId) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        const novoCaminho = result.filepath;
        if (documentoId) {
          const documento = projetos
            .find(proj => proj.ID === selectedProjetoId)
            ?.Documentos?.find(doc => doc.ID === documentoId);
          const novoNome = documento ? documento.Nome_Arquivo : null;
          atualizarDocumento(documentoId, novoNome, novoCaminho);
          setProjetos(prevProjetos => prevProjetos.map(proj => {
            if (proj.ID === selectedProjetoId) {
              return {
                ...proj,
                Documentos: proj.Documentos.map(doc => doc.ID === documentoId ? { ...doc, Caminho_Arquivo: novoCaminho } : doc)
              };
            }
            return proj;
          }));
        } else {
          setNovoDocumentoCaminho(novoCaminho);
        }
      } else {
        console.error('Erro ao fazer upload do arquivo:', result.message);
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const atualizarProjeto = async (projetoId, habilitado) => {
    try {
      const projetoData = { habilitado };
      await updateProjeto(projetoId, projetoData);
      setProjetos(prevProjetos => prevProjetos.map(proj => (proj.ID === projetoId ? { ...proj, Projeto_Habilitado: habilitado } : proj)));
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
    }
  };

  const atualizarDocumento = async (id, novoNome, novoCaminho) => {
    try {
      const documento = projetos
        .find(proj => proj.ID === selectedProjetoId)
        ?.Documentos?.find(doc => doc.ID === id);

      const atualizado = {
        nome_arquivo: novoNome || documento.Nome_Arquivo,
        caminho_arquivo: novoCaminho || documento.Caminho_Arquivo
      };
      await updateDocumento(id, atualizado);
      setProjetos(prevProjetos => prevProjetos.map(proj => {
        if (proj.ID === selectedProjetoId) {
          return {
            ...proj,
            Documentos: proj.Documentos.map(doc => doc.ID === id ? { ...doc, Nome_Arquivo: atualizado.nome_arquivo, Caminho_Arquivo: atualizado.caminho_arquivo } : doc)
          };
        }
        return proj;
      }));
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
    }
  };

  const handleViewFile = (filepath) => {
    window.open(`http://127.0.0.1:5000/uploads/${filepath}`, '_blank');
  };

  return (
    <div className="management-process-container">
      <div className="form-section">
        <h1 className='management-process-title'>GERENCIAMENTO DE PROJETOS</h1>
        <div className='lista-input'>
          <div className='input-wrapper'>
            <label className="label">Projeto Habilitado:</label>
            <input
              type="checkbox"
              checked={novoProjetoHabilitado}
              onChange={(e) => setNovoProjetoHabilitado(e.target.checked)}
            />
          </div>
          <div className='input-wrapper'>
            <label className="label">Nome do Arquivo:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Digite o nome do arquivo"
              value={novoDocumentoNome}
              onChange={(e) => setNovoDocumentoNome(e.target.value)}
            />
          </div>
          <div className='input-wrapper'>
            <label className="label">Upload de Arquivo:</label>
            <input
              className="input-field"
              type="file"
              onChange={(e) => handleFileUpload(e, null)}
            />
          </div>
        </div>
        <div className='logo-and-button'>
          <button className="button" onClick={salvarProjeto}>{editandoProjeto ? 'Atualizar Projeto' : 'Adicionar Projeto'}</button>
        </div>
        <p className="processos-cadastrados-title">PROJETOS CADASTRADOS:</p>
        {projetos.length > 0 ? (
          <table>
            <tbody>
              {projetos.map((projeto) => (
                <tr key={projeto.ID}>
                  <td className='nome-inserido-td'>
                    Projeto {projeto.Numero_Projeto} - 
                    <label>
                      Habilitado: 
                      <input
                        type="checkbox"
                        checked={projeto.Projeto_Habilitado}
                        onChange={(e) => atualizarProjeto(projeto.ID, e.target.checked)}
                      />
                    </label>
                    {projeto.Documentos && projeto.Documentos.length > 0 && (
                      <ul>
                        {projeto.Documentos.map((documento) => (
                          <li key={documento.ID}>
                            <div>
                              <input
                                type="text"
                                value={documento.Nome_Arquivo}
                                onChange={(e) => setProjetos(prevProjetos => prevProjetos.map(proj => {
                                  if (proj.ID === projeto.ID) {
                                    return {
                                      ...proj,
                                      Documentos: proj.Documentos.map(doc => doc.ID === documento.ID ? { ...doc, Nome_Arquivo: e.target.value } : doc)
                                    };
                                  }
                                  return proj;
                                }))}
                              />
                              <input
                                type="text"
                                value={documento.Caminho_Arquivo}
                                readOnly
                              />
                              <button className='button-acao' onClick={() => handleViewFile(documento.Caminho_Arquivo)}>Mostrar</button>
                              <button className='button-acao' onClick={() => document.getElementById(`fileInput_${documento.ID}`).click()}>Escolher outro arquivo</button>
                              <input
                                id={`fileInput_${documento.ID}`}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, documento.ID)}
                              />
                              <button className='button-acao' onClick={() => atualizarDocumento(documento.ID, documento.Nome_Arquivo, documento.Caminho_Arquivo)}>Alterar</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum projeto encontrado.</p>
        )}
      </div>
      <button onClick={onNext}>Próxima Etapa</button>
    </div>
  );
}

export default Etapa2;