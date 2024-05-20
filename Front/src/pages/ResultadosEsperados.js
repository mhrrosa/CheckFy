import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getResultadosEsperados,
  createResultadoEsperado,
  updateResultadoEsperado,
  deleteResultadoEsperado,
  getNiveis,
  getProcessos
} from '../services/Api';
import '../styles/ResultadosEsperados.css';
import logo from '../img/logo_horizontal.png';

function ResultadosEsperados() {
  const [resultados, setResultados] = useState([]);
  const [novoResultado, setNovoResultado] = useState('');
  const [nivelInicioSelecionado, setNivelInicioSelecionado] = useState('');
  const [nivelFimSelecionado, setNivelFimSelecionado] = useState('');
  const [processoSelecionado, setProcessoSelecionado] = useState('');
  const [niveis, setNiveis] = useState([]);
  const [processos, setProcessos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      const niveisData = await getNiveis();
      const niveisFormatados = niveisData.map(n => ({ id: n[0], nivel: n[1] }));
      setNiveis(niveisFormatados);

      const processosData = await getProcessos();
      const processosFormatados = processosData.map(p => ({ id: p[0], nome: p[1], tipo: p[2] }));
      setProcessos(processosFormatados);

      carregarResultadosEsperados();
    } catch (error) {
      console.error('Erro ao buscar dados iniciais:', error);
    }
  };

  const carregarResultadosEsperados = async () => {
    try {
      const resultadosData = await getResultadosEsperados();
      const resultadosFormatados = resultadosData.map(r => ({
        id: r[0],
        descricao: r[1],
        idNivelInicio: r[2],
        idNivelFim: r[3],
        idProcesso: r[4]
      }));
      setResultados(resultadosFormatados);
    } catch (error) {
      console.error('Erro ao buscar resultados esperados:', error);
      setResultados([]);
    }
  };

  const adicionarResultadoEsperado = async () => {
    const resultadoData = {
      descricao: novoResultado,
      id_nivel_intervalo_inicio: nivelInicioSelecionado,
      id_nivel_intervalo_fim: nivelFimSelecionado,
      id_processo: processoSelecionado
    };
    try {
      await createResultadoEsperado(resultadoData);
      carregarResultadosEsperados();
      setNovoResultado('');
      setNivelInicioSelecionado('');
      setNivelFimSelecionado('');
      setProcessoSelecionado('');
    } catch (error) {
      console.error('Erro ao adicionar resultado esperado:', error);
    }
  };

  const removerResultadoEsperado = async (id) => {
    try {
      await deleteResultadoEsperado(id);
      carregarResultadosEsperados();
    } catch (error) {
      console.error('Erro ao remover resultado esperado:', error);
    }
  };

  const atualizarResultadoEsperado = async (id, descricao, idNivelInicio, idNivelFim, idProcesso) => {
    const atualizado = {
      nova_descricao: descricao,
      novo_id_nivel_intervalo_inicio: idNivelInicio,
      novo_id_nivel_intervalo_fim: idNivelFim,
      novo_id_processo: idProcesso
    };
    try {
      await updateResultadoEsperado(id, atualizado);
      carregarResultadosEsperados();
    } catch (error) {
      console.error('Erro ao atualizar resultado esperado:', error);
    }
  };

  return (
    <div className="resultados-esperados-container">
      <div className='form-section resultados-esperados-form'>
        <button className="close-button" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className='resultados-esperados-title'>GERENCIAMENTO DE RESULTADOS ESPERADOS</h1>
        <div className='lista-select-input'>
          <div className='input-select-group'>
            <div className='select-wrapper'>
              <select className="select-field" value={nivelInicioSelecionado} onChange={(e) => setNivelInicioSelecionado(e.target.value)}>
                <option value="">Selecione o nível de início</option>
                {niveis.map(n => (
                  <option key={n.id} value={n.id}>{n.nivel}</option>
                ))}
              </select>
            </div>
            <div className='select-wrapper'>
              <select className="select-field" value={nivelFimSelecionado} onChange={(e) => setNivelFimSelecionado(e.target.value)}>
                <option value="">Selecione o nível de fim</option>
                {niveis.map(n => (
                  <option key={n.id} value={n.id}>{n.nivel}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='input-select-group'>
            <div className='select-wrapper'>
              <select className="select-field" value={processoSelecionado} onChange={(e) => setProcessoSelecionado(e.target.value)}>
                <option value="">Selecione o processo</option>
                {processos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
            <div className='input-wrapper'>
              <textarea
                className="input-field"
                type="text"
                placeholder="Novo resultado esperado"
                value={novoResultado}
                onChange={(e) => setNovoResultado(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <div className='logo-and-button'>
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="button" onClick={adicionarResultadoEsperado}>ADICIONAR</button>
        </div>
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
    </div>
  );
}

export default ResultadosEsperados;
