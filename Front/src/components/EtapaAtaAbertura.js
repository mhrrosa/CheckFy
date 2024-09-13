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
      
      <br></br>
        <div style={{
            backgroundColor: '#e0e0e0', // Fundo mais escuro para maior contraste
            borderLeft: '4px solid #a0a0a0', // Borda levemente destacada
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
        }}>
            <strong style={{ color: '#555' }}>Dica:</strong> {/* Texto de dica mais escuro */}
            <p style={{ color: '#333', margin: '5px 0' }}>
            1 - Avaliador Líder: Apresentou os níveis MR-MPS e o processo de avaliação. Explicou o Acordo de Confidencialidade, escopo e nível de maturidade pleiteado.
            </p>
            <p style={{ color: '#333', margin: '5px 0' }}>
            2 - Patrocinador: Reforçou o motivo da avaliação e a importância do apoio dos colaboradores. Destacou a prioridade de respeitar horários e ser sincero nas entrevistas.
            </p>
            <p style={{ color: '#333', margin: '5px 0' }}>
            3 - Cronograma: O cronograma da avaliação foi apresentado e todos os participantes foram informados dos momentos de suas contribuições.
            </p>
            <p style={{ color: '#333', margin: '5px 0' }}>
            4 - Presença: Todos os colaboradores entrevistados devem estar presentes. Ausentes por força maior serão informados no início de suas entrevistas.
            </p>
        </div>
        <label className="label">Ata de Reunião:</label>
        <br></br>
        <div className='textarea-wrapper'>
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
