import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvaliacaoById, updateAvaliacao } from '../services/Api';
import '../styles/UpdateEvaluation.css';

function UpdateEvaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState({
    nome: '',
    descricao: '',
    status: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    id_avaliador_lider: '',
    id_atividade: ''
  });

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleChange = (e) => {
    setAvaliacao({ ...avaliacao, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateAvaliacao(location.state.id, avaliacao);
      navigate('/');
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
    }
  };

  return (
    <div className="update-evaluation-container">
      <h1>Atualizar Avaliação</h1>
      <input
        type="text"
        name="nome"
        value={avaliacao.nome}
        onChange={handleChange}
        placeholder="Nome"
      />
      <input
        type="text"
        name="descricao"
        value={avaliacao.descricao}
        onChange={handleChange}
        placeholder="Descrição"
      />
      <input
        type="text"
        name="status"
        value={avaliacao.status}
        onChange={handleChange}
        placeholder="Status"
      />
      {/* Adicione mais campos conforme necessário */}
      <button onClick={handleUpdate}>Atualizar</button>
    </div>
  );
}

export default UpdateEvaluation;