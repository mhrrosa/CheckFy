import React, { useState, useEffect } from 'react';
import { getProjetosByAvaliacao, inserir_planejamento } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapa2.css';
import logo from '../img/logo_horizontal.png';

function EtapaAtividadesPlanejamento({ onNext, avaliacaoId }) {
  const [avaliacaoAprovada, setAvaliacaoAprovada] = useState(false);
  const [planejamentoAtividades, setPlanejamentoAtividades] = useState('');
  const [planejamentoCronograma, setPlanejamentoCronograma] = useState('');
  
  useEffect(() => {
    if (avaliacaoId) {
      carregarProjetos();
    }
  }, [avaliacaoId]);

  const carregarProjetos = async () => {
    try {
      console.log('Carregando dados para a avaliação ID:', avaliacaoId);
      const data = await getProjetosByAvaliacao(avaliacaoId);
      console.log('Dados recebidos da API:', data);
      
      if (data) {
        console.log('Avaliacao Aprovada (antes):', data.avaliacaoAprovada);
        setAvaliacaoAprovada(data.avaliacaoAprovada !== null ? data.avaliacaoAprovada : false);
        console.log('Avaliacao Aprovada (depois):', avaliacaoAprovada);

        console.log('Planejamento Atividades (antes):', data.atividade_planejamento);
        setPlanejamentoAtividades(data.atividade_planejamento || '');
        console.log('Planejamento Atividades (depois):', planejamentoAtividades);

        console.log('Planejamento Cronograma (antes):', data.cronograma_planejamento);
        setPlanejamentoCronograma(data.cronograma_planejamento || '');
        console.log('Planejamento Cronograma (depois):', planejamentoCronograma);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
    }
  };

  const salvarPlanejamento = async () => {
    try {
      const data = {
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
    console.log('Checkbox atualizado para:', value);
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>Planejamento</h1>
      </div>
      <label className="label">Avaliação aprovada pela Softex?</label>
      <div className='checkbox-wrapper-project'>
        <div>
          <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={avaliacaoAprovada === true}
              onChange={() => handleCheckboxChange(true)}
            />
            Sim
          </label>
          <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={avaliacaoAprovada === false}
              onChange={() => handleCheckboxChange(false)}
            />
            Não
          </label>
        </div>
      </div>

      {avaliacaoAprovada === true && (
        <>
          <div className='textarea-wrapper'>
            <label className="label">Planejamento de atividades para a avaliação:</label>
            <p className="dica-text" style={{ color: 'grey', marginLeft: 10, fontSize: 13 }}>
              Dica para preencher: dicas
            </p>
            <textarea
              value={planejamentoAtividades}
              onChange={(e) => setPlanejamentoAtividades(e.target.value)}
              rows="4"
              className="textarea"
              style={{ marginLeft: 10 , width: 500}}
            ></textarea>
          </div>
          <br></br>
          <div className='textarea-wrapper'>
            <label className="label">Planejamento de cronograma para a avaliação:</label>
            <p className="dica-text" style={{ color: 'white', marginLeft: 10, fontSize: 13 }}>
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
              className="textarea"
              style={{ marginLeft: 10, width: 500 }}
            ></textarea>
          </div>

          {/* Botão de Salvar */}
          <button className='button-save' onClick={salvarPlanejamento}>SALVAR PLANEJAMENTO</button>

          <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
        </>
      )}
    </div>
  );
}

export default EtapaAtividadesPlanejamento;