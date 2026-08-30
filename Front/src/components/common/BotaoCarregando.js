import React from 'react';

function BotaoCarregando({ className, onClick, loading, disabled, loadingText, children, ...rest }) {
  return (
    <button className={className} onClick={onClick} disabled={loading || disabled} {...rest}>
      {loading ? (
        <span className="botao-carregando-conteudo">
          <span className="spinner-botao" />
          {loadingText && <span>{loadingText}</span>}
        </span>
      ) : children}
    </button>
  );
}

export default BotaoCarregando;
