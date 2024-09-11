import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAvaliacoes, deleteAvaliacao, getAvaliacaoById } from '../services/Api';
import { UserContext } from '../contexts/UserContext'; // Importe o UserContext
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../pages/styles/Home.css';

function Home() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const { userType, setUserType } = useContext(UserContext); // Use o contexto
  const [isLoading, setIsLoading] = useState(true); // Novo estado para carregamento
  const navigate = useNavigate();

  useEffect(() => {    
    const storedUserType = localStorage.getItem('userType');

    if (storedUserType) {
      setUserType(parseInt(storedUserType));
    }

    const userId = sessionStorage.getItem('userId');

    setIsLoading(false); // Após carregar, define isLoading como falso
    carregarAvaliacoes();
  }, [setUserType]);

  const carregarAvaliacoes = async () => {
    const userId = sessionStorage.getItem('userId');  // Obtém o userId do sessionStorage
    try {
      const data = await getAllAvaliacoes(userId);  // Passa o userId para a API
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
      navigate('/evaluation', { state: { id: avaliacao.id, idAtividade: avaliacao.id_atividade } });
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
    }
  };

  const handleUserChange = (event) => {
    const selectedUserType = parseInt(event.target.value);
    setUserType(selectedUserType); // Atualiza o tipo de usuário no contexto
    localStorage.setItem('userType', selectedUserType); // Salva no localStorage
  };

  if (isLoading) {
    return <p>Carregando...</p>; // Mostra uma mensagem de carregamento enquanto isLoading é verdadeiro
  }

  return (
    <div className="container">
      <div className="botoes-home-gerenciamento">
        {(userType === 1 || userType === 2) && (
          <Link to="/create-evaluation" className="button-home-gerenciamento">NOVA AVALIAÇÃO</Link>
        )}
        {userType === 1 && (
          <Link to="/gerenciamento" className="button-home-gerenciamento">GERENCIAMENTO</Link>
        )}
      </div>
      <div className="avaliacoes-lista">
        <p className='title-avaliacoes-criadas'>Avaliações cadastradas:</p>
        {avaliacoes.length > 0 ? (
          avaliacoes.map(avaliacao => (
            <div key={avaliacao.id} className="avaliacao-item">
              <p>{avaliacao.nome} - {avaliacao.status}</p>
              <div className="botoes-avaliacao">
                {(userType === 1 || userType === 2 || userType === 3 || userType === 4 || userType === 5) && (
                  <button className="button-home-avaliacao" onClick={() => navigate(`/details-evaluation`, { state: { id: avaliacao.id } })}>
                    DETALHES
                  </button>
                )}
                {(userType === 1 || userType === 2 || userType === 3 || userType === 4 || userType === 5) && (
                  <button className="button-home-avaliacao" onClick={() => handleContinue(avaliacao.id)}>
                    CONTINUAR
                  </button>
                )}
                {(userType === 1 || userType === 2) && (
                  <button className="button-home-avaliacao" onClick={() => navigate(`/update-evaluation`, { state: { id: avaliacao.id } })}>
                    ALTERAR
                  </button>
                )}
                {userType === 1 && (
                  <button className="button-home-avaliacao" onClick={() => handleDelete(avaliacao.id)}>
                    EXCLUIR
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='mensagem-nao-encontrado-home'>Nenhuma avaliação encontrada</p>
        )}
      </div>
    </div>
  );
}

export default Home;