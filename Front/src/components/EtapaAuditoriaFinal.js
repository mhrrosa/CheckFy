import React, { useState, useEffect } from 'react';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getEvidenciasPorResultado
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaEvidencia.css';

function VisualizarEvidencias({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [activeParentTab, setActiveParentTab] = useState('Processos');
  const [activeChildTab, setActiveChildTab] = useState(null);

  const parentTabs = ['Processos', 'Informações Gerais', 'Outros'];

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

  const carregarDados = async () => {
    await carregarProjetos();
    await carregarProcessos();
    if (activeParentTab === 'Processos') {
      if (processos.length > 0) {
        setActiveChildTab(processos[0].ID);
        await carregarResultadosEsperados(processos[0].ID);
      }
    }
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
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

      if (projetos.length > 0) {
        for (const resultado of data) {
          for (const projeto of projetos) {
            await carregarEvidencias(resultado.ID, projeto.ID);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar resultados esperados:', error);
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

  const renderProcessosContent = () => {
    return (
      <>
        <div className="tabs">
          {processos.map((processo) => (
            <button
              key={processo.ID}
              className={`tab-button ${activeChildTab === processo.ID ? 'active' : ''}`}
              onClick={() => setActiveChildTab(processo.ID)}
            >
              {processo.Descricao === "Gerência de Projetos" ? "GPR" :
               processo.Descricao === "Engenharia de Requisitos" ? "REQ" : 
               processo.Descricao === "Projeto e Construção do Produto" ? "PCP" :
               processo.Descricao === "Integração do Produto" ? "ITP" :
               processo.Descricao === "Verificação e Validação" ? "VV" :
               processo.Descricao === "Gerência de Configuração" ? "GCO" :
               processo.Descricao === "Aquisição" ? "AQU" :
               processo.Descricao === "Medição" ? "MED" :
               processo.Descricao === "Gerência de Decisões" ? "GDE" :
               processo.Descricao === "Gerência de Recursos Humanos" ? "GRH" :
               processo.Descricao === "Gerência de Processos" ? "GPC" :
               processo.Descricao === "Gerência Organizacional" ? "ORG" :
               processo.Descricao}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {processos.map(processo => (
            activeChildTab === processo.ID && (
              <div key={processo.ID}>
                <label className='label-etapas'>Processo: </label>
                <h2 className='title-processo-evidencia'>{processo.Descricao}</h2>
                {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => {
                  const notaIndex = resultado.Descricao.indexOf('NOTA');
                  const descricao = notaIndex !== -1 ? resultado.Descricao.substring(0, notaIndex).trim() : resultado.Descricao;
                  const nota = notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                  return (
                    <div className='div-resultado-esperado-evidencia' key={resultado.ID}>
                      <label className='label-etapas'>Resultado Esperado: </label>
                      <h3 className='title-resultado-evidencia'>{descricao}</h3>
                      {nota && <p className='nota-adicional-resultado'>{nota}</p>}
                      {projetos.filter(proj => proj.ID_Avaliacao === avaliacaoId).map(projeto => (
                        <div key={projeto.ID}>
                          <h4 className='title-projeto-evidencia'>Projeto: {projeto.Nome_Projeto}</h4>
                          <div>
                            {evidencias[`${resultado.ID}-${projeto.ID}`] && evidencias[`${resultado.ID}-${projeto.ID}`]
                              .map(evidencia => (
                                <div key={evidencia.id}>
                                  <p className='title-evidencia'>Evidência: {evidencia.nomeArquivo}</p>
                                  <button className='button-mostrar-documento-etapa-evidencia' onClick={() => window.open(`http://127.0.0.1:5000/uploads/${evidencia.caminhoArquivo}`, '_blank')}>Mostrar</button>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )
          ))}
        </div>
      </>
    );
  };

  const renderInformacoesGeraisContent = () => {
    return (
      <div className="conteudo-informacoes-gerais">
        <h2>Informações Gerais</h2>
        <p>Aqui você pode colocar informações gerais sobre a avaliação, empresa, etc.</p>
      </div>
    );
  };

  const renderOutrosContent = () => {
    return (
      <div className="conteudo-outros">
        <h2>Outros</h2>
        <p>Conteúdo adicional pode ser colocado aqui.</p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeParentTab) {
      case 'Processos':
        return renderProcessosContent();
      case 'Informações Gerais':
        return renderInformacoesGeraisContent();
      case 'Outros':
        return renderOutrosContent();
      default:
        return null;
    }
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>VISUALIZAR EVIDÊNCIAS</h1>
      <div className='dica-div'>
        <strong className="dica-titulo">Dica:</strong>
        <p className='dica-texto'>
          Aqui você pode visualizar as evidências que comprovam a implementação dos processos e o nível de capacidade de processo.
        </p>
      </div>
      <div className="parent-tabs">
        {parentTabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeParentTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveParentTab(tab);
              if (tab !== 'Processos') {
                setActiveChildTab(null);
              } else if (processos.length > 0) {
                setActiveChildTab(processos[0].ID);
                carregarResultadosEsperados(processos[0].ID);
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

export default VisualizarEvidencias;