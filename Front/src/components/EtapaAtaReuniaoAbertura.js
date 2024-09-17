import React, { useState, useEffect } from 'react';
import { inserirAtaAbertura, atualizarAtaAbertura, getAtaAbertura } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/EtapaRelatorioAjusteInicial.css';
import '../components/styles/Etapas.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaRelatorioAjusteInicial({ onNext, avaliacaoId }) {
  const [ataAbertura, setAtaAbertura] = useState('');
  const [ataExiste, setAtaExiste] = useState(false);
  
  useEffect(() => {
    async function fetchAtaAbertura() {
      try {
        const response = await getAtaAbertura(avaliacaoId);
        if (response.descricao) {
          setAtaAbertura(response.descricao);
          setAtaExiste(true);  // Marca que a ata já existe
        } else if (response.message === "Ata de abertura não encontrada") {
          console.log(response.message);
          setAtaExiste(false);  // Marca que a ata não existe ainda
        }
      } catch (error) {
        console.error('Erro ao buscar a ata de abertura:', error);
      }
    }

    fetchAtaAbertura();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!ataAbertura) {
      alert('Por favor, preencha a ata de abertura ou anexe um arquivo.');
      return;
    }

    const data = { descricao: ataAbertura, idAvaliacao: avaliacaoId };

    if (ataExiste) {
      await atualizarAtaAbertura(data);
      alert('Ata de abertura atualizada com sucesso!');
    } else {
      await inserirAtaAbertura(data);
      alert('Ata de abertura inserida com sucesso!');
      setAtaExiste(true);
    }
  };

  const proximaEtapa = async () => {
    if (!ataAbertura) {
      alert('Por favor, preencha a ata de abertura antes de continuar.');
      return;
    }

    onNext();
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>ATA DE REUNIÃO DE ABERTURA DA AVALIAÇÃO FINAL</h1>
      <div className='dica-div'>
        <strong className='dica-titulo'>Dica: </strong>
        <p className='dica-texto'>
          A ata da reunião deve descrever como foi o andamento da reunião de abertura da avaliação final.
        </p>
      </div>
      
      <div className="input-wrapper">
        <label className="label">ATA DE REUNIÃO DE ABERTURA:</label>
        <textarea
          style={{ marginLeft: 10, width: 500 , height: 100}}
          value={ataAbertura}
          onChange={(e) => setAtaAbertura(e.target.value)}
          placeholder="Descreva como foi o andamento da reunião e seus pontos importantes."
        />
      </div>
      <button className='button-next' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={proximaEtapa}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaRelatorioAjusteInicial;
