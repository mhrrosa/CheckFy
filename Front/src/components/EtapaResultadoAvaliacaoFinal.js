import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api';
import '../components/styles/EtapaAtribuirNivelMaturidade.css'; // Usando o mesmo estilo para consistência
import logo from '../img/logo_horizontal.png';

function EtapaResultadoAvaliacaoFinal({ onNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    nivel_solicitado: '',
    resultado: '',
    parecer_final: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      setIsLoading(true);
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao({
          ...data,
          resultado: data.nivel_solicitado, // Preenchendo o resultado com o nível solicitado
          parecer_final: data.parecer_final || 'Não informado' // Preenche o parecer final se vier da API
        });
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  return (
    <div className="container-etapa">
      <h1 className="title">RESULTADO DA AVALIAÇÃO FINAL</h1>

      <div className="tip">
        <strong>Dica:</strong>
        <p>
          Por favor, confirme a visualização do resultado final da avaliação para que a equipe
          possa prosseguir com os próximos passos do processo.
        </p>
      </div>

      <div className="row">
        <label className="label">Nome da Empresa Avaliada:</label>
        <span className="value">{avaliacao.nome_empresa}</span>
      </div>

      <div className="row">
        <label className="label">Nível Solicitado:</label>
        <span className="value">{avaliacao.nivel_solicitado}</span>
      </div>

      {/* Exibindo o campo de parecer final (Satisfeito/Não Satisfeito) */}
      <div className="row">
        <label className="label">Resultado Final:</label>
        <span className="value">{avaliacao.parecer_final}</span>
      </div>

      {/* Campo não editável para o resultado final */}
      <div className="row">
        <label className="label">Resultado da Avaliação (Nível):</label>
        <span className="value">{avaliacao.resultado}</span>
      </div>

      {/* Botão para confirmar visualização e avançar */}
      <div className="buttonContainer">
        <img src={logo} alt="Logo Checkfy" style={{ height: '50px' }} />
        <button
          onClick={onNext}
          className="button-next"
          disabled={isLoading}
        >
          CONFIRMAR VISUALIZAÇÃO
        </button>
      </div>
    </div>
  );
}

export default EtapaResultadoAvaliacaoFinal;
