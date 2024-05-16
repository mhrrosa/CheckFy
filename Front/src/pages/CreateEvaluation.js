import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startNewEvaluation, submitEvaluationData, getProcessos, createProcesso, updateProcesso, deleteProcesso } from '../services/Api';
import '../styles/CreateEvaluation.css'; // Certifique-se de que o caminho está correto

function CreateEvaluation() {
  const [companyName, setCompanyName] = useState('');
  const [adjuntoEmails, setAdjuntoEmails] = useState(['']);
  const [colaboradorEmails, setColaboradorEmails] = useState(['']);
  const navigate = useNavigate();

  function handleStartEvaluation() {
    const data = {
      companyName,
      adjuntoEmails,
      colaboradorEmails
    };
    startNewEvaluation(data).then((response) => {
      navigate('/evaluation', { state: { setup: response } });
    });
  }

  function addEmail(setEmails) {
    setEmails(currentEmails => [...currentEmails, '']);
  }

  function updateEmail(index, value, setEmails) {
    setEmails(currentEmails => currentEmails.map((email, idx) => idx === index ? value : email));
  }

  function removeEmail(index, setEmails) {
    setEmails(currentEmails => currentEmails.filter((_, idx) => idx !== index));
  }

  return (
    <div className="create-evaluation-container">
      <h1 className="create-evaluation-title">Criar Avaliação</h1>
      <div className="form-section">
        <div className="input-wrapper">
          <label className="label">Nome da Empresa:</label>
          <input
            className="input-field"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Digite o nome da empresa"
          />
        </div>
        {adjuntoEmails.map((email, index) => (
          <div key={index} className="input-wrapper">
            <div className="input-group">
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value, setAdjuntoEmails)}
                placeholder="Digite o email"
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
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value, setColaboradorEmails)}
                placeholder="Digite o email"
              />
              {colaboradorEmails.length > 1 && (
                <button className="remove-button" type="button" onClick={() => removeEmail(index, setColaboradorEmails)}>Remover</button>
              )}
            </div>
          </div>
        ))}
        <button className="add-button" type="button" onClick={() => addEmail(setColaboradorEmails)}>Adicionar outro email de Colaborador Empresarial</button>

        <button className="button" onClick={handleStartEvaluation}>Iniciar Avaliação</button>
      </div>
    </div>
  );
}

export default CreateEvaluation;