import React, { useState, useEffect } from 'react';
import { getEmpresas, createEmpresa } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import logo from '../img/logo_horizontal.png';

function Etapa_empresa({ onNext, avaliacaoId }) {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [empresaCadastrada, setEmpresaCadastrada] = useState(false);

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  const salvarDados = async () => {
    try {
      if (!empresaCadastrada && novaEmpresa && novoCnpj) {
        await createEmpresa({ nome: novaEmpresa, cnpj: novoCnpj });
        alert('Empresa cadastrada com sucesso!');
      }
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }
  };

  const handleCheckboxChange = (value) => {
    setEmpresaCadastrada(value);
    if (value) {
      setNovaEmpresa('');
      setNovoCnpj('');
    }
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>Cadastro de Empresa</h1>
      </div>
      
      <div className="input-wrapper">
        <label className="label">Empresas cadastradas:</label>
        <select
          className="input-field"
          value={empresaSelecionada}
          onChange={(e) => setEmpresaSelecionada(e.target.value)}
          disabled={!empresaCadastrada}
        >
          <option value="">Selecione a Empresa</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
      </div>
      
      <label className="label">Empresa já cadastrada?</label>
      <div className='checkbox-wrapper'>
        <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={empresaCadastrada === true}
            onChange={() => handleCheckboxChange(true)}
          />
          Sim
        </label>
        <label className="checkbox-label" style={{ color: 'white', marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={empresaCadastrada === false}
            onChange={() => handleCheckboxChange(false)}
          />
          Não
        </label>
      </div>

      {!empresaCadastrada && (
        <>
          <div className="input-wrapper">
            <label className="label">Nome da nova empresa:</label>
            <input
              type="text"
              className="input-field"
              value={novaEmpresa}
              onChange={(e) => setNovaEmpresa(e.target.value)}
              placeholder="Digite o nome da empresa"
            />
          </div>
          
          <div className="input-wrapper">
            <label className="label">CNPJ da nova empresa:</label>
            <input
              type="text"
              className="input-field"
              value={novoCnpj}
              onChange={(e) => setNovoCnpj(e.target.value)}
              placeholder="Digite o CNPJ da empresa"
            />
          </div>
        </>
      )}

      <button className='button-next' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={() => onNext(avaliacaoId)}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default Etapa_empresa;
