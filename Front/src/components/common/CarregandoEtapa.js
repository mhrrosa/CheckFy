import React from 'react';

function CarregandoEtapa({ texto = 'Carregando...' }) {
  return (
    <div className="carregando-etapa">
      <span className="spinner-botao spinner-grande" />
      <p>{texto}</p>
    </div>
  );
}

export default CarregandoEtapa;
