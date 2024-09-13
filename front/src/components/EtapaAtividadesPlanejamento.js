import React, { useState, useEffect } from 'react';
import { getAvaliacaoById, inserir_planejamento } from '../services/Api';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaAtividadesPlanejamento.css';

function EtapaAtividadesPlanejamento({ onNext, avaliacaoId }) {
  const [avaliacaoAprovada, setAvaliacaoAprovada] = useState(false);
  const [planejamentoAtividades, setPlanejamentoAtividades] = useState('');
  const [planejamentoCronograma, setPlanejamentoCronograma] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    if (avaliacaoId) {
      carregarAvaliacao();
    }
  }, [avaliacaoId]);

  const carregarAvaliacao = async () => {
    try {
      const data = await getAvaliacaoById(avaliacaoId);
  
      if (data) {
        const isAprovacaoSoftex = data.aprovacao_softex === 1; // Converte 1 para true
        setAvaliacaoAprovada(isAprovacaoSoftex);
        setPlanejamentoAtividades(data.atividade_planejamento || '');
        setPlanejamentoCronograma(data.cronograma_planejamento || '');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
    }
  };
  
  const salvarPlanejamento = async () => {
    try {
      const data = {
        aprovacaoSoftex: avaliacaoAprovada,
        atividadePlanejamento: planejamentoAtividades,
        cronogramaPlanejamento: planejamentoCronograma,
      };

      await inserir_planejamento(avaliacaoId, data);
      alert('Planejamento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o planejamento:', error);
      alert('Erro ao salvar o planejamento. Tente novamente.');
    }
  };

  const handleCheckboxChange = (value) => {
    setAvaliacaoAprovada(value);
  };

  const finalizar = () => {
    navigate('/home'); // Navega para a página inicial
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>PLANEJAMENTO</h1>
      </div>
      <div className='dica-div'>
            <strong className='dica-titulo'>Dica:</strong> {/* Texto de dica mais escuro */}
            <p className='dica-texto'>
            Uma base para estimar o tempo da avaliação inicial, da avaliação final e a composição da equipe sugerida pelo MA-MPS:
            </p>
            <p className='dica-texto'>
            <ul>
                    <li><strong>Níveis A e B:</strong> 4-5 dias, com avaliador líder, adjunto(s) e representante(s) da unidade.</li>
                    <li><strong>Níveis C e D:</strong> 2-4 dias, com avaliador líder, adjunto(s) e opcionalmente representante(s).</li>
                    <li><strong>Níveis E e F:</strong> 2-3 dias, com avaliador líder, adjunto(s) e opcionalmente representante(s).</li>
                    <li><strong>Nível G:</strong> 1-2 dias, com avaliador líder e opcionalmente adjunto(s) e representante(s).</li>
                </ul>
            </p>
        </div>
      <label className="label">Avaliação aprovada pela Softex?</label>
      <div className='checkbox-wrapper-project'>
        <div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={avaliacaoAprovada === true}
              onChange={() => handleCheckboxChange(true)}
            />
            Sim
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={avaliacaoAprovada === false}
              onChange={() => handleCheckboxChange(false)}
            />
            Não
          </label>
        </div>
      </div>

      {/* Exibe os campos de planejamento apenas se a avaliação estiver aprovada */}
      {avaliacaoAprovada && (
        <>

          <label className="label">Atividades para a avaliação:</label>
          <br></br>
          <div className='textarea-wrapper'>
            <label className="label">Planejamento de atividades para a avaliação:</label>
            <p className="dica-text">
              Dica para preencher: dicas
            </p>
            <textarea
              value={planejamentoAtividades}
              onChange={(e) => setPlanejamentoAtividades(e.target.value)}
              rows="4"
              className="input-textarea-avaliacao"
              style={{ marginLeft: 10 , width: 500}}
            ></textarea>
          </div>
          <br></br>

          <label className="label">Cronograma para a avaliação:</label>
          <br></br>
          <div className='textarea-wrapper'>
            <label className="label">Planejamento de cronograma para a avaliação:</label>
            <p className="dica-text">
            Dica para preencher: Uma base para estimar o tempo da avaliação inicial, da avaliação final e a composição da equipe sugerida pelo MA-MPS:
                <ul>
                    <li><strong>Níveis A e B:</strong> 4-5 dias, com avaliador líder, adjunto(s) e representante(s) da unidade.</li>
                    <li><strong>Níveis C e D:</strong> 2-4 dias, com avaliador líder, adjunto(s) e opcionalmente representante(s).</li>
                    <li><strong>Níveis E e F:</strong> 2-3 dias, com avaliador líder, adjunto(s) e opcionalmente representante(s).</li>
                    <li><strong>Nível G:</strong> 1-2 dias, com avaliador líder e opcionalmente adjunto(s) e representante(s).</li>
                </ul>
            </p>
            <textarea
              value={planejamentoCronograma}
              onChange={(e) => setPlanejamentoCronograma(e.target.value)}
              rows="4"
              className="input-textarea-avaliacao"
              style={{ marginLeft: 10, width: 500 }}
            ></textarea>
          </div>
        </>
      )}

      {/* Botão de Salvar sempre visível */}
      <button className='button-next' onClick={salvarPlanejamento}>SALVAR</button>

      {avaliacaoAprovada ? (
        <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
      ) : (
        <button className='button-next' onClick={finalizar}>FINALIZAR</button>
      )}
    </div>
  );
}

export default EtapaAtividadesPlanejamento;