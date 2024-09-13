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
import '../components/styles/EtapaResumoCaracterizacao.css';

function EtapaResumoCaracterizacao({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [grausImplementacao, setGrausImplementacao] = useState({});
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
      console.log('Resumo recebido:', resumo);
  
      // Se o resumo não for nulo, considera que já há um resumo salvo
      setResumoSalvo(!!resumo);
  
      // Se o resumo for nulo ou indefinido, faz o GET dos graus de implementação padrão
      const graus = resumo && resumo.length ? resumo : await getGrausImplementacao(avaliacaoId);
      console.log('Graus implementacao recebidos:', graus);
  
      // Carregar processos e resultados esperados
      const processos = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(processos.processos);
      
      const arrayInicial = [];
  
      for (const processo of processos.processos) {
        const resultados = await getResultadosEsperadosPorProcesso(processo.ID, avaliacaoId);
        setResultadosEsperados(prevResultados => ({
          ...prevResultados,
          [processo.ID]: resultados
        }));
  
        // Para cada resultado esperado, coletar todas as notas e calcular a caracterização final
        resultados.forEach(resultado => {
          // Coletar todas as notas para esse resultado esperado
          const notasParaResultado = graus
            .filter(grau => grau.ID_Resultado_Esperado === resultado.ID)
            .map(grau => grau.Nota);
  
          // Calcular a nota final usando a função 'calcularCaracterizacaoUnidade'
          const notaFinal = calcularCaracterizacaoUnidade(notasParaResultado);
  
          // Adicionar o resultado ao arrayInicial
          arrayInicial.push({
            id_avaliacao: avaliacaoId,
            id_processo: processo.ID,
            id_resultado_esperado: resultado.ID,
            nota: notaFinal  // Nota calculada para o resultado esperado
          });
        });
      }
  
      console.log('Array inicial montado:', arrayInicial);
      setArrayResumo(arrayInicial);  // Salvar o array inicial com os objetos
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };
  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      console.log('Processos recebidos:', data.processos);
      setProcessos(data.processos);

      for (const processo of data.processos) {
        await carregarResultadosEsperados(processo.ID);
      }
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  const carregarResultadosEsperados = async (processoId) => {
    try {
      const data = await getResultadosEsperadosPorProcesso(processoId, avaliacaoId);
      console.log(`Resultados esperados para processo ${processoId}:`, data);
      setResultadosEsperados(prevResultados => ({
        ...prevResultados,
        [processoId]: data
      }));
    } catch (error) {
      console.error('Erro ao carregar resultados esperados:', error);
    }
  };

  // Função para alterar a nota no arrayResumo quando houver mudanças na tabela
  const handleNotaChange = (resultadoId, nota) => {
    console.log(`Alterando nota para resultado esperado ${resultadoId} para:`, nota);
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
      console.log('Array a ser salvo:', arrayResumo);
      
      // Verifica se será um insert ou update
      if (resumoSalvo) {
        // Atualizar os dados existentes
        await updateGrausImplementacaoEmpresa(arrayResumo);
        console.log('Dados atualizados com sucesso');
      } else {
        // Inserir os novos dados
        const response = await addGrauImplementacaoEmpresa(arrayResumo);
        if (response.status === 201) {
          console.log('Dados inseridos com sucesso');
          setResumoSalvo(true); // Após o insert, marque que o resumo foi salvo
        }
      }
    } catch (error) {
      console.error('Erro ao salvar resumo:', error);
    }
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
            (resultadosEsperados[processo.ID] || []).map(resultado => {
              // Encontre o item correspondente no arrayResumo
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
                      value={itemResumo?.nota || 'NA'}  // Use o valor correto da nota do arrayResumo, ou 'NA' se não houver nota
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
      <button className='button-save' onClick={salvarResumoCaracterizacao}>
        {resumoSalvo ? 'ATUALIZAR' : 'SALVAR'}
      </button>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaResumoCaracterizacao;