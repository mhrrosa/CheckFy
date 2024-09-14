import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById, getNiveisLimitado, enviarEmailResultadoAvaliacaoInicial, updateResultadoFinal } from '../services/Api'; 
import '../components/styles/Button.css';
import '../components/styles/EtapaAtribuirNivelMaturidade.css'; // Importa o CSS externo

function EtapaAtribuirNivelMaturidade({ onNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({});
  const [niveis, setNiveis] = useState([]);
  const [selectedNivel, setSelectedNivel] = useState('');
  const [satisfacao, setSatisfacao] = useState(''); // Estado para o seletor de satisfação
  const [isLoading, setIsLoading] = useState(false);
  const [nivelDisabled, setNivelDisabled] = useState(false); // Controla se o seletor de nível está desabilitado

  useEffect(() => {
    const fetchAvaliacao = async () => {
      setIsLoading(true);
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);

        // Carrega os níveis limitados até o nível solicitado
        const niveisData = await getNiveisLimitado(data.id_versao_modelo, data.id_nivel_solicitado);
        setNiveis(niveisData);

        // Se o Parecer Final e o Nível Atribuído já vierem da API, preenche os seletores
        if (data.parecer_final) {
          setSatisfacao(data.parecer_final);
          if (data.parecer_final === 'Satisfeito') {
            setSelectedNivel(data.id_nivel_atribuido || data.id_nivel_solicitado);
            setNivelDisabled(true);
          } else if (data.parecer_final === 'Não Satisfeito') {
            setSelectedNivel(data.id_nivel_atribuido || '');
            setNivelDisabled(false);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar avaliação ou níveis:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  // Lida com a mudança no seletor de satisfação
  const handleSatisfacaoChange = (e) => {
    const valor = e.target.value;
    setSatisfacao(valor);

    if (valor === 'Satisfeito') {
      // Quando satisfeito, definir o nível final como o nível solicitado e desabilitar o seletor
      setSelectedNivel(avaliacao.id_nivel_solicitado);
      setNivelDisabled(true);
    } else if (valor === 'Não Satisfeito') {
      // Quando não satisfeito, habilitar o seletor e permitir a escolha
      setSelectedNivel('');
      setNivelDisabled(false);
    } else {
      setSelectedNivel('');
      setNivelDisabled(true);
    }
  };

  const handleNext = async () => {
    // Verifica se os seletores foram preenchidos
    if (!satisfacao || !selectedNivel) {
      alert('Por favor, selecione o resultado final e o nível final.');
      return;
    }

    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando o resultado da auditoria inicial. Deseja continuar?');

    if (confirmacao) {
      setIsLoading(true);
      try {
        // Envia o e-mail
        await enviarEmailResultadoAvaliacaoInicial(location.state.id);
        alert('E-mail enviado com sucesso!');

        // Após o sucesso do envio do e-mail, envia o resultado final e o nível selecionado
        const data = {
          idAvaliacao: location.state.id,
          parecerFinal: satisfacao,
          idNivelAtribuido: selectedNivel
        };
        await updateResultadoFinal(location.state.id, data);
        alert('Resultado final atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao processar a ação:', error);
        alert('Houve um erro ao enviar o e-mail ou ao atualizar o resultado. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container-etapa">
      <h1 className="title">ATRIBUIR NÍVEL DE MATURIDADE</h1>

      <div className="tip">
        <strong>Dica:</strong>
        <p>Rever a Caracterização dos Processos: Antes de iniciar a atividade, certifique-se de que todos os processos foram devidamente caracterizados.</p>
      </div>

      <div className="row">
        <label className="label">Nome da Empresa Avaliada:</label>
        <span className="value">{avaliacao.nome_empresa}</span>
      </div>

      <div className="row">
        <label className="label">Nível Solicitado:</label>
        <span className="value">{avaliacao.nivel_solicitado}</span>
      </div>

      {/* Seletor de Satisfação */}
      <div className="row">
        <label className="label">Resultado Final:</label>
        <select 
          value={satisfacao} 
          onChange={handleSatisfacaoChange}
          className="select"
        >
          <option value="">Selecione um resultado</option>
          <option value="Satisfeito">Satisfeito</option>
          <option value="Não Satisfeito">Não Satisfeito</option>
        </select>
      </div>

      {/* Seletor de Níveis - Só aparece se um resultado final estiver selecionado */}
      {satisfacao && (
        <div className="row">
          <label className="label">Selecione o Nível Final:</label>
          <select 
            value={selectedNivel} 
            onChange={(e) => setSelectedNivel(e.target.value)} 
            className="select"
            disabled={nivelDisabled} // Desabilita o seletor se for "Satisfeito"
          >
            <option value="">Selecione um nível</option>
            {niveis.length > 0 && niveis.map(nivel => (
              <option key={nivel[0]} value={nivel[0]}>{nivel[1]} - {nivel[2]}</option>
            ))}
          </select>
        </div>
      )}

      {/* Botões de salvar e próximo */}
      <div className="buttonContainer">
        <button
          onClick={handleNext}
          className="saveButton"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Salvar e Enviar E-mail'}
        </button>
        <button
          onClick={onNext}
          className="button-next"
          disabled={isLoading}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default EtapaAtribuirNivelMaturidade;