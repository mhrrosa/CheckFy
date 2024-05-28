import React, { useState, useEffect } from 'react';
import { getProcessosPorAvaliacao, getResultadosEsperadosPorProcesso } from '../services/Api';
import '../styles/Etapa3.css';

function Etapa3({ onNext, avaliacaoId }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState([]);
  const [nivelSolicitado, setNivelSolicitado] = useState(null);

  useEffect(() => {
    if (avaliacaoId) {
      carregarDadosIniciais();
    }
  }, [avaliacaoId]);

  const carregarDadosIniciais = async () => {
    try {
      const { nivel_solicitado, processos } = await getProcessosPorAvaliacao(avaliacaoId);
      console.log('Nível Solicitado:', nivel_solicitado);
      setNivelSolicitado(nivel_solicitado);
      setProcessos(processos);
      for (const processo of processos) {
        const resultados = await getResultadosEsperadosPorProcesso(processo.ID);
        console.log(`Resultados Esperados para Processo ${processo.ID}:`, resultados);
        setResultadosEsperados(prev => [...prev, ...resultados]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const handleSelectChange = (e, resultadoId) => {
    const newValue = e.target.value;
    setResultadosEsperados(prevResultados => 
      prevResultados.map(res => 
        res.ID === resultadoId ? { ...res, Grau: newValue } : res
      )
    );
  };

  const handleViewFile = (filepath) => {
    window.open(`http://127.0.0.1:5000/uploads/${filepath}`, '_blank');
  };

  return (
    <div className="etapa3-container">
      {processos.map(processo => (
        <div key={processo.ID} className="processo-section">
          <h2>{processo.Descricao}</h2>
          <ul>
            {resultadosEsperados.filter(re => re.ID_Processo === processo.ID).map(resultado => (
              <li key={resultado.ID}>
                <div className="resultado">
                  <span>{resultado.Descricao}</span>
                  <span>{resultado.Nome_Arquivo}</span>
                  <button onClick={() => handleViewFile(resultado.Caminho_Arquivo)}>Abrir</button>
                  <select 
                    value={resultado.Grau || ''} 
                    onChange={(e) => handleSelectChange(e, resultado.ID)}
                  >
                    <option value="">Selecione</option>
                    <option value="T">Totalmente implementado (T)</option>
                    <option value="L">Largamente implementado (L)</option>
                    <option value="P">Parcialmente implementado (P)</option>
                    <option value="N">Não implementado (N)</option>
                    <option value="NA">Não avaliado (NA)</option>
                    <option value="F">Fora do escopo (F)</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={onNext}>Próxima Etapa</button>
    </div>
  );
}

export default Etapa3;
