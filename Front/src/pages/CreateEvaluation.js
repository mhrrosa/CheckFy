import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startNewEvaluation, getNiveis, getVersaoModelo } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../pages/styles/CreateEvaluation.css';
import logo from '../img/logo_horizontal.png';

function CreateEvaluation() {
  const [companyName, setCompanyName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nivelSolicitado, setNivelSolicitado] = useState('');
  const [niveis, setNiveis] = useState([]);
  const [adjuntoEmails, setAdjuntoEmails] = useState(['']);
  const [colaboradorEmails, setColaboradorEmails] = useState(['']);
  const [versoesModelo, setVersoesModelo] = useState([]);
  const [idVersaoModelo, setIdVersaoModelo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (idVersaoModelo) {
      carregarNiveis(idVersaoModelo);
    }
  }, [idVersaoModelo]);

  const carregarDadosIniciais = async () => {
    try {
      const versoesData = await getVersaoModelo();
      const versoesFormatadas = versoesData.map(v => ({ id: v[0], nome: v[1] }));
      setVersoesModelo(versoesFormatadas);

      if (versoesFormatadas.length > 0) {
        const versaoId = versoesFormatadas[0].id;
        setIdVersaoModelo(versaoId);
      }
    } catch (error) {
      console.error('Erro ao buscar dados iniciais:', error);
    }
  };

  const carregarNiveis = async (versaoId) => {
    try {
      const niveisData = await getNiveis(versaoId);
      const niveisFormatados = niveisData.map(n => ({ id: n[0], nivel: n[1] }));
      setNiveis(niveisFormatados);
    } catch (error) {
      console.error('Erro ao buscar níveis:', error);
    }
  };

  const handleStartEvaluation = async (event) => {
    event.preventDefault(); // Adicionado para prevenir o comportamento padrão do botão de formulário
  
    const data = {
      companyName,
      descricao,
      nivelSolicitado,
      adjuntoEmails,
      colaboradorEmails,
      idVersaoModelo
    };
    try {
      const response = await startNewEvaluation(data);
      navigate('/', { state: { setup: response } });
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
    <div className="container">
      <form className="form-create-evaluation">
        <button className="button-close-form" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className="title-form">CRIAR AVALIAÇÃO</h1>
        <div className="lista-input">
          <div className="input-wrapper">
            <label className="label">Nome da empresa:</label>
            <input
              className="input-field"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Digite o nome da empresa"
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
            <label className="label">Versão do Modelo:</label>
            <select
              className="input-field"
              value={idVersaoModelo}
              onChange={(e) => setIdVersaoModelo(e.target.value)}
            >
              {versoesModelo.map(v => (
                <option key={v.id} value={v.id}>{v.nome}</option>
              ))}
            </select>
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
              <label className="label">Email Avaliador Adjunto:</label>
              <div className="input-group">
                <input
                  className="input-field-email"
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value, setAdjuntoEmails)}
                  placeholder="Digite o email do avaliador adjunto"
                />
                <button className="button-add-email" type="button" onClick={() => addEmail(setAdjuntoEmails)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="6" x2="12" y2="18"></line>
                    <line x1="6" y1="12" x2="18" y1="12"></line>
                  </svg>
                </button>
              </div>
              {adjuntoEmails.length > 1 && (
                <button className="button-remove-email" type="button" onClick={() => removeEmail(index, setAdjuntoEmails)}>REMOVER</button>
              )}
            </div>
          ))}
          {colaboradorEmails.map((email, index) => (
            <div key={index} className="input-wrapper">
              <label className="label">Email Colaborador Empresarial:</label>
              <div className="input-group">
                <input
                  className="input-field-email"
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value, setColaboradorEmails)}
                  placeholder="Digite o email do colaborador empresarial"
                />
                <button className="button-add-email" type="button" onClick={() => addEmail(setColaboradorEmails)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="6" x2="12" y2="18"></line>
                    <line x1="6" y1="12" x2="18" y1="12"></line>
                  </svg>
                </button>
              </div>
              {colaboradorEmails.length > 1 && (
                <button className="button-remove-email" type="button" onClick={() => removeEmail(index, setColaboradorEmails)}>REMOVER</button>
              )}
            </div>
          ))}
        </div>
        <div className='logo-and-button'>
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="form-end-button" onClick={handleStartEvaluation}>ADICIONAR</button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvaluation;