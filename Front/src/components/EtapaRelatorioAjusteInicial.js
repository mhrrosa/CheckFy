import React, { useState, useEffect } from 'react';
import { inserirRelatorioInicial, atualizarRelatorioInicial, getRelatorioInicial, enviarEmailRelatorioAjusteInicial } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/EtapaRelatorioAjusteInicial.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaRelatorioAjusteInicial({ onNext, avaliacaoId }) {
  const [relatorioAjuste, setRelatorioAjuste] = useState('');
  const [relatorioExiste, setRelatorioExiste] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Estado para o arquivo selecionado
  const [existingFilePath, setExistingFilePath] = useState(''); // Caminho do arquivo existente

  useEffect(() => {
    async function fetchRelatorio() {
      try {
        const response = await getRelatorioInicial(avaliacaoId);
        if (response.descricao) {
          setRelatorioAjuste(response.descricao);
          setRelatorioExiste(true);  // Marca que o relatório já existe
          setExistingFilePath(response.caminhoArquivo || '');  // Salva o caminho do arquivo se existir
        } else if (response.message === "Relatório não encontrado, ainda não foi criado") {
          console.log(response.message);
          setRelatorioExiste(false);  // Marca que o relatório não existe ainda
        }
      } catch (error) {
        console.error('Erro ao buscar o relatório:', error);
      }
    }

    fetchRelatorio();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!relatorioAjuste && !selectedFile) {
      alert('Por favor, preencha o relatório de ajuste ou anexe um arquivo.');
      return;
    }

    try {
      let caminhoArquivo = existingFilePath;

      // Se um novo arquivo foi selecionado, faça o upload
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch(`http://127.0.0.1:5000/upload`, {
          method: 'POST',
          body: formData
        });

        const result = await uploadResponse.json();
        caminhoArquivo = result.filepath;

        // Atualiza o estado para exibir o arquivo recém-uploadado como "arquivo atual"
        setExistingFilePath(caminhoArquivo);
        setSelectedFile(null); // Limpa o arquivo selecionado após o upload
      }

      const data = { descricao: relatorioAjuste, idAvaliacao: avaliacaoId, caminhoArquivo };

      if (relatorioExiste) {
        await atualizarRelatorioInicial(data);
        alert('Relatório atualizado com sucesso!');
      } else {
        await inserirRelatorioInicial(data);
        alert('Relatório inserido com sucesso!');
        setRelatorioExiste(true);
      }
    } catch (error) {
      console.error('Erro ao salvar o relatório:', error);
    }
  };

  const proximaEtapa = async () => {
    if (!relatorioAjuste) {
      alert('Por favor, preencha o relatório de ajuste antes de continuar.');
      return;
    }

    if (window.confirm('Ao confirmar, será enviado um e-mail para o auditor realizar a auditoria. Deseja continuar?')) {
      try {
        await enviarEmailRelatorioAjusteInicial(avaliacaoId);
        alert('E-mail enviado com sucesso!');
        onNext();  // Chama a próxima etapa após o envio do e-mail
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Ocorreu um erro ao enviar o e-mail.');
      }
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>Relatório de Ajuste</h1>
      <div style={{
            backgroundColor: '#e0e0e0', // Fundo mais escuro para maior contraste
            borderLeft: '4px solid #a0a0a0', // Borda levemente destacada
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
        }}>
            <strong style={{ color: '#555' }}>Dica:</strong> {/* Texto de dica mais escuro */}
            <p style={{ color: '#333', margin: '5px 0' }}>
            O relatório detalha todos os pontos que precisam ser ajustados antes da avaliação final. 
            </p>
        </div>
      
      
      <div className="input-wrapper">
        <label className="label">Relatório de Ajuste:</label>
        <textarea
          style={{ marginLeft: 10 , width: 500 }}
          value={relatorioAjuste}
          onChange={(e) => setRelatorioAjuste(e.target.value)}
          placeholder="Descreva os ajustes necessários"
        />
      </div>

      <div className="input-wrapper">
        <label className="label">Anexar Arquivo:</label>
        <input 
          type="file" 
          onChange={(e) => setSelectedFile(e.target.files[0])} 
        />
        {existingFilePath && (
          <div style={{ marginTop: '10px' }}>
            <p>Arquivo atual:</p>
            <button className="acoes-botao-document" onClick={() => window.open(`http://127.0.0.1:5000/uploads/${existingFilePath}`, '_blank')}>MOSTRAR</button>
          </div>
        )}
      </div>

      <button className='button-next' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={proximaEtapa}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaRelatorioAjusteInicial;