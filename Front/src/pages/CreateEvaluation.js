import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startNewEvaluation, getNiveis } from '../services/Api';
import '../styles/CreateEvaluation.css';
import logo from '../img/logo_horizontal.png';

function CreateEvaluation() {
  const [companyName, setCompanyName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nivelSolicitado, setNivelSolicitado] = useState('');
  const [niveis, setNiveis] = useState([]);
  const [adjuntoEmails, setAdjuntoEmails] = useState(['']);
  const [colaboradorEmails, setColaboradorEmails] = useState(['']);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      const niveisData = await getNiveis();
      const niveisFormatados = niveisData.map(n => ({ id: n[0], nivel: n[1] }));
      setNiveis(niveisFormatados);
    } catch (error) {
      console.error('Erro ao buscar dados iniciais:', error);
    }
  };

  const handleStartEvaluation = async () => {
    const data = {
      companyName,
      descricao,
      nivelSolicitado,
      adjuntoEmails,
      colaboradorEmails
    };
    try {
      const response = await startNewEvaluation(data);
      navigate('/evaluation', { state: { setup: response } });
    } catch (error) {
      console.error('Erro ao iniciar avaliação:', error);
    }
  };

  const addEmail = (setEmails) => {
    setEmails(currentEmails => [...currentEmails, '']);
  };

  const updateEmail = (index, value, setEmails) => {
    setEmails(currentEmails => currentEmails.map((email, idx) => idx === index ? value : email));
  };

  const removeEmail = (index, setEmails) => {
    setEmails(currentEmails => currentEmails.filter((_, idx) => idx !== index));
  };

  return (
    <div className="create-evaluation-container">
      <div className="form-section">
        <button className="close-button" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className="create-evaluation-title">CRIAR AVALIAÇÃO</h1>
        <div className="lista-input">
          <div className="input-wrapper">
            <label className="label">Nome:</label>
            <input
              className="input-field"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Digite o nome da avaliação"
            />
          </div>
          <div className="input-wrapper">
            <label className="label">Descrição:</label>
            <input
              className="input-field"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição da avaliação"
            />
          </div>
          <div className="input-wrapper">
            <label className="label">Nível Solicitado:</label>
            <select
              className="input-field"
              value={nivelSolicitado}
              onChange={(e) => setNivelSolicitado(e.target.value)}
            >
              <option value="">Selecione o Nível</option>
              {niveis.map(n => (
                <option key={n.id} value={n.id}>{n.nivel}</option>
              ))}
            </select>
          </div>
          {adjuntoEmails.map((email, index) => (
            <div key={index} className="input-wrapper">
              <div className="input-group">
                <label className="label">Email Avaliador Adjunto:</label>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value, setAdjuntoEmails)}
                  placeholder="Digite o email do avaliador adjunto"
                />
                {adjuntoEmails.length > 1 && (
                  <button className="remove-button" type="button" onClick={() => removeEmail(index, setAdjuntoEmails)}>Remover</button>
                )}
              </div>
            </div>
          ))}
          <button className="add-button" type="button" onClick={() => addEmail(setAdjuntoEmails)}>Adicionar outro email de Avaliador Adjunto</button>
          {colaboradorEmails.map((email, index) => (
            <div key={index} className="input-wrapper">
              <div className="input-group">
                <label className="label">Email Colaborador Empresarial:</label>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value, setColaboradorEmails)}
                  placeholder="Digite o email do colaborador empresarial"
                />
                {colaboradorEmails.length > 1 && (
                  <button className="remove-button" type="button" onClick={() => removeEmail(index, setColaboradorEmails)}>Remover</button>
                )}
              </div>
            </div>
          ))}
          <button className="add-button" type="button" onClick={() => addEmail(setColaboradorEmails)}>Adicionar outro email de Colaborador Empresarial</button>
        </div>
        <div className='logo-and-button'>
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="button" onClick={handleStartEvaluation}>CRIAR</button>
        </div>
      </div>
    </div>
  );
}

export default CreateEvaluation;