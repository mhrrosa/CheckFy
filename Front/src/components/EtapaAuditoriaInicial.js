import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api';
import '../components/styles/Body.css';
import logo from '../img/logo_horizontal.png';

function AuditEvaluation() {
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

  const handleApprove = () => {
    console.log('Avaliação aprovada');
    // Lógica para aprovar a avaliação
  };

  const handleReject = () => {
    console.log('Avaliação reprovada');
    // Lógica para reprovar a avaliação
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
      }}>AUDITORIA DA AVALIAÇÃO INICIAL</h1>

      <div className="lista-input">
        {[
          { label: "Nome da empresa", value: avaliacao.nome_empresa },
          { label: "Descrição", value: avaliacao.descricao },
          { label: "Status", value: avaliacao.status },
          { label: "Nível Solicitado", value: avaliacao.nivel_solicitado },
          { label: "Nome do Avaliador Líder", value: avaliacao.nome_avaliador_lider },
          { label: "Cronograma", value: avaliacao.cronograma_planejamento },
          { label: "Atividades Planejadas", value: avaliacao.descricao_atividade },
          { label: "Relatório de Ajuste", value: avaliacao.descricao_relatorio_ajuste_inicial },
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
            <span style={{ color: '#333', width: '55%', textAlign: 'left' }}>
              {item.value}
            </span>
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
          onClick={handleApprove}
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
          APROVAR
        </button>
        <button
          onClick={handleReject}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            backgroundColor: '#f44336',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
        >
          REPROVAR
        </button>
      </div>
    </div>
  );
}

export default AuditEvaluation;
