import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
  getAvaliacaoById,
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getEvidenciasPorResultado,
  getRelatorioAuditoriaFinal,
  getGrausImplementacaoEmpresa,
  addGrauImplementacaoEmpresa,
  updateGrausImplementacaoEmpresa,
  addOrUpdateGrauImplementacao,
  getGrausImplementacao
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaEvidencia.css';
import '../components/styles/EtapaResumoCaracterizacao.css';
import '../components/styles/EtapaCaracterizacao.css';

function EtapaRealizarAjusteAvaliacaoFinal({ avaliacaoId, idVersaoModelo, onBack  }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [activeParentTab, setActiveParentTab] = useState('Resultado Auditoria');
  const [activeChildTab, setActiveChildTab] = useState(null);
  const [avaliacao, setAvaliacao] = useState(null);
  const [aprovacao, setAprovacao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [relatorioExiste, setRelatorioExiste] = useState(false);
  const [arrayResumo, setArrayResumo] = useState([]);
  const [resumoSalvo, setResumoSalvo] = useState(false);
  const [grausImplementacao, setGrausImplementacao] = useState({});
  const [activeTab, setActiveTab] = useState(null); // Added for tabs in Resumo da Caracterização

  const parentTabs = ['Resultado Auditoria', 'Informações Gerais', 'Processos', 'Resumo da Caracterização da Avaliação', 'Concluir Ajustes e Solicitar a Auditoria'];

  const options = [
    "Totalmente implementado (T)",
    "Largamente implementado (L)",
    "Parcialmente implementado (P)",
    "Não implementado (N)",
    "Não avaliado (NA)",
    "Fora do escopo (F)"
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
    if (processos.length > 0 && activeParentTab === 'Resumo da Caracterização da Avaliação') {
      setActiveTab(processos[0].ID);
    }
  }, [processos, activeParentTab]);

  const salvarNotas = async () => {
    try {
      const entries = Object.entries(grausImplementacao);
      for (const [key, nota] of entries) {
        const [resultadoId, projetoId] = key.split('-');
        await addOrUpdateGrauImplementacao({
          nota,
          resultadoId: parseInt(resultadoId),
          projetoId: parseInt(projetoId)
        });
      }
      alert('Notas salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      alert('Erro ao salvar notas.');
    }
  };

  const carregarDados = async () => {
    try {
      const avaliacaoData = await getAvaliacaoById(avaliacaoId);
      setAvaliacao(avaliacaoData);

      await carregarRelatorioAuditoriaFinal();

      await carregarProjetos();

      const processosLoaded = await carregarProcessos();

      await carregarGrausImplementacao();

      // Carregar resultados esperados para todos os processos
      for (const processo of processosLoaded) {
        await carregarResultadosEsperados(processo.ID);
      }

      // Carregar resumo da caracterização da avaliação
      await carregarResumoAvaliacao(processosLoaded);

      if (activeParentTab === 'Processos') {
        if (processosLoaded.length > 0) {
          setActiveChildTab(processosLoaded[0].ID);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
    }
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(data.processos);
      return data.processos;
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
      return [];
    }
  };

  const carregarGrausImplementacao = async () => {
    try {
      const data = await getGrausImplementacao(avaliacaoId);
      const graus = {};
      data.forEach(grau => {
        graus[`${grau.ID_Resultado_Esperado}-${grau.ID_Projeto}`] = grau.Nota;
      });
      setGrausImplementacao(graus);
    } catch (error) {
      console.error('Erro ao carregar graus de implementação:', error);
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

  const carregarRelatorioAuditoriaFinal = async () => {
    try {
      const data = await getRelatorioAuditoriaFinal(avaliacaoId);
      if (data && data.descricao) {
        if (data.descricao === 'Aprovado') {
          setAprovacao('Aprovar');
          setJustificativa('');
        } else {
          setAprovacao('Reprovar');
          setJustificativa(data.descricao);
        }
        setRelatorioExiste(true);
      } else {
        setAprovacao('');
        setJustificativa('');
        setRelatorioExiste(false);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório de auditoria final:', error);
    }
  };

  const carregarResumoAvaliacao = async (processosLoaded) => {
    try {
      const resumo = await getGrausImplementacaoEmpresa(avaliacaoId);

      if (resumo && resumo.length > 0) {
        setResumoSalvo(true);
        await montarArrayComResumo(resumo, processosLoaded);
      } else {
        // Se não há resumo salvo, inicializamos as notas como 'Não avaliado (NA)'
        await montarArrayComResumo([], processosLoaded);
      }
    } catch (error) {
      console.error('Erro ao carregar resumo da caracterização da avaliação:', error);
    }
  };

  const montarArrayComResumo = async (resumo, processosLoaded) => {
    try {
      const arrayInicial = [];

      for (const processo of processosLoaded) {
        let resultados = resultadosEsperados[processo.ID];
        if (!resultados) {
          resultados = await getResultadosEsperadosPorProcesso(processo.ID, avaliacaoId);
          setResultadosEsperados(prevResultados => ({
            ...prevResultados,
            [processo.ID]: resultados
          }));
        }

        resultados.forEach(resultado => {
          const notaResumo = resumo.find(item => item.ID_Resultado_Esperado === resultado.ID)?.Nota || 'Não avaliado (NA)';

          arrayInicial.push({
            id_avaliacao: avaliacaoId,
            id_processo: processo.ID,
            processo_descricao: processo.Descricao,
            id_resultado_esperado: resultado.ID,
            resultado_descricao: resultado.Descricao,
            nota: notaResumo
          });
        });
      }

      setArrayResumo(arrayInicial);
    } catch (error) {
      console.error('Erro ao montar array com resumo:', error);
    }
  };

  const handleSelectChange = (evento, resultadoId, projetoId) => {
    const nota = evento.target.value;
    setGrausImplementacao(prevGraus => ({
      ...prevGraus,
      [`${resultadoId}-${projetoId}`]: nota
    }));
  };

  const handleNotaChange = (resultadoId, nota) => {
    setArrayResumo(prevArray => 
      prevArray.map(item => 
        item.id_resultado_esperado === resultadoId 
          ? { ...item, nota: nota } 
          : item
      )
    );
  };

  const salvarResumoCaracterizacao = async () => {
    try {
      if (resumoSalvo) {
        await updateGrausImplementacaoEmpresa(arrayResumo);
        alert('Resumo atualizado com sucesso!');
      } else {
        const response = await addGrauImplementacaoEmpresa(arrayResumo);
        if (response.message === 'Graus de implementação inseridos com sucesso!') {
          setResumoSalvo(true); 
          alert('Resumo salvo com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar resumo:', error);
      alert('Erro ao salvar resumo.');
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
                <h2 className='title-processo-caracterizacao'>{processo.Descricao}</h2>
                {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => {
                    const notaIndex = resultado.Descricao.indexOf('NOTA');
                    const descricao = notaIndex !== -1 ? resultado.Descricao.substring(0, notaIndex).trim() : resultado.Descricao;
                    const nota = notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                    return (
                    <div className='div-resultado-esperado-caracterizacao' key={resultado.ID}>
                        <label className='label-etapas'>Resultado Esperado: </label>
                        <h3 className='title-resultado-caracterizacao'>{descricao}</h3>
                        {nota && <div className='nota-adicional-div'><p className='nota-adicional-resultado'>{nota}</p></div>}
                        {projetos.filter(proj => proj.ID_Avaliacao === avaliacaoId).map(projeto => (
                        <div key={projeto.ID}>
                            <h4 className='title-projeto-caracterizacao'>Projeto: {projeto.Nome_Projeto}</h4>
                            <select
                            className='select-grau'
                            value={grausImplementacao[`${resultado.ID}-${projeto.ID}`] || "Não avaliado (NA)"}
                            onChange={(e) => handleSelectChange(e, resultado.ID, projeto.ID)}
                            >
                            {options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                            </select>
                            <div>
                            {evidencias[`${resultado.ID}-${projeto.ID}`] && evidencias[`${resultado.ID}-${projeto.ID}`]
                                .map(evidencia => (
                                <div className='evidencia-e-botao' key={evidencia.id}>
                                    <p className='title-evidencia-caracterizacao'>Evidencia: {evidencia.nomeArquivo}</p>
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
        <button className='button-save' onClick={salvarNotas}>SALVAR NOTAS</button>
        </>
    );
    };

    const renderResultadoAuditoriaContent = () => {
        return (
        <div className="conteudo-resultado">
            <h2>Resultado da auditoria</h2>
            {aprovacao === 'Aprovar' && <p>Auditoria Aprovada</p>}
            {aprovacao === 'Reprovar' && (
            <>
                <p>Auditoria Reprovada</p>
                <p>Justificativa: {justificativa}</p>
            </>
            )}
        </div>
        );
    };

    const renderResumoAvaliacaoContent = () => {
      return (
        <div className="container-etapa">
          <h1 className='title-form'>RESUMO DA CARACTERIZAÇÃO DA AVALIAÇÃO</h1>
          <div className="tabs">
            {processos.map((processo, index) => (
              <button
                key={processo.ID}
                className={`tab-button ${activeTab === processo.ID ? 'active' : ''}`}
                onClick={() => setActiveTab(processo.ID)}
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
            <table className='resumo-tabela'>
              <thead>
                <tr className='tr-table-resumo-caracterizacao'>
                  <th className='resultado-esperado-head'>Resultado Esperado</th>
                  <th className='nota-head'>Nota</th>
                </tr>
              </thead>
              <tbody>
                {processos.map(processo => (
                  activeTab === processo.ID && (
                    (resultadosEsperados[processo.ID] || []).map(resultado => {
                      const itemResumo = arrayResumo.find(item => item.id_resultado_esperado === resultado.ID);
                      return (
                        <tr className='tr-table-resumo-caracterizacao' key={resultado.ID}>
                          <td className='resultado-esperado-body'>
                            <Tippy content={resultado.Descricao} placement="top" animation="fade">
                              <span className='resultado-esperado'>
                                {resultado.Descricao.substring(0, 50)}{resultado.Descricao.length > 50 ? '...' : ''}
                              </span>
                            </Tippy>
                          </td>
                          <td className='nota-body'>
                            <select
                              className="select-grau-resumo-caracterizacao"
                              value={itemResumo?.nota || 'Não avaliado (NA)'}
                              onChange={(e) => handleNotaChange(resultado.ID, e.target.value)}
                            >
                              <option value="Totalmente implementado (T)">Totalmente implementado (T)</option>
                              <option value="Largamente implementado (L)">Largamente implementado (L)</option>
                              <option value="Parcialmente implementado (P)">Parcialmente implementado (P)</option>
                              <option value="Não implementado (N)">Não implementado (N)</option>
                              <option value="Não avaliado (NA)">Não avaliado (NA)</option>
                              <option value="Fora do escopo (F)">Fora do escopo (F)</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )
                ))}
              </tbody>
            </table>
          </div>
          <button className='button-save' onClick={salvarResumoCaracterizacao}>
            {resumoSalvo ? 'ATUALIZAR' : 'SALVAR'}
          </button>
        </div>
      );
    };

  const renderContent = () => {
    switch (activeParentTab) {
      case 'Informações Gerais':
        return renderInformacoesGeraisContent();
      case 'Processos':
        return renderProcessosContent();
      case 'Resultado Auditoria':
        return renderResultadoAuditoriaContent();
      case 'Resumo da Caracterização da Avaliação':
        return renderResumoAvaliacaoContent(); 
        case 'Concluir Ajustes e Solicitar a Auditoria':
        return renderConcluirAjustesContent();
      default:
        return null;
    }
  };

  const renderInformacoesGeraisContent = () => {
    if (!avaliacao) {
      return <p>Carregando dados...</p>;
    }

    return (
      <div className="conteudo-informacoes-gerais">
        <h2>Informações Gerais</h2>
        <p><strong>Nome da Avaliação:</strong> {avaliacao.nome}</p>
        <p><strong>Descrição:</strong> {avaliacao.descricao}</p>
        <p><strong>Avaliador Líder:</strong> {avaliacao.nome_avaliador_lider}</p>
        <p><strong>Empresa:</strong> {avaliacao.nome_empresa}</p>
        <p><strong>Nível Solicitado:</strong> {avaliacao.nivel_solicitado}</p>
        <p><strong>Versão do Modelo:</strong> {avaliacao.nome_versao_modelo}</p>
        <p><strong>Status:</strong> {avaliacao.status}</p>
        <p><strong>Atividade Planejamento:</strong> {avaliacao.atividade_planejamento}</p>
        <p><strong>Cronograma Planejamento:</strong> {avaliacao.cronograma_planejamento}</p>
        <p><strong>Ata de Reunião de Abertura:</strong> {avaliacao.ata_reuniao_abertura}</p>
        <p><strong>Descrição Relatório de Ajuste Inicial:</strong> {avaliacao.descricao_relatorio_ajuste_inicial}</p>
        <button
          className="button-next"
          onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
        >
          Visualizar Relatório de Ajuste Inicial
        </button>
        <p><strong>Parecer Final:</strong> {avaliacao.parecer_final}</p>
        <p><strong>Nível Atribuído:</strong> {avaliacao.nivel_atribuido}</p>
      </div>
    );
  };

  const renderConcluirAjustesContent = () => {
    const handleConcluirClick = () => {
      const confirmacao = window.confirm(
        "Se continuar, será solicitado que o auditor realize a auditoria novamente. Deseja continuar?"
      );
  
      if (confirmacao) {
        onBack();
      }
    };
  
    return (
      <div className="conteudo-concluir-ajustes">
        <h2>Concluir Ajustes e Solicitar a Auditoria</h2>
        <button className="button-next" onClick={handleConcluirClick}>
          Concluir
        </button>
      </div>
    );
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>AJUSTE DA AVALIAÇÃO FINAL</h1>
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
    </div>
  );
}

export default EtapaRealizarAjusteAvaliacaoFinal;
