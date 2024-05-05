import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Importando o arquivo CSS

class Home extends React.Component {
    render() {
        return (
            <div className="home-container">
                <h1 className="home-title">Página Inicial - Checkfy</h1>
                <Link to="/create-evaluation" className="start-button">Iniciar Nova Avaliação</Link>
                <div className="evaluation-list">
                    {/* Aqui você pode listar as avaliações existentes */}
                    <div className="evaluation-item">
                        <p>Avaliação 1 - Em andamento</p>
                    </div>
                    <div className="evaluation-item">
                        <p>Avaliação 2 - Concluída</p>
                    </div>
                    {/* Adicione mais itens conforme necessário */}
                </div>
            </div>
        );
    }
}

export default Home;