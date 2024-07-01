import React, { useState, useEffect } from 'react';
import { getNiveis, createNivel, updateNivel, deleteNivel } from '../services/Api';
import { useNavigate } from 'react-router-dom';
import '../styles/Body.css';
import '../styles/Container.css';
import '../styles/Form.css';
import '../styles/Button.css';
import '../styles/Niveis.css';
import logo from '../img/logo_horizontal.png';

function Niveis() {
  const [niveis, setNiveis] = useState([]);
  const [novoNivel, setNovoNivel] = useState('');
  const [nomeNovoNivel, setNomeNovoNivel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarNiveis();
  }, []);

  const carregarNiveis = () => {
    getNiveis()
      .then(data => {
        const niveisFormatados = data.map(n => ({ id: n[0], nivel: n[1], nome: n[2] }));
        setNiveis(niveisFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar níveis:', error);
        setNiveis([]);
      });
  };

  const adicionarNivel = () => {
    const nivelData = { nivel: novoNivel, nome_nivel: nomeNovoNivel };
    createNivel(nivelData)
      .then(() => {
        carregarNiveis();
        setNovoNivel('');
        setNomeNovoNivel('');
      })
      .catch(error => console.error('Erro ao adicionar nível:', error));
  };

  const removerNivel = (id) => {
    deleteNivel(id)
      .then(() => {
        setNiveis(prevNiveis => prevNiveis.filter(n => n.id !== id));
      })
      .catch(error => console.error('Erro ao remover nível:', error));
  };

  const atualizarNivel = (id, nivel, nomeNivel) => {
    const atualizado = { nivel: nivel, nome_nivel: nomeNivel };
    updateNivel(id, atualizado)
      .then(() => {
        setNiveis(prevNiveis => prevNiveis.map(n => (n.id === id ? { ...n, nivel: nivel, nome: nomeNivel } : n)));
      })
      .catch(error => console.error('Erro ao atualizar nível:', error));
  };

  return (
    <div className="container">
      <div className="form-niveis">
        <button className="close-button-form" onClick={() => navigate('/modelo')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className='title-form'>GERENCIAMENTO DE NÍVEIS</h1>
        <div className="input-wrapper">
          <input
            className="input-field"
            type="text"
            placeholder="Novo Nível"
            value={novoNivel}
            onChange={(e) => setNovoNivel(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Nome do nível"
            value={nomeNovoNivel}
            onChange={(e) => setNomeNovoNivel(e.target.value)}
          />
        </div>
        <div className='logo-and-button'>
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="button" onClick={adicionarNivel}>ADICIONAR</button>
        </div>
        <p className="processos-cadastrados-title">NÍVEIS CADASTRADOS:</p>
        {niveis.length > 0 ? (
          <table>
            <tbody>
              {niveis.map(nivel => (
                <tr key={nivel.id}>
                  <td className='nivel-inserido-td'>
                    <input
                      className='input-nivel-preenchido'
                      type="text"
                      value={nivel.nivel}
                      onChange={(e) => {
                        const valorAtualizado = e.target.value;
                        setNiveis(niveis.map(n => (n.id === nivel.id ? { ...n, nivel: valorAtualizado } : n)));
                      }}
                    />
                  </td>
                  <td className='nome-nivel-inserido-td'>
                    <input
                      className='input-preenchido-niveis'
                      type="text"
                      value={nivel.nome}
                      onChange={(e) => {
                        const valorAtualizado = e.target.value;
                        setNiveis(niveis.map(n => (n.id === nivel.id ? { ...n, nome: valorAtualizado } : n)));
                      }}
                    />
                  </td>
                  <td className='acoes-td-niveis'>
                    <button className='button-acao-niveis'
                      onClick={() => atualizarNivel(nivel.id, nivel.nivel, nivel.nome)}>ATUALIZAR</button> {/* Novo botão */}
                    <button className='button-acao-niveis'
                      onClick={() => removerNivel(nivel.id)}>REMOVER</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum nível encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default Niveis;