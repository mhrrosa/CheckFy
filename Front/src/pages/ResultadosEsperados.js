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
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../pages/styles/ResultadosEsperados.css';
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
      const resultadosFormatados = resultadosData.map(r => {
        const [id, descricao, idNivelFim, idNivelInicio, idProcesso] = r;
        return {
          id,
          descricao,
          idNivelInicio,
          idNivelFim,
          idProcesso
        };
      });
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
    <div className="container">
      <div className='form-resultados-esperados'>
        <button className="button-close-form" onClick={() => navigate('/modelo')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className='title-form'>GERENCIAMENTO DE RESULTADOS ESPERADOS</h1>
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
          <button className="button-end-form" onClick={adicionarResultadoEsperado}>ADICIONAR</button>
        </div>
        <p className="resultados-esperados-cadastrados-title">RESULTADOS ESPERADOS CADASTRADOS:</p>
        {resultados.length > 0 ? (
          <table>
            <tbody>
              {resultados.map(resultado => (
                <tr key={resultado.id}>
                  <td className='nome-inserido-td'>
                    <textarea
                      className='textarea-preenchido'
                      type="text"
                      value={resultado.descricao}
                      onChange={(e) => {
                        const novaDescricao = e.target.value;
                        setResultados(resultados.map(r => (r.id === resultado.id ? { ...r, descricao: novaDescricao } : r)));
                      }}
                    >
                    </textarea>
                  </td>
                  <td className='td-nivel-preenchido'>
                    <select
                      className='select-preenchido'
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
                  <td className='td-nivel-preenchido'>
                    <select
                      className='select-preenchido'
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
                  <td className='processo-inserido-td'>
                    <select
                      className='select-preenchido'
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
                  <td className='acoes-td'>
                    <button className='button-acao'
                      onClick={() => atualizarResultadoEsperado(resultado.id, resultado.descricao, resultado.idNivelInicio, resultado.idNivelFim, resultado.idProcesso)}
                    >
                      ATUALIZAR
                    </button>
                    <button className='button-acao' onClick={() => removerResultadoEsperado(resultado.id)}
                    >
                      REMOVER
                    </button>
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