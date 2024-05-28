import React, { useState, useEffect } from 'react';
import { getProjetosByAvaliacao, createProjeto, updateProjeto, addDocumento, updateDocumento, getResultadosEsperados, addIndicador, updateIndicador } from '../services/Api';
import '../styles/Processos.css';

function Etapa2({ onNext, avaliacaoId }) {
  const [projetos, setProjetos] = useState([]);
  const [novoProjetoHabilitado, setNovoProjetoHabilitado] = useState(false);
  const [novoDocumentoNome, setNovoDocumentoNome] = useState('');
  const [novoDocumentoCaminho, setNovoDocumentoCaminho] = useState('');
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [editandoProjeto, setEditandoProjeto] = useState(false);
  const [selectedResultadoEsperado, setSelectedResultadoEsperado] = useState('');
  const [resultadosEsperados, setResultadosEsperados] = useState([]);

  useEffect(() => {
    if (avaliacaoId) {
      carregarDadosIniciais();
    }
  }, [avaliacaoId]);

  const carregarDadosIniciais = async () => {
    try {
      await carregarProjetos();
      await carregarResultadosEsperados();
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
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

  const carregarResultadosEsperados = async () => {
    try {
      const data = await getResultadosEsperados();
      setResultadosEsperados(data);
    } catch (error) {
      console.error('Erro ao carregar resultados esperados:', error);
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
          const documentoResponse = await addDocumento(documentoData);
          const documentoId = documentoResponse.documentoId; // Aqui você pega o ID do documento retornado
          console.log('ID do Documento:', documentoId); // Log para verificar o ID do documento
          if (selectedResultadoEsperado) {
            const indicadorData = {
              id_resultado_esperado: selectedResultadoEsperado,
              id_documento: documentoId // Use o ID do documento criado
            };
            console.log('Indicador Data:', indicadorData); // Log para verificar os dados do indicador
            await addIndicador(indicadorData);
          }
        }
      }
      carregarProjetos();
      resetarFormulario();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  const resetarFormulario = () => {
    setNovoProjetoHabilitado(false);
    setEditandoProjeto(false);
    setSelectedProjetoId(null);
    setNovoDocumentoNome('');
    setNovoDocumentoCaminho('');
    setSelectedResultadoEsperado('');
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
          atualizarDocumento(documentoId, null, novoCaminho);
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
      const atualizado = {
        nome_arquivo: novoNome,
        caminho_arquivo: novoCaminho
      };
      await updateDocumento(id, atualizado);
      setProjetos(prevProjetos => prevProjetos.map(proj => {
        if (proj.ID === selectedProjetoId) {
          return {
            ...proj,
            Documentos: proj.Documentos.map(doc => doc.ID === id ? { ...doc, Nome_Arquivo: novoNome || doc.Nome_Arquivo, Caminho_Arquivo: novoCaminho || doc.Caminho_Arquivo } : doc)
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

  const atualizarIndicador = async (idIndicador, idResultadoEsperado, idDocumento) => {
    try {
      const indicadorData = {
        id_resultado_esperado: idResultadoEsperado,
        id_documento: idDocumento
      };
      console.log('Atualizando indicador com:', { idIndicador, ...indicadorData }); // Log para verificar os dados do indicador
      await updateIndicador(idIndicador, indicadorData);
    } catch (error) {
      console.error('Erro ao atualizar indicador:', error);
    }
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
          <div className='input-wrapper'>
            <label className="label">Selecionar Resultado Esperado:</label>
            <select
              className="select-field"
              value={selectedResultadoEsperado}
              onChange={(e) => setSelectedResultadoEsperado(e.target.value)}
            >
              <option value="">Selecione um resultado esperado</option>
              {resultadosEsperados.map((resultado) => (
                <option key={resultado[0]} value={resultado[0]}>{resultado[1]}</option>
              ))}
            </select>
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
                              <select
                                className="select-field"
                                value={documento.ID_Resultado_Esperado || ''}
                                onChange={(e) => {
                                  const novoResultadoEsperadoId = e.target.value;
                                  setProjetos(prevProjetos => prevProjetos.map(proj => {
                                    if (proj.ID === projeto.ID) {
                                      return {
                                        ...proj,
                                        Documentos: proj.Documentos.map(doc => doc.ID === documento.ID ? { ...doc, ID_Resultado_Esperado: novoResultadoEsperadoId } : doc)
                                      };
                                    }
                                    return proj;
                                  }));
                                }}
                              >
                                <option value="">Selecione um resultado esperado</option>
                                {resultadosEsperados.map((resultado) => (
                                  <option key={resultado[0]} value={resultado[0]}>{resultado[1]}</option>
                                ))}
                              </select>
                              <button className='button-acao' onClick={() => handleViewFile(documento.Caminho_Arquivo)}>Mostrar</button>
                              <button className='button-acao' onClick={() => document.getElementById(`fileInput_${documento.ID}`).click()}>Escolher outro arquivo</button>
                              <input
                                id={`fileInput_${documento.ID}`}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, documento.ID)}
                              />
                              <button className='button-acao' onClick={() => atualizarDocumento(documento.ID, documento.Nome_Arquivo, documento.Caminho_Arquivo)}>Alterar Documento</button>
                              <button className='button-acao' onClick={() => atualizarIndicador(documento.IndicadorID, documento.ID_Resultado_Esperado, documento.ID)}>Atualizar Indicador</button>
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