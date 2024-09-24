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
  inserirRelatorioAuditoriaFinal,
  atualizarRelatorioAuditoriaFinal,
  getGrausImplementacaoEmpresa,
  addGrauImplementacaoEmpresa,
  updateGrausImplementacaoEmpresa,
  addOrUpdateGrauImplementacao,
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaEvidencia.css';
import '../components/styles/EtapaResumoCaracterizacao.css';
import '../components/styles/EtapaCaracterizacao.css';

function EtapaConfete({ avaliacaoId, idVersaoModelo, onBack  }) {
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
  const [dropdownVisible, setDropdownVisible] = useState(null);

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

  const carregarDados = async () => {
    try {
      const avaliacaoData = await getAvaliacaoById(avaliacaoId);
      setAvaliacao(avaliacaoData);

      await carregarRelatorioAuditoriaFinal();

      await carregarProjetos();

      const processosLoaded = await carregarProcessos();

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

  const handleNotaChange = (resultadoId, nota) => {
    setArrayResumo(prevArray => 
      prevArray.map(item => 
        item.id_resultado_esperado === resultadoId 
          ? { ...item, nota: nota } 
          : item
      )
    );
    setDropdownVisible(null); // Fechar o dropdown após a seleção
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

  const salvarDecisao = async () => {
    if (aprovacao === '') {
      alert('Por favor, selecione uma opção.');
      return;
    }

    if (aprovacao === 'Reprovar' && justificativa.trim() === '') {
      alert('Por favor, forneça uma justificativa para a reprovação.');
      return;
    }

    try {
      const data = {
        descricao: aprovacao === 'Reprovar' ? justificativa : 'Aprovado',
        idAvaliacao: avaliacaoId,
      };

      if (relatorioExiste) {
        await atualizarRelatorioAuditoriaFinal(data);
        alert('Decisão atualizada com sucesso!');
      } else {
        await inserirRelatorioAuditoriaFinal(data);
        alert('Decisão salva com sucesso!');
        setRelatorioExiste(true);
      }
    } catch (error) {
      console.error('Erro ao salvar decisão:', error);
      alert('Erro ao salvar decisão.');
    }
  };

  const renderResumoAvaliacaoContent = () => {
    return (
      <div className="management-etapa5-container">
        <h1 className='management-etapa5-title'>RESUMO DA CARACTERIZAÇÃO DA AVALIAÇÃO</h1>
        <table className='resumo-tabela'>
          <thead>
            <tr>
              <th>Processo</th>
              <th>Resultado Esperado</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {arrayResumo.map(item => (
              <tr key={item.id_resultado_esperado}>
                <td>{item.processo_descricao}</td>
                <td className='tooltip-container'>
                  <Tippy content={item.resultado_descricao} placement="top" animation="fade">
                    <span className='resultado-esperado'>
                      {item.resultado_descricao.substring(0, 50)}{item.resultado_descricao.length > 50 ? '...' : ''}
                    </span>
                  </Tippy>
                </td>
                <td>
                  <select
                    className="nota-selector"
                    value={item.nota || 'Não avaliado (NA)'}
                    onChange={(e) => handleNotaChange(item.id_resultado_esperado, e.target.value)}
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        AVALIAÇÃO CONCLUIDA
    </div>
  );
}

export default EtapaConfete;
