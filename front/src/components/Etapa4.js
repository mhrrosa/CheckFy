import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getEvidenciasPorResultado,
  getGrausImplementacao,
  addOrUpdateGrauImplementacao
} from '../services/Api';
import '../styles/Body.css';
import '../styles/Form.css';
import '../styles/Button.css';
import '../styles/Etapa4.css';

Modal.setAppElement('#root');

function Etapa4({ onNext, avaliacaoId }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [selectedResultadoId, setSelectedResultadoId] = useState(null);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [grausImplementacao, setGrausImplementacao] = useState({});

  const options = [
    "Totalmente implementado (T)",
    "Largamente implementado (L)",
    "Parcialmente implementado (P)",
    "Não implementado (N)",
    "Não avaliado (NA)",
    "Fora do escopo (F)"
  ];

  useEffect(() => {
    if (avaliacaoId) {
      carregarDados();
    }
  }, [avaliacaoId]);

  const carregarDados = async () => {
    await carregarProcessos();
    await carregarProjetos();
    await carregarGrausImplementacao();
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId);
      setProcessos(data.processos);
      console.log('Processos carregados:', data.processos);
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);
      console.log('Projetos carregados:', data);
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
      console.log(`Resultados esperados carregados para o processo ${processoId}:`, data);

      for (const resultado of data) {
        for (const projeto of projetos) {
          await carregarEvidencias(resultado.ID, projeto.ID);
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
      console.log(`Evidencias carregadas para resultado ${resultadoId} e projeto ${projetoId}:`, evidenciasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar evidencias:', error);
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
      console.log('Graus de implementação carregados:', graus);
    } catch (error) {
      console.error('Erro ao carregar graus de implementação:', error);
    }
  };

  const handleSelectChange = async (evento, resultadoId, projetoId) => {
    const nota = evento.target.value;
    try {
      await addOrUpdateGrauImplementacao({ nota, resultadoId, projetoId });
      setGrausImplementacao(prevGraus => ({
        ...prevGraus,
        [`${resultadoId}-${projetoId}`]: nota
      }));
      console.log(`Grau de implementação atualizado ${nota} para Resultado ${resultadoId} e Projeto ${projetoId}`);
    } catch (error) {
      console.error('Erro ao atualizar grau de implementação:', error);
    }
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>CARACTERIZAÇÃO DE GRAU DE CADA RESULTADO ESPERADO DO PROCESSO</h1>
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
                          <div key={evidencia.id}>
                            <p className='title-evidencia'>Evidencia: {evidencia.nomeArquivo}</p>
                            <button className='button-acao' onClick={() => window.open(`http://127.0.0.1:5000/uploads/${evidencia.caminhoArquivo}`, '_blank')}>Mostrar</button>
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
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default Etapa4;