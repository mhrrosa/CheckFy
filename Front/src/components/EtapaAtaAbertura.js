import React, { useState, useEffect } from 'react';
import { getAvaliacaoById, inserir_ata_reuniao } from '../services/Api';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/EtapaAtividadesPlanejamento.css';

function AtaReuniaoAbertura({onNext, avaliacaoId }) {
  const [ataReuniao, setAtaReuniao] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (avaliacaoId) {
      carregarAtaReuniao();
    }
  }, [avaliacaoId]);

  const carregarAtaReuniao = async () => {
    try {
      const data = await getAvaliacaoById(avaliacaoId);
  
      if (data) {
        setAtaReuniao(data.ata_reuniao_abertura || '');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da ata de reunião:', error);
    }
  };
  
  const salvarAtaReuniao = async () => {
    try {
      const data = {
        ataReuniao: ataReuniao,
      };

      await inserir_ata_reuniao(avaliacaoId, data);
      alert('Ata de reunião salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar a ata de reunião:', error);
      alert('Erro ao salvar a ata de reunião. Tente novamente.');
    }
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>ATA DE REUNIÃO DE ABERTURA DA AVALIAÇÃO FINAL</h1>
      </div>
      
      <div className='textarea-wrapper'>
        <label className="label">Ata de Reunião:</label>
        <p className="dica-text">
          Dica para preencher: adicionar dica
        </p>
        <textarea
          value={ataReuniao}
          onChange={(e) => setAtaReuniao(e.target.value)}
          rows="4"
          className="textarea"
          style={{ marginLeft: 10, width: 500 }}
        ></textarea>
      </div>

      <button className='button-next' onClick={salvarAtaReuniao}>SALVAR</button>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default AtaReuniaoAbertura;
