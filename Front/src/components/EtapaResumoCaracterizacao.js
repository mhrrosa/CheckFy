import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getGrausImplementacao,
  getGrausImplementacaoEmpresa,
  addGrauImplementacaoEmpresa,
  updateGrausImplementacaoEmpresa
} from '../services/Api';
import '../components/styles/Container.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/Form.css';
import '../components/styles/EtapaResumoCaracterizacao.css';

function EtapaResumoCaracterizacao({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [arrayResumo, setArrayResumo] = useState([]); // Array para salvar os dados de avaliação
  const [resumoSalvo, setResumoSalvo] = useState(false); // Estado para determinar se será "SALVAR" ou "ATUALIZAR"

  useEffect(() => {
    if (avaliacaoId && idVersaoModelo) {
      carregarDados();
    }
  }, [avaliacaoId, idVersaoModelo]);

  const carregarDados = async () => {
    try {
      // Verifica se já há resumo salvo
      const resumo = await getGrausImplementacaoEmpresa(avaliacaoId);

      if (resumo && resumo.length > 0) {
        // Se há resumo salvo, usamos essas notas diretamente
        setResumoSalvo(true);
        montarArrayComResumo(resumo);
      } else {
        // Se não há resumo, buscamos os graus de implementação e calculamos as notas
        const graus = await getGrausImplementacao(avaliacaoId);
        montarArrayComCalculo(graus);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const montarArrayComResumo = async (resumo) => {
    try {
      const processos = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(processos.processos);

      const arrayInicial = [];

      for (const processo of processos.processos) {
        const resultados = await getResultadosEsperadosPorProcesso(processo.ID, avaliacaoId);
        setResultadosEsperados(prevResultados => ({
          ...prevResultados,
          [processo.ID]: resultados
        }));

        // Para cada resultado esperado, buscamos a nota no resumo
        resultados.forEach(resultado => {
          const notaResumo = resumo.find(item => item.ID_Resultado_Esperado === resultado.ID)?.Nota || 'NA';

          arrayInicial.push({
            id_avaliacao: avaliacaoId,
            id_processo: processo.ID,
            id_resultado_esperado: resultado.ID,
            nota: notaResumo // Usar a nota do resumo ou 'NA'
          });
        });
      }

      setArrayResumo(arrayInicial);  // Salvar o array com as notas do resumo
    } catch (error) {
      console.error('Erro ao montar array com resumo:', error);
    }
  };

  const montarArrayComCalculo = async (graus) => {
    try {
      const processos = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(processos.processos);

      const arrayInicial = [];

      for (const processo of processos.processos) {
        const resultados = await getResultadosEsperadosPorProcesso(processo.ID, avaliacaoId);
        setResultadosEsperados(prevResultados => ({
          ...prevResultados,
          [processo.ID]: resultados
        }));

        // Para cada resultado esperado, calcular a nota com base nos graus
        resultados.forEach(resultado => {
          const notasParaResultado = graus
            .filter(grau => grau.ID_Resultado_Esperado === resultado.ID)
            .map(grau => grau.Nota);
          const notaFinal = calcularCaracterizacaoUnidade(notasParaResultado);

          arrayInicial.push({
            id_avaliacao: avaliacaoId,
            id_processo: processo.ID,
            id_resultado_esperado: resultado.ID,
            nota: notaFinal // Usar a nota calculada
          });
        });
      }

      setArrayResumo(arrayInicial);  // Salvar o array com as notas calculadas
    } catch (error) {
      console.error('Erro ao montar array com cálculo:', error);
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
  };

  const salvarResumoCaracterizacao = async () => {
    try {

      if (resumoSalvo) {
        await updateGrausImplementacaoEmpresa(arrayResumo);
      } else {
        const response = await addGrauImplementacaoEmpresa(arrayResumo);

        if (response.message === 'Graus de implementação inseridos com sucesso!') {
          setResumoSalvo(true); 
        }
      }
    } catch (error) {
      console.error('Erro ao salvar resumo:', error);
    }
  };

  const calcularCaracterizacaoUnidade = (notas) => {
    if (notas.length === 0) return 'NA';
    if (notas.every(nota => nota === 'Totalmente implementado (T)')) return 'T';
    if (notas.every(nota => nota === 'Totalmente implementado (T)' || nota === 'Largamente implementado (L)')) return 'L';
    if (notas.every(nota => nota === 'Totalmente implementado (T)' || nota === 'Largamente implementado (L)' || nota === 'Não avaliado (NA)')) return 'L';
    if (notas.includes('Não implementado (N)')) return 'N';
    if (notas.includes('Parcialmente implementado (P)')) return 'P';
    return 'NA';
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>RESUMO DA AVALIAÇÃO</h1>
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
            (resultadosEsperados[processo.ID] || []).map(resultado => {
              const itemResumo = arrayResumo.find(item => item.id_resultado_esperado === resultado.ID);

              return (
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
                      value={itemResumo?.nota || 'NA'}
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
              );
            })
          ))}
        </tbody>
      </table>
      <button className='button-next' onClick={salvarResumoCaracterizacao}>
        {resumoSalvo ? 'ATUALIZAR' : 'SALVAR'}
      </button>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaResumoCaracterizacao;