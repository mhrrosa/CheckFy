import React, { useState, useEffect } from 'react';
import { getInstituicoes, createInstituicao } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import logo from '../img/logo_horizontal.png';

function Etapa_instituicao_avaliadora({ onNext, avaliacaoId }) {
  const [instituicoes, setInstituicoes] = useState([]);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState('');
  const [novaInstituicao, setNovaInstituicao] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [instituicaoCadastrada, setInstituicaoCadastrada] = useState(false);

  useEffect(() => {
    carregarInstituicoes();
  }, []);

  const carregarInstituicoes = async () => {
    try {
      const data = await getInstituicoes();
      setInstituicoes(data);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
    }
  };

  const salvarDados = async () => {
    try {
      if (!instituicaoCadastrada && novaInstituicao && novoCnpj) {
        await createInstituicao({ nome: novaInstituicao, cnpj: novoCnpj });
        alert('Instituição cadastrada com sucesso!');
      }
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }
  };

  const handleCheckboxChange = (value) => {
    setInstituicaoCadastrada(value);
    if (value) {
      setNovaInstituicao('');
      setNovoCnpj('');
    }
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>Cadastro de Instituição Avaliadora</h1>
      </div>
      
      <div className="input-wrapper">
        <label className="label">Instituições cadastradas:</label>
        <select
          className="input-field"
          value={instituicaoSelecionada}
          onChange={(e) => setInstituicaoSelecionada(e.target.value)}
          disabled={!instituicaoCadastrada}
        >
          <option value="">Selecione a Instituição</option>
          {instituicoes.map(i => (
            <option key={i.id} value={i.id}>{i.nome}</option>
          ))}
        </select>
      </div>
      
      <label className="label">Instituição já cadastrada?</label>
      <div className='checkbox-wrapper'>
        <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={instituicaoCadastrada === true}
            onChange={() => handleCheckboxChange(true)}
          />
          Sim
        </label>
        <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={instituicaoCadastrada === false}
            onChange={() => handleCheckboxChange(false)}
          />
          Não
        </label>
      </div>

      {!instituicaoCadastrada && (
        <>
          <div className="input-wrapper">
            <label className="label">Nome da nova instituição:</label>
            <input
              type="text"
              className="input-field"
              value={novaInstituicao}
              onChange={(e) => setNovaInstituicao(e.target.value)}
              placeholder="Digite o nome da instituição"
            />
          </div>
          
          <div className="input-wrapper">
            <label className="label">CNPJ da nova instituição:</label>
            <input
              type="text"
              className="input-field"
              value={novoCnpj}
              onChange={(e) => setNovoCnpj(e.target.value)}
              placeholder="Digite o CNPJ da instituição"
            />
          </div>
        </>
      )}

      <button className='button-next' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={() => onNext(avaliacaoId)}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default Etapa_instituicao_avaliadora;
