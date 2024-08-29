import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getGrausImplementacao
} from '../services/Api';
import '../components/styles/EtapaResumoCaracterizacao.css';

function EtapaResumoCaracterizacao({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [grausImplementacao, setGrausImplementacao] = useState({});
  const [notas, setNotas] = useState({});

  useEffect(() => {
    if (avaliacaoId && idVersaoModelo) {
      carregarDados();
    }
  }, [avaliacaoId, idVersaoModelo]);

  const carregarDados = async () => {
    try {
      await carregarProcessos();
      await carregarGrausImplementacao();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(data.processos);
      for (const processo of data.processos) {
        await carregarResultadosEsperados(processo.ID);
      }
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  const carregarGrausImplementacao = async () => {
    try {
      const data = await getGrausImplementacao(avaliacaoId);
      const graus = {};
      data.forEach(grau => {
        if (!graus[grau.ID_Resultado_Esperado]) {
          graus[grau.ID_Resultado_Esperado] = [];
        }
        graus[grau.ID_Resultado_Esperado].push(grau.Nota);
      });
      setGrausImplementacao(graus);
    } catch (error) {
      console.error('Erro ao carregar graus de implementação:', error);
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

  const handleNotaChange = (resultadoId, nota) => {
    setNotas(prevNotas => ({
      ...prevNotas,
      [resultadoId]: nota
    }));
    // Aqui você pode adicionar a lógica para salvar a alteração no banco de dados
  };

  const calcularCaracterizacaoUnidade = (notas) => {
    if (notas.every(nota => nota === 'Totalmente implementado (T)')) return 'T';
    if (notas.every(nota => nota === 'Totalmente implementado (T)' || nota === 'Largamente implementado (L)')) return 'L';
    if (notas.includes('Não implementado (N)')) return 'N';
    if (notas.includes('Parcialmente implementado (P)')) return 'P';
    return 'NA';
  };

  return (
    <div className="management-etapa5-container">
      <h1 className='management-etapa5-title'>RESUMO DA AVALIAÇÃO</h1>
      <table className='resumo-tabela'>
        <thead>
          <tr>
            <th>Processo</th>
            <th>Resultado Esperado</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {processos.map(processo => (
            (resultadosEsperados[processo.ID] || []).map(resultado => (
              <tr key={resultado.ID}>
                <td>{processo.Descricao}</td>
                <td className='tooltip-container'>
                  <Tippy content={resultado.Descricao} placement="top" animation="fade">
                    <span className='resultado-esperado'>
                      {resultado.Descricao.substring(0, 50)}{resultado.Descricao.length > 50 ? '...' : ''}
                    </span>
                  </Tippy>
                </td>
                <td>
                  <select
                    className="nota-selector"
                    value={notas[resultado.ID] || calcularCaracterizacaoUnidade(grausImplementacao[resultado.ID] || [])}
                    onChange={(e) => handleNotaChange(resultado.ID, e.target.value)}
                  >
                    <option value="T">T</option>
                    <option value="L">L</option>
                    <option value="P">P</option>
                    <option value="N">N</option>
                    <option value="NA">NA</option>
                  </select>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaResumoCaracterizacao;