import React, { useState, useEffect } from 'react';
import { getAvaliacaoById, getEmpresas, addEmpresa, empresaAvaliacaoInsert } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import BotaoCarregando from './common/BotaoCarregando';
import CarregandoEtapa from './common/CarregandoEtapa';
import { useToast } from '../contexts/ToastContext';

function EtapaEmpresa({ onNext, avaliacaoId }) {
  const { showToast } = useToast();
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [empresaCadastrada, setEmpresaCadastrada] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      const empresasData = await getEmpresas();
      const empresasFormatadas = empresasData.map(item => ({
        id: item['ID'],
        nome: item['Nome'],
        cnpj: item[2],
      }));
      setEmpresas(empresasFormatadas);
      const avaliacaoData = await getAvaliacaoById(avaliacaoId);
      if (avaliacaoData && avaliacaoData.id_empresa) {
        setEmpresaSelecionada(avaliacaoData.id_empresa);
        setEmpresaCadastrada(true);
      } else {
        setEmpresaSelecionada('');
        setEmpresaCadastrada(false);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas ou avaliação:', error);
    } finally {
      setCarregando(false);
    }
  };

  const salvarDados = async () => {
    setSalvando(true);
    try {
      if (!empresaCadastrada) {
        if (novaEmpresa && novoCnpj) {
          const novaEmpresaResponse = await addEmpresa({ nome: novaEmpresa, cnpj: novoCnpj });
          await carregarEmpresas();
          const novaEmpresaId = novaEmpresaResponse.id;
          await empresaAvaliacaoInsert(avaliacaoId, { idEmpresa: novaEmpresaId });
          showToast('Empresa salva com sucesso!', 'success');
          setEmpresaSelecionada(novaEmpresaId);
          setNovaEmpresa('');
          setNovoCnpj('');
          setEmpresaCadastrada(true);
        } else {
          showToast('Por favor, preencha todos os campos da nova empresa.', 'warning');
          return;
        }
      } else if (empresaSelecionada) {
        await empresaAvaliacaoInsert(avaliacaoId, { idEmpresa: empresaSelecionada });
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      showToast('Erro ao salvar os dados. Tente novamente.', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleCheckboxChange = (value) => {
    setEmpresaCadastrada(value);
    if (value) {
      setNovaEmpresa('');
      setNovoCnpj('');
    }
  };

  if (carregando) {
    return (
      <div className='container-etapa'>
        <CarregandoEtapa />
      </div>
    );
  }

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>CADASTRO DE EMPRESA</h1>
      </div>
      <label className="label">Empresa já cadastrada?</label>
      <div className='checkbox-wrapper'>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={empresaCadastrada === true}
            onChange={() => handleCheckboxChange(true)}
          />
          Sim
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={empresaCadastrada === false}
            onChange={() => handleCheckboxChange(false)}
          />
          Não
        </label>
      </div>
      {empresaCadastrada && (
        <>
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
        </>
      )}
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

      <BotaoCarregando className='button-save' onClick={salvarDados} loading={salvando} loadingText="Salvando...">SALVAR</BotaoCarregando>
      <button className='button-next' onClick={() => onNext(avaliacaoId)} disabled={salvando}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaEmpresa;