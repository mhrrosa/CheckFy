import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAvaliacoes, deleteAvaliacao, getAvaliacaoById } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../pages/styles/Home.css';

function Home() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      const data = await getAllAvaliacoes();
      console.log('Avaliações carregadas:', data);
      setAvaliacoes(data);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAvaliacao(id);
      carregarAvaliacoes(); // Recarregar avaliações após a exclusão
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
    }
  };

  const handleContinue = async (id) => {
    try {
      const avaliacao = await getAvaliacaoById(id);
      console.log('Navegando para avaliação com os dados:', avaliacao); // Adicionando log para verificar os dados na navegação
      navigate('/evaluation', { state: { id: avaliacao.id, idAtividade: avaliacao.id_atividade } });
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
    }
  };

  return (
    <div className="container">
      <div className="botoes-home-gerenciamento">
        <Link to="/create-evaluation" className="button-home-gerenciamento">NOVA AVALIAÇÃO</Link>
        <Link to="/gerenciamento-anos" className="button-home-gerenciamento">GERENCIAMENTO</Link> {/* Ajuste esta linha */}
      </div>
      <div className="avaliacoes-lista">
        <p className='title-avaliacoes-criadas'>Avaliações cadastradas:</p>
        {avaliacoes.length > 0 ? (
          avaliacoes.map(avaliacao => (
            <div key={avaliacao.id} className="avaliacao-item">
              <p>{avaliacao.nome} - {avaliacao.status}</p>
              <div className="botoes-avaliacao">
                <button className="button-home-avaliacao" onClick={() => handleContinue(avaliacao.id)}>
                  CONTINUAR
                </button>
                <button className="button-home-avaliacao" onClick={() => navigate(`/update-evaluation`, { state: { id: avaliacao.id } })}>
                  ALTERAR
                </button>
                <button className="button-home-avaliacao" onClick={() => handleDelete(avaliacao.id)}>
                  EXCLUIR
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma avaliação encontrada</p>
        )}
      </div>
    </div>
  );
}

export default Home;