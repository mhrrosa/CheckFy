import React, { useState, useEffect } from 'react';
import {
  getProcessos,
  getPerguntasCapacidadeProjeto,
  getPerguntasCapacidadeOrganizacional,
  getProjetosByAvaliacao,
  getAvaliacaoById
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaCaracterizacao.css';

function EtapaCaracterizacaoCapacidadeProcesso({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]); // Processos para a aba Organizacional
  const [perguntasProjeto, setPerguntasProjeto] = useState([]); // Perguntas para a aba Projeto
  const [perguntasOrganizacional, setPerguntasOrganizacional] = useState({}); // Perguntas para cada processo
  const [projetos, setProjetos] = useState([]);
  const [idNivel, setIdNivel] = useState(null); // ID do nível
  const [notasFinais, setNotasFinais] = useState({}); // Notas finais selecionadas
  const [activeParentTab, setActiveParentTab] = useState('Projeto');
  const [activeChildTab, setActiveChildTab] = useState(null); // Apenas para a aba Organizacional

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

  useEffect(() => {
    if (avaliacaoId && idVersaoModelo) {
      console.log("Carregando dados da avaliação...");
      carregarAvaliacao();
    }
  }, [avaliacaoId, idVersaoModelo]);

  useEffect(() => {
    if (idNivel) {
      console.log("Carregando dados necessários após obter o idNivel...");
      carregarDados();
    }
  }, [idNivel]);

  useEffect(() => {
    if (activeParentTab === 'Organizacional' && activeChildTab) {
      console.log("Carregando perguntas organizacionais para o processo com ID:", activeChildTab);
      carregarPerguntasOrganizacional(activeChildTab);
    }
  }, [activeParentTab, activeChildTab]);

  const carregarAvaliacao = async () => {
    try {
      console.log("Carregando dados da avaliação com ID:", avaliacaoId);
      const data = await getAvaliacaoById(avaliacaoId);
      console.log("Dados da avaliação carregados:", data);

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
    console.log("Dados recebidos - Avaliação ID:", avaliacaoId, "Versão Modelo ID:", idVersaoModelo, "Nível ID:", idNivel);
    await carregarProjetos();
    if (activeParentTab === 'Projeto') {
      await carregarPerguntasProjeto();
    } else if (activeParentTab === 'Organizacional') {
      await carregarProcessos();
    }
  };

  const carregarProjetos = async () => {
    try {
      console.log("Carregando projetos...");
      const data = await getProjetosByAvaliacao(avaliacaoId);
      console.log("Projetos carregados:", data);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const carregarProcessos = async () => {
    try {
      console.log("Carregando processos para a versão do modelo:", idVersaoModelo);
      const data = await getProcessos(idVersaoModelo);
      console.log("Processos carregados:", data);
      setProcessos(data); // Ajuste aqui
      if (data && data.length > 0) {
        setActiveChildTab(data[0].ID);
      }
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  const carregarPerguntasProjeto = async () => {
    if (!idNivel) {
      console.error("idNivel não está definido. Não é possível carregar as perguntas do projeto.");
      return;
    }
    try {
      console.log("Carregando perguntas para o projeto com nível ID:", idNivel);
      const data = await getPerguntasCapacidadeProjeto(idNivel);
      console.log("Perguntas de Projeto carregadas:", data);
      setPerguntasProjeto(data);
    } catch (error) {
      console.error('Erro ao carregar perguntas do projeto:', error);
    }
  };

  const carregarPerguntasOrganizacional = async (processoId) => {
    if (!idNivel) {
      console.error("idNivel não está definido. Não é possível carregar as perguntas organizacionais.");
      return;
    }
    try {
      console.log("Carregando perguntas organizacionais para o processo ID:", processoId, "e nível ID:", idNivel);
      const data = await getPerguntasCapacidadeOrganizacional(idNivel);
      console.log("Perguntas Organizacionais carregadas:", data);
      setPerguntasOrganizacional(prevState => ({
        ...prevState,
        [processoId]: data
      }));
    } catch (error) {
      console.error('Erro ao carregar perguntas organizacional:', error);
    }
  };

  const handleNotaFinalChange = (key, value) => {
    setNotasFinais(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const renderProjectContent = () => {
    console.log("Renderizando conteúdo da aba Projeto...");

    if (!Array.isArray(perguntasProjeto)) {
      console.error("perguntasProjeto não é um array:", perguntasProjeto);
      return <p>Nenhuma pergunta encontrada.</p>;
    }

    return (
      <div>
        <h2 className='title-processo-caracterizacao'>Perguntas de Projeto</h2>
        <table className='tabela-caracterizacao'>
          <thead>
            <tr>
              <th>Pergunta</th>
              {projetos.map(projeto => (
                <th key={projeto.ID}>{projeto.Nome_Projeto}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {perguntasProjeto.map(pergunta => (
              <tr key={pergunta.ID}>
                <td>{pergunta.pergunta}</td>
                {projetos.map(projeto => (
                  <td key={projeto.ID}></td>
                ))}
              </tr>
            ))}
            {/* Nota Final */}
            <tr>
              <td><strong>Nota Final</strong></td>
              {projetos.map(projeto => (
                <td key={projeto.ID}>
                  <select
                    className='select-grau'
                    value={notasFinais[projeto.ID] || "Não avaliado (NA)"}
                    onChange={(e) => handleNotaFinalChange(projeto.ID, e.target.value)}
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderOrganizationalContent = () => {
    console.log("Renderizando conteúdo da aba Organizacional...");
    console.log("Processos:", processos);
    console.log("Active Child Tab:", activeChildTab);

    if (!processos || processos.length === 0) {
      return <p>Carregando processos...</p>;
    }

    return (
      <>
        <div className="tabs">
          {processos.map((processo) => (
            <button
              key={processo.ID}
              className={`tab-button ${activeChildTab === processo.ID ? 'active' : ''}`}
              onClick={() => setActiveChildTab(processo.ID)}
            >
              {descricaoToAbbr[processo.Descricao] || processo.Descricao}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {processos.map(processo => (
            activeChildTab === processo.ID && (
              <div key={processo.ID}>
                <h2 className='title-processo-caracterizacao'>{processo.Descricao}</h2>
                <table className='tabela-caracterizacao'>
                  <thead>
                    <tr>
                      <th>Pergunta</th>
                      <th>Evidências</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(perguntasOrganizacional[processo.ID] || []).map(pergunta => (
                      <tr key={pergunta.ID}>
                        <td>{pergunta.pergunta}</td>
                        <td></td>
                      </tr>
                    ))}
                    {/* Nota Final */}
                    <tr>
                      <td><strong>Nota Final</strong></td>
                      <td>
                        <select
                          className='select-grau'
                          value={notasFinais[`organizational_${processo.ID}`] || "Não avaliado (NA)"}
                          onChange={(e) => handleNotaFinalChange(`organizational_${processo.ID}`, e.target.value)}
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

  const renderContent = () => {
    console.log("Renderizando conteúdo baseado na aba ativa:", activeParentTab);
    switch (activeParentTab) {
      case 'Projeto':
        return renderProjectContent();
      case 'Organizacional':
        return renderOrganizationalContent();
      default:
        return null;
    }
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>CAPACIDADE DO PROCESSO</h1>
      <div className="parent-tabs">
        {parentTabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeParentTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveParentTab(tab);
              if (tab === 'Projeto') {
                carregarPerguntasProjeto();
              } else if (tab === 'Organizacional') {
                carregarProcessos();
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="parent-tab-content">
        {renderContent()}
      </div>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaCaracterizacaoCapacidadeProcesso;