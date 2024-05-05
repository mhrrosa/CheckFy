import React, { useState, useEffect } from 'react';
import { getProcessos } from '../services/Api';
import '../styles/Modelo.css';

function Modelo() {
    const [processos, setProcessos] = useState([]);

    useEffect(() => {
        getProcessos().then(data => {
            if (data) { // Certifique-se de que data existe antes de tentar usá-lo
                setProcessos(data);
            } else {
                console.error('Nenhum dado recebido: ', data);
                setProcessos([]); // Define processos como um array vazio se nenhum dado for recebido
            }
        }).catch(error => {
            console.error("Erro ao buscar processos:", error);
            setProcessos([]); // Define como array vazio em caso de erro
        });
    }, []);

    return (
        <div className="modelo-container">
            <h1>Gerenciamento de Processos</h1>
            {processos.length > 0 ? processos.map(processo => (
                <div key={processo.id}>
                    <span>{processo.nome}</span>
                </div>
            )) : <p>Nenhum processo encontrado.</p>}
        </div>
    );
}

export default Modelo;
