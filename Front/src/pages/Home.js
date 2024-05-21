import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAvaliacoes, deleteAvaliacao, getAvaliacaoById } from '../services/Api';
import '../styles/Home.css';

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
    <div className="home-container">
      <div className="botoes-home">
        <Link to="/create-evaluation" className="botao-home">NOVA AVALIAÇÃO</Link>
        <Link to="/modelo" className="botao-home">GUIA DO MPS.BR</Link>
      </div>
      <div className="avaliacoes-lista">
        <p>Avaliações criadas:</p>
        {avaliacoes.length > 0 ? (
          avaliacoes.map(avaliacao => (
            <div key={avaliacao.id} className="avaliacao-item">
              <p>{avaliacao.nome} - {avaliacao.status}</p>
              <div className="botoes-avaliacao">
                <button onClick={() => handleContinue(avaliacao.id)}>
                  Continuar
                </button>
                <button onClick={() => navigate(`/update-evaluation`, { state: { id: avaliacao.id } })}>
                  Alterar
                </button>
                <button onClick={() => handleDelete(avaliacao.id)}>
                  Excluir
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