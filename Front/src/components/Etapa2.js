import React, { useState, useEffect } from 'react';
import { getProjetosByAvaliacao, createProjeto, updateProjeto } from '../services/Api';
import '../styles/Processos.css';

function Etapa2({ onNext, avaliacaoId }) {
  const [projetos, setProjetos] = useState([]);
  const [novoProjetoNome, setNovoProjetoNome] = useState('');
  const [novoProjetoHabilitado, setNovoProjetoHabilitado] = useState(false);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [editandoProjeto, setEditandoProjeto] = useState(false);

  useEffect(() => {
    if (avaliacaoId) {
      carregarProjetos();
    }
  }, [avaliacaoId]);

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const salvarProjeto = async () => {
    try {
      const projetoData = { avaliacaoId, nome: novoProjetoNome, habilitado: novoProjetoHabilitado };
      if (editandoProjeto) {
        await updateProjeto(selectedProjetoId, projetoData);
      } else {
        await createProjeto(projetoData);
      }
      carregarProjetos();
      resetarFormulario();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  const resetarFormulario = () => {
    setNovoProjetoNome('');
    setNovoProjetoHabilitado(false);
    setEditandoProjeto(false);
    setSelectedProjetoId(null);
  };

  const atualizarProjeto = async (projetoId, habilitado) => {
    try {
      const projetoData = { habilitado };
      await updateProjeto(projetoId, projetoData);
      setProjetos(prevProjetos => prevProjetos.map(proj => (proj.ID === projetoId ? { ...proj, Projeto_Habilitado: habilitado } : proj)));
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
    }
  };

  return (
    <div className="management-process-container">
      <div className="form-section">
        <h1 className='management-process-title'>GERENCIAMENTO DE PROJETOS</h1>
        <div className='lista-input'>
          <div className='input-wrapper'>
            <label className="label">Nome do Projeto:</label>
            <input
              type="text"
              value={novoProjetoNome}
              onChange={(e) => setNovoProjetoNome(e.target.value)}
              className="input-field"
            />
          </div>
          <div className='input-wrapper'>
            <label className="label">Projeto Habilitado:</label>
            <input
              type="checkbox"
              checked={novoProjetoHabilitado}
              onChange={(e) => setNovoProjetoHabilitado(e.target.checked)}
            />
          </div>
        </div>
        <div className='logo-and-button'>
          <button className="button" onClick={salvarProjeto}>
            {editandoProjeto ? 'Atualizar Projeto' : 'Adicionar Projeto'}
          </button>
        </div>
        <p className="processos-cadastrados-title">PROJETOS CADASTRADOS:</p>
        {projetos.length > 0 ? (
          <table>
            <tbody>
              {projetos.map((projeto) => (
                <tr key={projeto.ID}>
                  <td className='nome-inserido-td'>
                    {projeto.Nome_Projeto} (Projeto {projeto.Numero_Projeto}) -
                    <label>
                      Habilitado:
                      <input
                        type="checkbox"
                        checked={projeto.Projeto_Habilitado}
                        onChange={(e) => {
                          atualizarProjeto(projeto.ID, e.target.checked);
                        }}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum projeto encontrado.</p>
        )}
      </div>
      <button onClick={onNext}>Próxima Etapa</button>
    </div>
  );
}

export default Etapa2;