import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvaliacaoById, atualizarAvaliacao, enviarEmailRelatorioAjusteInicial } from '../services/Api';
import '../components/styles/Body.css';
import logo from '../img/logo_horizontal.png';

function EtapaRealizarAjusteAvaliacaoInicial() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState({
    nome: '',
    descricao: '',
    status: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    id_avaliador_lider: '',
    id_atividade: '',
    id_versao_modelo: '',
    relatorio_ajuste: ''
  });

  const [isEditable, setIsEditable] = useState(false);

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

  const handleInputChange = (e, field) => {
    setAvaliacao({ ...avaliacao, [field]: e.target.value });
  };

  const salvarDados = async () => {
    try {
      await atualizarAvaliacao(location.state.id, avaliacao);
      alert('Avaliação atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar a avaliação:', error);
    }
  };

  const proximaEtapa = async () => {
    if (window.confirm('Ao confirmar, será enviado um e-mail para o auditor realizar a auditoria. Deseja continuar?')) {
      try {
        await enviarEmailRelatorioAjusteInicial(location.state.id);
        alert('E-mail enviado com sucesso!');
        navigate('/proxima-etapa');
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Ocorreu um erro ao enviar o e-mail.');
      }
    }
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
      }}>AJUSTE DA AVALIAÇÃO INICIAL</h1>

      <div className="lista-input">
        {[
          { label: "Nome da empresa", field: "nome_empresa" },
          { label: "Descrição", field: "descricao" },
          { label: "Status", field: "status" },
          { label: "Nível Solicitado", field: "nivel_solicitado" },
          { label: "Nome do Avaliador Líder", field: "nome_avaliador_lider" },
          { label: "Cronograma", field: "cronograma_planejamento", type: 'textarea' },
          { label: "Atividades Planejadas", field: "descricao_atividade", type: 'textarea' },
          { label: "Relatório de Ajuste", field: "descricao_relatorio_ajuste_inicial", type: 'textarea' }
        ].map((item, index) => (
          <div key={index} style={{
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{ fontWeight: 'bold', color: '#666', width: '45%' }}>
              {item.label}:
            </label>
            {item.type === 'textarea' ? (
              <textarea
                value={avaliacao[item.field] || ''}
                onChange={(e) => handleInputChange(e, item.field)}
                style={{ color: '#333', width: '55%', textAlign: 'left', minHeight: '80px' }}
              />
            ) : (
              <input
                type="text"
                value={avaliacao[item.field] || ''}
                onChange={(e) => handleInputChange(e, item.field)}
                style={{ color: '#333', width: '55%', textAlign: 'left' }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <img src={logo} alt="Logo Checkfy" style={{ height: '50px' }} />
        <button
          onClick={salvarDados}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            backgroundColor: '#4CAF50',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          SALVAR
        </button>
        <button
          onClick={proximaEtapa}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            backgroundColor: '#2196F3',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default EtapaRealizarAjusteAvaliacaoInicial;
