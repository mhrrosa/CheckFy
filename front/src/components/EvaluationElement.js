import React from 'react';
import '../styles/EvaluationElement.css'; // Importando o arquivo CSS

function EvaluationElement({ type, index, value, onChange }) {
  switch (type) {
    case 1: // Texto
      return (
        <input
          className="evaluation-input"
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e, index)}
          placeholder="Digite aqui..."
        />
      );
    case 2: // Checkbox
      return (
        <label className="evaluation-checkbox">
          <input
            className="evaluation-checkbox-input"
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e, index)}
          />
          <span className="evaluation-checkbox-label">Confirmar</span>
        </label>
      );
    case 3: // Botão
      return (
        <button className="evaluation-button" onClick={() => alert('Botão clicado!')}>
          Clique aqui
        </button>
      );
    case 4: // Data
      return (
        <input
          className="evaluation-input"
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e, index)}
        />
      );
    case 5: // Área de texto
      return (
        <textarea
          className="evaluation-textarea"
          value={value || ''}
          onChange={(e) => onChange(e, index)}
          placeholder="Comentário..."
        />
      );
    default:
      return <p>Elemento desconhecido</p>;
  }
}

export default EvaluationElement;