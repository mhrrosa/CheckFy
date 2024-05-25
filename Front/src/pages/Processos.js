import React, { useState, useEffect } from 'react';
import { getProcessos, createProcesso, updateProcesso, deleteProcesso } from '../services/Api';
import '../styles/Processos.css';

function Processos() {
  const [processos, setProcessos] = useState([]);
  const [novoProcessoDescricao, setNovoProcessoDescricao] = useState('');
  const [novoProcessoTipo, setNovoProcessoTipo] = useState('');

  useEffect(() => {
    carregarProcessos();
  }, []);

  const carregarProcessos = () => {
    getProcessos()
      .then(data => {
        const processosFormatados = data.map(p => ({ id: p[0], descricao: p[1], tipo: p[2] }));
        setProcessos(processosFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar processos:', error);
        setProcessos([]);
      });
  };

  const adicionarProcesso = () => {
    const processoData = {
      descricao: novoProcessoDescricao,
      tipo: novoProcessoTipo
    };
    createProcesso(processoData)
      .then(novo => {
        // Atualize a lista de processos após a confirmação de inserção no banco
        carregarProcessos();
        setNovoProcessoDescricao('');
        setNovoProcessoTipo('');
      })
      .catch(error => console.error('Erro ao adicionar processo:', error));
  };

  const removerProcesso = (id) => {
    deleteProcesso(id)
      .then(() => {
        setProcessos(prevProcessos => prevProcessos.filter(p => p.id !== id));
      })
      .catch(error => console.error('Erro ao remover processo:', error));
  };

  const atualizarProcesso = (id, novaDescricao, novoTipo) => {
    const atualizado = {
      nova_descricao: novaDescricao,
      novo_tipo: novoTipo
    };
    updateProcesso(id, atualizado)
      .then(() => {
        setProcessos(prevProcessos => prevProcessos.map(p => (p.id === id ? { ...p, descricao: novaDescricao, tipo: novoTipo } : p)));
      })
      .catch(error => console.error('Erro ao atualizar processo:', error));
  };

  return (
    <div className="processos-container">
      <h1>Gerenciamento de Processos</h1>
      <input
        type="text"
        placeholder="Descrição do Processo"
        value={novoProcessoDescricao}
        onChange={(e) => setNovoProcessoDescricao(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tipo do Processo"
        value={novoProcessoTipo}
        onChange={(e) => setNovoProcessoTipo(e.target.value)}
      />
      <button onClick={adicionarProcesso}>Adicionar Processo</button>
      {processos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processos.map(processo => (
              <tr key={processo.id}>
                <td>
                  <input
                    type="text"
                    value={processo.descricao}
                    onChange={(e) => {
                      const novaDescricao = e.target.value;
                      setProcessos(prevProcessos => prevProcessos.map(p => (p.id === processo.id ? { ...p, descricao: novaDescricao } : p)));
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={processo.tipo}
                    onChange={(e) => {
                      const novoTipo = e.target.value;
                      setProcessos(prevProcessos => prevProcessos.map(p => (p.id === processo.id ? { ...p, tipo: novoTipo } : p)));
                    }}
                  />
                </td>
                <td>
                  <button onClick={() => atualizarProcesso(processo.id, processo.descricao, processo.tipo)}>Atualizar</button>
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
