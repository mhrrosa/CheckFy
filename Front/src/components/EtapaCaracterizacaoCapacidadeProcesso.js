import React, { useState, useEffect } from 'react';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getGrausImplementacao,
  addOrUpdateGrauImplementacao
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaCaracterizacao.css';

function EtapaCaracterizacaoCapacidadeProcesso({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [notasFinais, setNotasFinais] = useState({});
  const [activeParentTab, setActiveParentTab] = useState('Projeto');
  const [activeChildTab, setActiveChildTab] = useState(null);

  const parentTabs = ['Projeto', 'Organizacional'];
  const options = [
    "Totalmente implementado (T)",
    "Largamente implementado (L)",
    "Parcialmente implementado (P)",
    "Não implementado (N)",
    "Não avaliado (NA)",
    "Fora do escopo (F)"
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

  const organizationalProcessNames = [
    "Aquisição",
    "Gerência de Configuração",
    "Medição",
    "Gerência de Decisões",
    "Gerência de Recursos Humanos",
    "Gerência de Processos",
    "Gerência Organizacional"
  ];

  useEffect(() => {
    if (avaliacaoId && idVersaoModelo) {
      carregarDados();
    }
  }, [avaliacaoId, idVersaoModelo]);

  useEffect(() => {
    if (activeChildTab) {
      carregarResultadosEsperados(activeChildTab);
    }
  }, [activeChildTab]);

  useEffect(() => {
    const childProcessos = getChildProcessos();
    if (childProcessos.length > 0) {
      setActiveChildTab(childProcessos[0].ID);
      carregarResultadosEsperados(childProcessos[0].ID);
    }
  }, [activeParentTab, processos]);

  const carregarDados = async () => {
    await carregarProjetos();
    await carregarProcessos();
    await carregarNotasFinais();
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(data.processos);
      if (data.processos.length > 0) {
        setActiveChildTab(data.processos[0].ID);
      }
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
    } catch (error) {
      console.error('Erro ao carregar resultados esperados:', error);
    }
  };

  const carregarNotasFinais = async () => {
    try {
      const data = await getGrausImplementacao(avaliacaoId);
      const notas = {};
      data.forEach(grau => {
        if (grau.ID_Resultado_Esperado === null) {
          if (grau.ID_Projeto !== null) {
            // Nota final para o projeto
            notas[`${grau.ID_Projeto}`] = grau.Nota;
          } else if (grau.ID_Processo !== null) {
            // Nota final para o processo organizacional
            notas[`organizational_${grau.ID_Processo}`] = grau.Nota;
          }
        }
      });
      setNotasFinais(notas);
    } catch (error) {
      console.error('Erro ao carregar notas finais:', error);
    }
  };

  const handleNotaFinalChange = (key, nota) => {
    setNotasFinais(prevNotasFinais => ({
      ...prevNotasFinais,
      [key]: nota
    }));
  };

  const salvarNotasFinais = async () => {
    try {
      const finalEntries = Object.entries(notasFinais);
      for (const [key, nota] of finalEntries) {
        // Only process keys that are project IDs (numbers)
        if (!key.startsWith('organizational_')) {
          await addOrUpdateGrauImplementacao({
            nota,
            resultadoId: null, // Indica que é a nota final para o projeto
            projetoId: parseInt(key)
          });
        }
      }
      alert('Notas finais salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar notas finais:', error);
      alert('Erro ao salvar notas finais.');
    }
  };

  const salvarNotasFinaisOrganizacional = async () => {
    try {
      const finalEntries = Object.entries(notasFinais);
      for (const [key, nota] of finalEntries) {
        // Only process keys that start with 'organizational_'
        if (key.startsWith('organizational_')) {
          const processoId = key.split('_')[1]; // Get the processo ID
          await addOrUpdateGrauImplementacao({
            nota,
            resultadoId: null, // Indica que é a nota final para o processo organizacional
            processoId: parseInt(processoId)
          });
        }
      }
      alert('Notas finais salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar notas finais organizacional:', error);
      alert('Erro ao salvar notas finais.');
    }
  };

  const getChildProcessos = () => {
    if (activeParentTab === 'Projeto') {
      return processos.filter(processo => !organizationalProcessNames.includes(processo.Descricao));
    } else if (activeParentTab === 'Organizacional') {
      return processos.filter(processo => organizationalProcessNames.includes(processo.Descricao));
    }
    return [];
  };

  const renderProcessosContent = () => {
    const childProcessos = getChildProcessos();

    return (
      <>
        <div className="tabs">
          {childProcessos.map((processo) => (
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
          {childProcessos.map(processo => (
            activeChildTab === processo.ID && (
              <div key={processo.ID}>
                <h2 className='title-processo-caracterizacao'>{processo.Descricao}</h2>
                <table className='tabela-caracterizacao'>
                  <thead>
                    <tr>
                      <th>Resultado Esperado</th>
                      {projetos.map(projeto => (
                        <th key={projeto.ID}>{projeto.Nome_Projeto}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => (
                      <tr key={resultado.ID}>
                        <td>{resultado.Descricao}</td>
                        {projetos.map(projeto => (
                          <td key={projeto.ID}></td> // Células vazias
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
                            value={notasFinais[`${projeto.ID}`] || "Não avaliado (NA)"}
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
            )
          ))}
        </div>
        <button className='button-save' onClick={salvarNotasFinais}>SALVAR NOTAS FINAIS</button>
      </>
    );
  };

  const renderOrganizationalContent = () => {
    const childProcessos = getChildProcessos();

    return (
      <>
        <div className="tabs">
          {childProcessos.map((processo) => (
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
          {childProcessos.map(processo => (
            activeChildTab === processo.ID && (
              <div key={processo.ID}>
                <h2 className='title-processo-caracterizacao'>{processo.Descricao}</h2>
                <table className='tabela-caracterizacao'>
                  <thead>
                    <tr>
                      <th>Resultado Esperado</th>
                      <th>Evidências</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => (
                      <tr key={resultado.ID}>
                        <td>{resultado.Descricao}</td>
                        <td></td> {/* Células vazias */}
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
        <button className='button-save' onClick={salvarNotasFinaisOrganizacional}>SALVAR NOTAS FINAIS</button>
      </>
    );
  };

  const renderContent = () => {
    switch (activeParentTab) {
      case 'Projeto':
        return renderProcessosContent();
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