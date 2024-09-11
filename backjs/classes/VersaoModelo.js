class VersaoModelo {
    constructor(db) {
        this.db = db;
    }

    async addVersaoModelo(nome, status) {
        const query = "INSERT INTO versao_modelo (Nome, Status) VALUES (?, ?)";
        const values = [nome, status];
        try {
            await this.db.executeQuery(query, values);
        } catch (err) {
            console.error("Erro ao adicionar versão do modelo ao banco de dados:", err);
            throw err;
        }
    }

    async getVersaoModelo() {
        const query = "SELECT * FROM versao_modelo ORDER BY Nome DESC";
        try {
            const result = await this.db.fetchAll(query);
            return result;
        } catch (err) {
            console.error("Erro ao obter versões do modelo:", err);
            throw err;
        }
    }

    async deleteVersaoModelo(versaoModeloId) {
        const query = "DELETE FROM versao_modelo WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [versaoModeloId]);
        } catch (err) {
            console.error("Erro ao deletar versão do modelo:", err);
            throw err;
        }
    }

    async updateVersaoModelo(nome, status, id) {
        const query = "UPDATE versao_modelo SET Nome = ?, Status = ? WHERE ID = ?";
        const values = [nome, status, id];
        try {
            await this.db.executeQuery(query, values);
        } catch (err) {
            console.error("Erro ao atualizar versão do modelo:", err);
            throw err;
        }
    }
}

module.exports = VersaoModelo;