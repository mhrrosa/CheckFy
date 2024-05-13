import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Importando o arquivo CSS

class Home extends React.Component {
    render() {
        return (
            <div className="home-container">
                <div className="botoes-home">
                    <Link to="/create-evaluation" className="botao-home">NOVA AVALIAÇÃO</Link>
                    <Link to="/create-evaluation" className="botao-home">GUIA DO MPS.BR</Link>
                </div>
                <div className="avaliacoes-lista">
                    {/* Aqui você pode listar as avaliações existentes */}
                    <p>Avaliações criadas:</p>
                    <div className="avaliacao-item">
                        <p>Avaliação 1 - Concluída</p>
                    </div>
                    <div className="avaliacao-item">
                        <p>Avaliação 2 - Em andamento</p>
                    </div>
                    <div className="avaliacao-item">
                        <p>Avaliação 3 - Não iniciado</p>
                    </div>
                    {/* Adicione mais itens conforme necessário */}
                </div>
            </div>
        );
    }
}

export default Home;