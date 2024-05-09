import React, { useState, useEffect } from 'react';
import { getProcessos, createProcesso, updateProcesso, deleteProcesso } from '../services/Api';
import '../styles/Processos.css';

function Processos() {
  const [processos, setProcessos] = useState([]);
  const [novoProcesso, setNovoProcesso] = useState('');

  useEffect(() => {
    getProcessos().then(data => {
      setProcessos(data || []);
    }).catch(error => {
      console.error('Erro ao buscar processos:', error);
      setProcessos([]);
    });
  }, []);

  const adicionarProcesso = () => {
    const processoData = { nome: novoProcesso };
    createProcesso(processoData)
      .then(novo => {
        setProcessos([...processos, novo]);
        setNovoProcesso('');
      })
      .catch(error => console.error('Erro ao adicionar processo:', error));
  };

  const removerProcesso = (id) => {
    deleteProcesso(id)
      .then(() => {
        setProcessos(processos.filter(p => p.id !== id));
      })
      .catch(error => console.error('Erro ao remover processo:', error));
  };

  const atualizarProcesso = (id, novoNome) => {
    const atualizado = { nome: novoNome };
    updateProcesso(id, atualizado)
      .then(() => {
        setProcessos(processos.map(p => (p.id === id ? { ...p, ...atualizado } : p)));
      })
      .catch(error => console.error('Erro ao atualizar processo:', error));
  };

  return (
    <div className="processos-container">
      <h1>Gerenciamento de Processos</h1>
      <input
        type="text"
        placeholder="Novo Processo"
        value={novoProcesso}
        onChange={(e) => setNovoProcesso(e.target.value)}
      />
      <button onClick={adicionarProcesso}>Adicionar Processo</button>
      {processos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Processo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processos.map(processo => (
              <tr key={processo.id}>
                <td>
                  <input
                    type="text"
                    value={processo.nome}
                    onChange={(e) => atualizarProcesso(processo.id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => removerProcesso(processo.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum processo encontrado.</p>
      )}
    </div>
  );
}

export default Processos;
