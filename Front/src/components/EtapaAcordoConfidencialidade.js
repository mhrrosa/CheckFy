import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/EtapaAcordoConfidencialidade.css';

function EtapaAcordoConfidencialidade({ onNext }) {
    const [acordoConfidencialidade, setAcordoConfidencialidade] = useState(null);

    const handleAcordoConfidencialidadeChange = (event) => {
        setAcordoConfidencialidade(event.target.files[0]);
    };

    const removerAcordoConfidencialidade = () => {
        setAcordoConfidencialidade(null);
        document.getElementById('file').value = null; // Limpa o input file
    };

    const salvarAcordoConfidencialidade = async () => {
        if (!acordoConfidencialidade) {
            alert('Por favor, anexe o acordo de confidencialidade.');
            return;
        }
        try {
            // Lógica para salvar o acordo de confidencialidade
            console.log('Acordo de confidencialidade salvo:', acordoConfidencialidade);
            // Exemplo: enviar o arquivo para o servidor
            alert('Acordo de confidencialidade salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar o acordo de confidencialidade:', error);
            alert('Erro ao salvar o acordo de confidencialidade. Tente novamente.');
        }
    };

    return (
        <div className="container-etapa">
            <div>
                <h1 className="title-form">Acordo de Confidencialidade</h1>
            </div>
            <div className='div-input-acordo-confidencialidade'>
                <label className="label">Upload de Acordo de Confidencialidade:</label>
                <input
                    className="input-campo-acordo-confidencialidade"
                    type="file"
                    id="file"
                    onChange={handleAcordoConfidencialidadeChange}
                />
                <label htmlFor="file">Escolha um arquivo</label>
                {acordoConfidencialidade && <p className='acordo-adicionado'>Arquivo adicionado</p>}
            </div>
            {acordoConfidencialidade && (
                <button className='button-remove' onClick={removerAcordoConfidencialidade}>REMOVER</button>
            )}

            {/* Botão de Salvar sempre visível */}
            <button className='button-next' onClick={salvarAcordoConfidencialidade}>SALVAR</button>
            <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
        </div>
    );
}

export default EtapaAcordoConfidencialidade;