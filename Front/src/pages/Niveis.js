import React, { useState, useEffect } from 'react';
import { getNiveis, createNivel, updateNivel, deleteNivel } from '../services/Api';
import '../styles/Niveis.css';

function Niveis() {
  const [niveis, setNiveis] = useState([]);
  const [novoNivel, setNovoNivel] = useState('');

  // Carregar níveis ao montar o componente
  useEffect(() => {
    getNiveis()
      .then(data => {
        // Transformar dados recebidos no formato esperado
        const niveisFormatados = data.map(n => ({ id: n[0], nivel: n[1] }));
        setNiveis(niveisFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar níveis:', error);
        setNiveis([]);
      });
  }, []);

  const adicionarNivel = () => {
    const nivelData = { nivel: novoNivel };
    createNivel(nivelData)
      .then(novo => {
        setNiveis([...niveis, novo]);
        setNovoNivel('');
      })
      .catch(error => console.error('Erro ao adicionar nível:', error));
  };

  const removerNivel = (id) => {
    if (!id) {
      console.error('Erro: ID do nível não fornecido para a remoção.');
      return;
    }

    deleteNivel(id)
      .then(() => {
        setNiveis(niveis.filter(n => n.id !== id));
      })
      .catch(error => console.error('Erro ao remover nível:', error));
  };

  const atualizarNivel = (id, novoNome) => {
    const atualizado = { nivel: novoNome };
    updateNivel(id, atualizado)
      .then(() => {
        setNiveis(niveis.map(n => (n.id === id ? { ...n, ...atualizado } : n)));
      })
      .catch(error => console.error('Erro ao atualizar nível:', error));
  };

  return (
    <div className="niveis-container">
      <h1>Gerenciamento de Níveis</h1>
      <input
        type="text"
        placeholder="Novo Nível"
        value={novoNivel}
        onChange={(e) => setNovoNivel(e.target.value)}
      />
      <button onClick={adicionarNivel}>Adicionar Nível</button>
      {niveis.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {niveis.map(nivel => (
              <tr key={nivel.id}>
                <td>
                  <input
                    type="text"
                    value={nivel.nivel}
                    onChange={(e) => {
                      const valorAtualizado = e.target.value;
                      setNiveis(niveis.map(n => (n.id === nivel.id ? { ...n, nivel: valorAtualizado } : n)));
                    }}
                  />
                </td>
                <td>
                  <button onClick={() => atualizarNivel(nivel.id, nivel.nivel)}>Atualizar</button> {/* Novo botão */}
                  <button onClick={() => removerNivel(nivel.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum nível encontrado.</p>
      )}
    </div>
  );
}

export default Niveis;