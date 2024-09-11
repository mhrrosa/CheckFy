class Nivel {
    constructor(db) {
        this.db = db;
    }

    async addNivel(nivel, nomeNivel, idVersaoModelo) {
        const query = "INSERT INTO nivel_maturidade_mpsbr (Nivel, Nome_Nivel, ID_Versao_Modelo) VALUES (?, ?, ?)";
        try {
            await this.db.executeQuery(query, [nivel, nomeNivel, idVersaoModelo]);
        } catch (err) {
            console.error("Erro ao adicionar nível ao banco de dados:", err);
            throw err;
        }
    }

    async getNiveis(idVersaoModelo) {
        const query = "SELECT * FROM nivel_maturidade_mpsbr WHERE ID_Versao_Modelo = ? ORDER BY Nivel";
        try {
            const niveis = await this.db.fetchAll(query, [idVersaoModelo]);
            return niveis;
        } catch (err) {
            console.error("Erro ao obter níveis do banco de dados:", err);
            throw err;
        }
    }

    async deleteNivel(nivelId) {
        const query = "DELETE FROM nivel_maturidade_mpsbr WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [nivelId]);
        } catch (err) {
            console.error("Erro ao deletar nível do banco de dados:", err);
            throw err;
        }
    }

    async updateNivel(nivelId, novoNivel, novoNomeNivel) {
        const query = "UPDATE nivel_maturidade_mpsbr SET Nivel = ?, Nome_Nivel = ? WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [novoNivel, novoNomeNivel, nivelId]);
        } catch (err) {
            console.error("Erro ao atualizar nível no banco de dados:", err);
            throw err;
        }
    }
}

module.exports = Nivel;