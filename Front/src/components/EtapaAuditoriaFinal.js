import React, { useState, useEffect } from 'react';
import {
  getAvaliacaoById,
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getEvidenciasPorResultado,
  getRelatorioAuditoriaFinal,
  inserirRelatorioAuditoriaFinal,
  atualizarRelatorioAuditoriaFinal,
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaEvidencia.css';

function EtapaAuditoriaFinal({ avaliacaoId, idVersaoModelo, onNext, onDuploNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [activeParentTab, setActiveParentTab] = useState('Processos');
  const [activeChildTab, setActiveChildTab] = useState(null);
  const [avaliacao, setAvaliacao] = useState(null);
  const [aprovacao, setAprovacao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [relatorioExiste, setRelatorioExiste] = useState(false);

  const parentTabs = ['Processos', 'Informações Gerais', 'Resultado Auditoria'];

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

  const handleNextStep = () => {
    if (aprovacao === 'Aprovar') {
      onDuploNext(); // Chama a função para avançar duas etapas.
    } else {
      onNext(); // Chama a função para avançar uma etapa.
    }
  };

  const carregarDados = async () => {
    try {
      const avaliacao = await getAvaliacaoById(avaliacaoId);
      setAvaliacao(avaliacao);
  
      await carregarRelatorioAuditoriaFinal();
  
      await carregarProjetos();
      await carregarProcessos();
  
      if (activeParentTab === 'Processos') {
        if (processos.length > 0) {
          setActiveChildTab(processos[0].ID);
          await carregarResultadosEsperados(processos[0].ID);
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
        <p>Selecione uma opção:</p>
        <select
          value={aprovacao}
          onChange={(e) => setAprovacao(e.target.value)}
          className="select-aprovacao"
        >
          {aprovacao === '' && <option value="">Selecione</option>}
          <option value="Aprovar">Aprovar</option>
          <option value="Reprovar">Reprovar</option>
        </select>
  
        {aprovacao === 'Reprovar' && (
          <>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Escreva a justificativa da reprovação"
              className="textarea-justificativa"
            />
          </>
        )}
  
        <button className="button-save" onClick={salvarDecisao}>Salvar</button>
        <button className='button-next' onClick={handleNextStep}>PRÓXIMA ETAPA</button>
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


  const renderContent = () => {
    switch (activeParentTab) {
      case 'Processos':
        return renderProcessosContent();
      case 'Informações Gerais':
        return renderInformacoesGeraisContent();
      case 'Resultado Auditoria':
        return renderResultadoAuditoriaContent();
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
    </div>
  );
}

export default EtapaAuditoriaFinal;