import React, { useState, useEffect } from 'react';
import {
  getResultadosEsperados,
  createResultadoEsperado,
  updateResultadoEsperado,
  deleteResultadoEsperado,
  getNiveis,
  getProcessos
} from '../services/Api';
import '../styles/ResultadosEsperados.css';

function ResultadosEsperados() {
  const [resultados, setResultados] = useState([]);
  const [novoResultado, setNovoResultado] = useState('');
  const [nivelInicioSelecionado, setNivelInicioSelecionado] = useState('');
  const [nivelFimSelecionado, setNivelFimSelecionado] = useState('');
  const [processoSelecionado, setProcessoSelecionado] = useState('');
  const [niveis, setNiveis] = useState([]);
  const [processos, setProcessos] = useState([]);

  useEffect(() => {
    // Buscar níveis e processos para as caixas seletoras
    getNiveis().then(data => setNiveis(data || []));
    getProcessos().then(data => setProcessos(data || []));

    // Buscar resultados esperados
    getResultadosEsperados().then(data => {
      const resultadosFormatados = data.map(r => ({
        id: r[0],
        descricao: r[1],
        idNivelInicio: r[2],
        idNivelFim: r[3],
        idProcesso: r[4]
      }));
      setResultados(resultadosFormatados);
    }).catch(error => {
      console.error('Erro ao buscar resultados esperados:', error);
      setResultados([]);
    });
  }, []);

  const adicionarResultadoEsperado = () => {
    const resultadoData = {
      descricao: novoResultado,
      id_nivel_intervalo_inicio: nivelInicioSelecionado,
      id_nivel_intervalo_fim: nivelFimSelecionado,
      id_processo: processoSelecionado
    };
    createResultadoEsperado(resultadoData)
      .then(novo => {
        // Adiciona o novo resultado esperado na lista
        setResultados([...resultados, novo]);
        // Limpa os campos de entrada
        setNovoResultado('');
        setNivelInicioSelecionado('');
        setNivelFimSelecionado('');
        setProcessoSelecionado('');
      })
      .catch(error => console.error('Erro ao adicionar resultado esperado:', error));
  };

  const removerResultadoEsperado = (id) => {
    deleteResultadoEsperado(id)
      .then(() => {
        setResultados(resultados.filter(r => r.id !== id));
      })
      .catch(error => console.error('Erro ao remover resultado esperado:', error));
  };

  const atualizarResultadoEsperado = (id, descricao, idNivelInicio, idNivelFim, idProcesso) => {
    const atualizado = {
      nova_descricao: descricao,
      novo_id_nivel_intervalo_inicio: idNivelInicio,
      novo_id_nivel_intervalo_fim: idNivelFim,
      novo_id_processo: idProcesso
    };
    updateResultadoEsperado(id, atualizado)
      .then(() => {
        setResultados(resultados.map(r => (r.id === id ? { ...r, descricao, idNivelInicio, idNivelFim, idProcesso } : r)));
      })
      .catch(error => console.error('Erro ao atualizar resultado esperado:', error));
  };

  return (
    <div className="resultados-esperados-container">
      <h1>Gerenciamento de Resultados Esperados</h1>
      <select value={nivelInicioSelecionado} onChange={(e) => setNivelInicioSelecionado(e.target.value)}>
        <option value="">Selecione o Nível de Início</option>
        {niveis.map(n => (
          <option key={n.id} value={n.id}>{n.nivel}</option>
        ))}
      </select>
      <select value={nivelFimSelecionado} onChange={(e) => setNivelFimSelecionado(e.target.value)}>
        <option value="">Selecione o Nível de Fim</option>
        {niveis.map(n => (
          <option key={n.id} value={n.id}>{n.nivel}</option>
        ))}
      </select>
      <select value={processoSelecionado} onChange={(e) => setProcessoSelecionado(e.target.value)}>
        <option value="">Selecione o Processo</option>
        {processos.map(p => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Novo Resultado Esperado"
        value={novoResultado}
        onChange={(e) => setNovoResultado(e.target.value)}
      />
      <button onClick={adicionarResultadoEsperado}>Adicionar Resultado</button>
      {resultados.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Nível Início</th>
              <th>Nível Fim</th>
              <th>Processo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map(resultado => (
              <tr key={resultado.id}>
                <td>
                  <input
                    type="text"
                    value={resultado.descricao}
                    onChange={(e) => {
                      const novaDescricao = e.target.value;
                      setResultados(resultados.map(r => (r.id === resultado.id ? { ...r, descricao: novaDescricao } : r)));
                    }}
                  />
                </td>
                <td>
                  <select
                    value={resultado.idNivelInicio}
                    onChange={(e) => {
                      const idNivelInicioAtualizado = e.target.value;
                      setResultados(resultados.map(r => (r.id === resultado.id ? { ...r, idNivelInicio: idNivelInicioAtualizado } : r)));
                    }}
                  >
                    {niveis.map(n => (
                      <option key={n.id} value={n.id}>{n.nivel}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={resultado.idNivelFim}
                    onChange={(e) => {
                      const idNivelFimAtualizado = e.target.value;
                      setResultados(resultados.map(r => (r.id === resultado.id ? { ...r, idNivelFim: idNivelFimAtualizado } : r)));
                    }}
                  >
                    {niveis.map(n => (
                      <option key={n.id} value={n.id}>{n.nivel}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={resultado.idProcesso}
                    onChange={(e) => {
                      const idProcessoAtualizado = e.target.value;
                      setResultados(resultados.map(r => (r.id === resultado.id ? { ...r, idProcesso: idProcessoAtualizado } : r)));
                    }}
                  >
                    {processos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => atualizarResultadoEsperado(resultado.id, resultado.descricao, resultado.idNivelInicio, resultado.idNivelFim, resultado.idProcesso)}
                  >
                    Atualizar
                  </button>
                  <button onClick={() => removerResultadoEsperado(resultado.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum resultado esperado encontrado.</p>
      )}
    </div>
  );
}
export default ResultadosEsperados;  