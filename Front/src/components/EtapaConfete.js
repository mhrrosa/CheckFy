import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { getAvaliacaoById } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaConfete.css';
import img_certo from '../img/certo.png';
import { Link } from 'react-router-dom';

function EtapaConfete({ avaliacaoId, idVersaoModelo, onBack }) {
  const [avaliacao, setAvaliacao] = useState(null);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(avaliacaoId);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      }
    };
    fetchAvaliacao();
  }, [avaliacaoId]);

    return (
    <div className="container-etapa">
      <Confetti />
      <h1 className="title-form">AVALIAÇÃO CONCLUÍDA</h1>
      {avaliacao && (
        <div className="avaliacao-detalhes">
          <table className="tabela-confete">
            <tbody>
              <tr>
                <td className="label-etapas"><strong>Empresa avaliada:</strong></td>
                <td>{avaliacao.nome_empresa}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Avaliador líder:</strong></td>
                <td>{avaliacao.nome_avaliador_lider}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Versão do modelo MPS.BR:</strong></td>
                <td>{avaliacao.nome_versao_modelo}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Nível Solicitado:</strong></td>
                <td>{avaliacao.nivel_solicitado}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Resultado:</strong></td>
                <td>
                  <div className='div-resultado-auditoria-confete'>
                    Aprovado
                    <img src={img_certo} className="imagem-certo-errado" alt="certo" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <Link  to="/"><button className="button-sair-avaliacao"><strong>SAIR</strong></button></Link>
    </div>
  );
}

export default EtapaConfete;