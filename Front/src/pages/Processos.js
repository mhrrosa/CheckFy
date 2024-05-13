import React, { useState, useEffect } from 'react';
import { getProcessos, createProcesso, updateProcesso, deleteProcesso } from '../services/Api';
import '../styles/Processos.css';

function Processos() {
  // Estado para todos os processos e para os campos de entrada
  const [processos, setProcessos] = useState([]);
  const [novoProcessoDescricao, setNovoProcessoDescricao] = useState('');
  const [novoProcessoTipo, setNovoProcessoTipo] = useState('');

  // Obter todos os processos ao montar o componente
  useEffect(() => {
    getProcessos()
      .then(data => {
        // Certifique-se de que os processos recebidos tenham as propriedades `id`, `descricao` e `tipo`
        const processosFormatados = data.map(p => ({ id: p[0], descricao: p[1], tipo: p[2] }));
        setProcessos(processosFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar processos:', error);
        setProcessos([]);
      });
  }, []);

  // Adicionar um novo processo
  const adicionarProcesso = () => {
    const processoData = {
      descricao: novoProcessoDescricao,
      tipo: novoProcessoTipo
    };
    createProcesso(processoData)
      .then(novo => {
        setProcessos([...processos, novo]);
        setNovoProcessoDescricao('');
        setNovoProcessoTipo('');
      })
      .catch(error => console.error('Erro ao adicionar processo:', error));
  };

  // Remover um processo existente
  const removerProcesso = (id) => {
    deleteProcesso(id)
      .then(() => {
        setProcessos(processos.filter(p => p.id !== id));
      })
      .catch(error => console.error('Erro ao remover processo:', error));
  };

  // Atualizar um processo existente
  const atualizarProcesso = (id, novaDescricao, novoTipo) => {
    const atualizado = {
      descricao: novaDescricao,
      tipo: novoTipo
    };
    updateProcesso(id, atualizado)
      .then(() => {
        setProcessos(processos.map(p => (p.id === id ? { ...p, ...atualizado } : p)));
      })
      .catch(error => console.error('Erro ao atualizar processo:', error));
  };

  return (
    <div className="processos-container">
      <h1>Gerenciamento de Processos</h1>
      {/* Campo de entrada para a descrição */}
      <input
        type="text"
        placeholder="Descrição do Processo"
        value={novoProcessoDescricao}
        onChange={(e) => setNovoProcessoDescricao(e.target.value)}
      />
      {/* Campo de entrada para o tipo */}
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
                      setProcessos(processos.map(p => (p.id === processo.id ? { ...p, descricao: novaDescricao } : p)));
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={processo.tipo}
                    onChange={(e) => {
                      const novoTipo = e.target.value;
                      setProcessos(processos.map(p => (p.id === processo.id ? { ...p, tipo: novoTipo } : p)));
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