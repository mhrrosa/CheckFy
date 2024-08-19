import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Button.css';
import '../pages/styles/detailsEvaluation.css';
import logo from '../img/logo_horizontal.png';

function DetailsEvaluation() {
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
    id_versao_modelo: ''
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

  return (
    <div className="container">
        <form className="form-details-evaluation">
            <button className="button-close-form" type="button" onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </button>
            <h1 className="title-form">DETALHES DA AVALIAÇÃO</h1>
            <div className="lista-input">
                <div className="input-wrapper">
                    <label className="label">Nome da empresa:</label>
                    <input
                        className="input-field"
                        type="text"
                        name="nome"
                        value={avaliacao.nome}
                        readOnly
                    />
                    </div>
                    <div className="input-wrapper">
                    <label className="label">Descrição:</label>
                    <textarea
                        className="input-field"
                        name="descricao"
                        value={avaliacao.descricao}
                        readOnly
                    />
                    </div>
                    <div className="input-grid">
                    <div className="input-wrapper">
                        <label className="label">ID da Empresa:</label>
                        <input
                        className="input-field"
                        type="text"
                        name="id_empresa"
                        value={avaliacao.id_empresa}
                        readOnly
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="label">ID do Nível Solicitado:</label>
                        <input
                        className="input-field"
                        type="text"
                        name="id_nivel_solicitado"
                        value={avaliacao.id_nivel_solicitado}
                        readOnly
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="label">ID do Avaliador Líder:</label>
                        <input
                        className="input-field"
                        type="text"
                        name="id_avaliador_lider"
                        value={avaliacao.id_avaliador_lider}
                        readOnly
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="label">ID da Atividade:</label>
                        <input
                        className="input-field"
                        type="text"
                        name="id_atividade"
                        value={avaliacao.id_atividade}
                        readOnly
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="label">ID da Versão do Modelo:</label>
                        <input
                        className="input-field"
                        type="text"
                        name="id_versao_modelo"
                        value={avaliacao.id_versao_modelo}
                        readOnly
                        />
                    </div>
                    </div>
                <div className="logo-and-button">
                <img src={logo} className="logo" alt="Logo Checkfy" />
                <button className="button-end-form" type="button" onClick={() => navigate('/')}>VOLTAR</button>
                </div>
            </div>
        </form>
    </div>
  );
}

export default DetailsEvaluation;