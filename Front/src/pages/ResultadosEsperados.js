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
  const [nivelSelecionado, setNivelSelecionado] = useState('');
  const [processoSelecionado, setProcessoSelecionado] = useState('');
  const [niveis, setNiveis] = useState([]);
  const [processos, setProcessos] = useState([]);

  useEffect(() => {
    // Buscar níveis e processos para as caixas seletoras
    getNiveis().then(data => setNiveis(data || []));
    getProcessos().then(data => setProcessos(data || []));

    // Buscar resultados esperados
    getResultadosEsperados().then(data => {
      setResultados(data || []);
    }).catch(error => {
      console.error('Erro ao buscar resultados esperados:', error);
      setResultados([]);
    });
  }, []);

  const adicionarResultadoEsperado = () => {
    const resultadoData = {
      nivel: nivelSelecionado,
      processo: processoSelecionado,
      resultado: novoResultado
    };
    createResultadoEsperado(resultadoData)
      .then(novo => {
        setResultados([...resultados, novo]);
        setNovoResultado('');
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

  const atualizarResultadoEsperado = (id, novoTexto) => {
    const atualizado = { resultado: novoTexto };
    updateResultadoEsperado(id, atualizado)
      .then(() => {
        setResultados(resultados.map(r => (r.id === id ? { ...r, ...atualizado } : r)));
      })
      .catch(error => console.error('Erro ao atualizar resultado esperado:', error));
  };

  return (
    <div className="resultados-esperados-container">
      <h1>Gerenciamento de Resultados Esperados</h1>
      <select value={nivelSelecionado} onChange={(e) => setNivelSelecionado(e.target.value)}>
        <option value="">Selecione o Nível</option>
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
              <th>Resultado Esperado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map(resultado => (
              <tr key={resultado.id}>
                <td>
                  <input
                    type="text"
                    value={resultado.resultado}
                    onChange={(e) => atualizarResultadoEsperado(resultado.id, e.target.value)}
                  />
                </td>
                <td>
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