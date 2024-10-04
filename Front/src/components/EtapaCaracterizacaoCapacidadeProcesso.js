import React, { useState, useEffect } from 'react';
import {
  getProcessos,
  getPerguntasCapacidadeProjeto,
  getPerguntasCapacidadeOrganizacional,
  getProjetosByAvaliacao,
  getAvaliacaoById,
  getCapacidadeProcessoProjeto,
  addCapacidadeProcessoProjeto,
  updateCapacidadeProcessoProjeto,
  getCapacidadeProcessoOrganizacional,
  addCapacidadeProcessoOrganizacional,
  updateCapacidadeProcessoOrganizacional
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaCaracterizacaoCapacidadeProcesso.css';

function EtapaCaracterizacaoCapacidadeProcesso({ avaliacaoId, idVersaoModelo, onNext }) {
  const [projetos, setProjetos] = useState([]); // Projetos para a aba "Projeto"
  const [perguntasProjeto, setPerguntasProjeto] = useState([]); // Perguntas para a aba "Projeto"
  const [processosOrganizacionais, setProcessosOrganizacionais] = useState([]); // Processos para a aba "Organizacional"
  const [perguntasOrganizacional, setPerguntasOrganizacional] = useState([]); // Perguntas para a aba "Organizacional"
  const [activeParentTab, setActiveParentTab] = useState('Projeto');
  const [activeChildProjectTab, setActiveChildProjectTab] = useState(null); // Aba ativa na aba "Projeto"
  const [activeChildOrganizationalTab, setActiveChildOrganizationalTab] = useState(null); // Aba ativa na aba "Organizacional"
  const [respostasProjeto, setRespostasProjeto] = useState({}); // Respostas por projeto na aba "Projeto"
  const [respostasOrganizacional, setRespostasOrganizacional] = useState({}); // Respostas por processo na aba "Organizacional"
  const [idNivel, setIdNivel] = useState(null); // ID do nível

  const parentTabs = ['Projeto', 'Organizacional'];

  const options = [
    "Totalmente implementado (T)",
    "Largamente implementado (L)",
    "Parcialmente implementado (P)",
    "Não implementado (N)",
    "Não avaliado (NA)"
  ];

  const descricaoToAbbr = {
    "Gerência de Projetos": "GPR",
    "Engenharia de Requisitos": "REQ",
    "Projeto e Construção do Produto": "PCP",
    "Integração do Produto": "ITP",
    "Verificação e Validação": "VV",
    "Gerência de Configuração": "GCO",
    "Aquisição": "AQU",
    "Medição": "MED",
    "Gerência de Decisões": "GDE",
    "Gerência de Recursos Humanos": "GRH",
    "Gerência de Processos": "GPC",
    "Gerência Organizacional": "ORG"
  };

  const processCodes = ['GCO', 'AQU', 'MED', 'GDE', 'GRH', 'GPC', 'ORG'];

  useEffect(() => {
    if (avaliacaoId && idVersaoModelo) {
      carregarAvaliacao();
    }
  }, [avaliacaoId, idVersaoModelo]);

  useEffect(() => {
    if (idNivel) {
      carregarDados();
    }
  }, [idNivel]);

  useEffect(() => {
    if (activeParentTab === 'Projeto' && projetos.length > 0) {
      setActiveChildProjectTab(projetos[0].ID);
    }
  }, [activeParentTab, projetos]);

  useEffect(() => {
    if (activeParentTab === 'Organizacional' && processosOrganizacionais.length > 0) {
      setActiveChildOrganizationalTab(processosOrganizacionais[0].ID);
    }
  }, [activeParentTab, processosOrganizacionais]);

  const carregarAvaliacao = async () => {
    try {
      const data = await getAvaliacaoById(avaliacaoId);
      if (data && data.id_nivel_solicitado) {
        setIdNivel(data.id_nivel_solicitado);
      } else {
        console.error("id_nivel_solicitado não encontrado nos dados da avaliação.");
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
    }
  };

  const carregarDados = async () => {
    await carregarProjetos();
    await carregarProcessosOrganizacionais();
    await carregarPerguntasProjeto();
    await carregarPerguntasOrganizacional();

    await carregarRespostasProjeto(); // Carregar respostas do projeto
    await carregarRespostasOrganizacional(); // Carregar respostas organizacionais
  };

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);
  
      // Initialize respostasProjeto with default nota
      const initialRespostas = {};
      data.forEach(projeto => {
        initialRespostas[projeto.ID] = { nota: 'Não avaliado (NA)' };
      });
      setRespostasProjeto(initialRespostas);
  
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };
  const carregarProcessosOrganizacionais = async () => {
    try {
      const data = await getProcessos(idVersaoModelo);
      const filteredProcesses = data.filter(processo => {
        const abbr = descricaoToAbbr[processo.Descricao];
        return processCodes.includes(abbr);
      });
      setProcessosOrganizacionais(filteredProcesses);
  
      // Initialize respostasOrganizacional with default nota
      const initialRespostas = {};
      filteredProcesses.forEach(processo => {
        initialRespostas[processo.ID] = { nota: 'Não avaliado (NA)' };
      });
      setRespostasOrganizacional(initialRespostas);
  
    } catch (error) {
      console.error('Erro ao carregar processos organizacionais:', error);
    }
  };

  const carregarPerguntasProjeto = async () => {
    if (!idNivel) return;
    try {
      const data = await getPerguntasCapacidadeProjeto(idNivel);
      setPerguntasProjeto(data);
    } catch (error) {
      console.error('Erro ao carregar perguntas do projeto:', error);
    }
  };

  const carregarPerguntasOrganizacional = async () => {
    if (!idNivel) return;
    try {
      const data = await getPerguntasCapacidadeOrganizacional(idNivel);
      setPerguntasOrganizacional(data);
    } catch (error) {
      console.error('Erro ao carregar perguntas organizacionais:', error);
    }
  };

  const carregarRespostasProjeto = async () => {
    try {
      const data = (await getCapacidadeProcessoProjeto(avaliacaoId)) || [];
      setRespostasProjeto(prevState => {
        const novasRespostas = { ...prevState };
        data.forEach(item => {
          const projectId = item.ID_Projeto;
          const nota = item.Nota;
          novasRespostas[projectId] = { nota };
        });
        return novasRespostas;
      });
    } catch (error) {
      console.error('Erro ao carregar respostas do projeto:', error);
    }
  };
  
  const carregarRespostasOrganizacional = async () => {
    try {
      const data = (await getCapacidadeProcessoOrganizacional(avaliacaoId)) || [];
      setRespostasOrganizacional(prevState => {
        const novasRespostas = { ...prevState };
        data.forEach(item => {
          const processId = item.ID_Processo;
          const nota = item.Nota;
          novasRespostas[processId] = { nota };
        });
        return novasRespostas;
      });
    } catch (error) {
      console.error('Erro ao carregar respostas organizacionais:', error);
    }
  };

  const handleRespostaProjetoChange = (projectId, value) => {
    setRespostasProjeto(prevState => ({
      ...prevState,
      [projectId]: { nota: value }
    }));
  };

  const handleRespostaOrganizacionalChange = (processId, value) => {
    setRespostasOrganizacional(prevState => ({
      ...prevState,
      [processId]: { nota: value }
    }));
  };

  const renderProjectContent = () => {
    if (!projetos || projetos.length === 0) {
      return <p>Carregando projetos...</p>;
    }

    return (
      <>
        <div className="tabs">
          {projetos.map(projeto => (
            <button
              key={projeto.ID}
              className={`tab-button ${activeChildProjectTab === projeto.ID ? 'active' : ''}`}
              onClick={() => setActiveChildProjectTab(projeto.ID)}
            >
              {projeto.Nome_Projeto}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {projetos.map(projeto => (
            activeChildProjectTab === projeto.ID && (
              <div key={projeto.ID}>
                <h2 className='title-caracterizacao-capacidade-processo'>{projeto.Nome_Projeto}</h2>
                <table className='tabela-caracterizacao-capacidade-processo'>
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Evidências</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perguntasProjeto.map(pergunta => (
                      <tr key={pergunta.ID}>
                        <td>{pergunta.pergunta}</td>
                        <td></td>
                      </tr>
                    ))}
                    {/* Nota Final */}
                    <tr>
                      <td><strong className='label-etapas'>Nota Final</strong></td>
                      <td>
                        <select
                          className='select-grau-caracterizacao-capacidade-processo'
                          value={respostasProjeto[projeto.ID]?.nota || "Não avaliado (NA)"}
                          onChange={(e) => handleRespostaProjetoChange(projeto.ID, e.target.value)}
                        >
                          {options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          ))}
        </div>
      </>
    );
  };

  const renderOrganizationalContent = () => {
    if (!processosOrganizacionais || processosOrganizacionais.length === 0) {
      return <p>Carregando processos organizacionais...</p>;
    }

    return (
      <>
        <div className="tabs">
          {processosOrganizacionais.map(processo => (
            <button
              key={processo.ID}
              className={`tab-button ${activeChildOrganizationalTab === processo.ID ? 'active' : ''}`}
              onClick={() => setActiveChildOrganizationalTab(processo.ID)}
            >
              {descricaoToAbbr[processo.Descricao] || processo.Descricao}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {processosOrganizacionais.map(processo => (
            activeChildOrganizationalTab === processo.ID && (
              <div key={processo.ID}>
                <h2 className='title-caracterizacao-capacidade-processo'>{processo.Descricao}</h2>
                <table className='tabela-caracterizacao-capacidade-processo'>
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Evidências</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perguntasOrganizacional.map(pergunta => (
                      <tr key={pergunta.ID}>
                        <td>{pergunta.pergunta}</td>
                        <td></td>
                      </tr>
                    ))}
                    {/* Nota Final */}
                    <tr>
                      <th><strong className='label-etapas'>Nota Final</strong></th>
                      <td>
                        <select
                          className='select-grau-caracterizacao-capacidade-processo'
                          value={respostasOrganizacional[processo.ID]?.nota || "Não avaliado (NA)"}
                          onChange={(e) => handleRespostaOrganizacionalChange(processo.ID, e.target.value)}
                        >
                          {options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          ))}
        </div>
      </>
    );
  };

  const salvarRespostasProjeto = async () => {
    try {
      const dataToSend = Object.keys(respostasProjeto).map(projectId => ({
        id_avaliacao: avaliacaoId,
        id_projeto: projectId,
        nota: respostasProjeto[projectId].nota
      }));
  
      if (dataToSend.length === 0) {
        console.warn("Nenhuma resposta para salvar na aba Projeto.");
        return;
      }
  
      const existingData = await getCapacidadeProcessoProjeto(avaliacaoId);
      const existingProjectIds = existingData ? existingData.map(item => item.ID_Projeto) : [];
  
      const dataToUpdate = dataToSend.filter(item => existingProjectIds.includes(item.id_projeto));
      const dataToInsert = dataToSend.filter(item => !existingProjectIds.includes(item.id_projeto));
  
      if (dataToUpdate.length > 0) {
        await updateCapacidadeProcessoProjeto(dataToUpdate);
      }
  
      if (dataToInsert.length > 0) {
        await addCapacidadeProcessoProjeto(dataToInsert);
      }
  
      console.log("Respostas do projeto salvas com sucesso.");
    } catch (error) {
      console.error('Erro ao salvar respostas do projeto:', error);
    }
  };
  
  const salvarRespostasOrganizacional = async () => {
    try {
      const dataToSend = Object.keys(respostasOrganizacional).map(processId => ({
        id_avaliacao: avaliacaoId,
        id_processo: processId,
        nota: respostasOrganizacional[processId].nota
      }));
  
      if (dataToSend.length === 0) {
        console.warn("Nenhuma resposta para salvar na aba Organizacional.");
        return;
      }
  
      const existingData = await getCapacidadeProcessoOrganizacional(avaliacaoId);
      const existingProcessIds = existingData ? existingData.map(item => item.ID_Processo) : [];
  
      const dataToUpdate = dataToSend.filter(item => existingProcessIds.includes(item.id_processo));
      const dataToInsert = dataToSend.filter(item => !existingProcessIds.includes(item.id_processo));
  
      if (dataToUpdate.length > 0) {
        await updateCapacidadeProcessoOrganizacional(dataToUpdate);
      }
  
      if (dataToInsert.length > 0) {
        await addCapacidadeProcessoOrganizacional(dataToInsert);
      }
  
      console.log("Respostas organizacionais salvas com sucesso.");
    } catch (error) {
      console.error('Erro ao salvar respostas organizacionais:', error);
    }
  };

  const handleSave = () => {
    salvarRespostasProjeto();
    salvarRespostasOrganizacional();
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>CARACTERIZAÇÃO DA CAPACIDADE DO PROCESSO</h1>
      <div className="parent-tabs">
        {parentTabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeParentTab === tab ? 'active' : ''}`}
            onClick={() => setActiveParentTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="parent-tab-content">
        {activeParentTab === 'Projeto' ? renderProjectContent() : renderOrganizationalContent()}
      </div>
      <button className='button-save' onClick={handleSave}>SALVAR</button>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaCaracterizacaoCapacidadeProcesso;