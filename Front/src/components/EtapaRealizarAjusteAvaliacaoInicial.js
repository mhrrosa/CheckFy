import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById, updateEmpresaAjusteAvaliacaoInicial, updateAvaliacaoAjusteInicial, updateRelatorioAjusteAvaliacaoInicial } from '../services/Api'; // Funções de atualização do backend
import '../components/styles/Body.css';
import logo from '../img/logo_horizontal.png';

function EtapaAuditoriaEdicao({ onBack }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    nome_empresa: '',
    descricao: '',
    status: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    nome_avaliador_lider: '',
    cronograma_planejamento: '',
    atividade_planejamento: '',
    descricao_relatorio_ajuste_inicial: ''
  });
  const [isSaving, setIsSaving] = useState(false); // Controle de múltiplas submissões

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const salvarEmpresa = async () => {
    setIsSaving(true);
    try {
      await updateEmpresaAjusteAvaliacaoInicial(avaliacao.id_empresa, { nome: avaliacao.nome_empresa });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      alert('Erro ao salvar empresa.');
    } finally {
      setIsSaving(false);
    }
  };

  const salvarAvaliacao = async () => {
    setIsSaving(true);
    try {
      await updateAvaliacaoAjusteInicial(location.state.id, {
        descricao: avaliacao.descricao,
        cronograma_planejamento: avaliacao.cronograma_planejamento,
        atividade_planejamento: avaliacao.atividade_planejamento
      });
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert('Erro ao salvar avaliação.');
    } finally {
      setIsSaving(false);
    }
  };

  const salvarRelatorio = async () => {
    setIsSaving(true);
    try {
      await updateRelatorioAjusteAvaliacaoInicial(location.state.id, {
        descricao: avaliacao.descricao_relatorio_ajuste_inicial
      });
      alert("Dados salvos com sucesso");
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      alert('Erro ao salvar relatório.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSalvar = async () => {
    await salvarEmpresa();
    await salvarAvaliacao();
    await salvarRelatorio();
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: 'auto'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
      }}>EDIÇÃO DA AVALIAÇÃO</h1>

      <div className="lista-input">
        {/* Nome da Empresa */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Nome da empresa:</label>
          <input
            type="text"
            value={avaliacao.nome_empresa}
            onChange={(e) => setAvaliacao({ ...avaliacao, nome_empresa: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Descrição:</label>
          <input
            type="text"
            value={avaliacao.descricao}
            onChange={(e) => setAvaliacao({ ...avaliacao, descricao: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>

        {/* Status - Não alterável */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Status:</label>
          <span style={{ width: '55%' }}>{avaliacao.status}</span>
        </div>

        {/* Nível Solicitado */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Nível solicitado:</label>
          <span style={{ width: '55%' }}>{avaliacao.nivel_solicitado}</span>
        </div>

        {/* Nome do Avaliador Líder - Não alterável */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Nome do Avaliador Líder:</label>
          <span style={{ width: '55%' }}>{avaliacao.nome_avaliador_lider}</span>
        </div>

        {/* Cronograma Planejamento */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Cronograma:</label>
          <textarea
            value={avaliacao.cronograma_planejamento}
            onChange={(e) => setAvaliacao({ ...avaliacao, cronograma_planejamento: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>

        {/* Atividades Planejadas */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Atividades Planejadas:</label>
          <textarea
            value={avaliacao.atividade_planejamento}
            onChange={(e) => setAvaliacao({ ...avaliacao, atividade_planejamento: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>

        {/* Relatório de Ajuste */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>Relatório de Ajuste:</label>
          <textarea
            value={avaliacao.descricao_relatorio_ajuste_inicial}
            onChange={(e) => setAvaliacao({ ...avaliacao, descricao_relatorio_ajuste_inicial: e.target.value })}
            style={{ width: '55%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <img src={logo} alt="Logo Checkfy" style={{ height: '50px' }} />
        <button
          onClick={handleSalvar}
          className='button-next'
          disabled={isSaving} // Desabilitar o botão enquanto salva
        >
          SALVAR
        </button>
        <button
          onClick={onBack}
          className='button-next'
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default EtapaAuditoriaEdicao;