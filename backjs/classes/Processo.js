class Processo {
    constructor(db) {
        this.db = db;
    }

    async addProcesso(descricao, tipo, idVersaoModelo) {
        const query = "INSERT INTO processo (Descricao, Tipo, ID_Versao_Modelo) VALUES (?, ?, ?)";
        try {
            await this.db.executeQuery(query, [descricao, tipo, idVersaoModelo]);
        } catch (err) {
            console.error("Erro ao adicionar processo ao banco de dados:", err);
            throw err;
        }
    }

    async getProcessos(idVersaoModelo) {
        const query = "SELECT * FROM processo WHERE ID_Versao_Modelo = ? ORDER BY id";
        try {
            const processos = await this.db.fetchAll(query, [idVersaoModelo]);
            return processos;
        } catch (err) {
            console.error("Erro ao obter processos do banco de dados:", err);
            throw err;
        }
    }

    async deleteProcesso(processoId) {
        const query = "DELETE FROM processo WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [processoId]);
        } catch (err) {
            console.error("Erro ao deletar processo:", err);
            throw err;
        }
    }

    async updateProcesso(processoId, novaDescricao, novoTipo) {
        const query = "UPDATE processo SET Descricao = ?, Tipo = ? WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [novaDescricao, novoTipo, processoId]);
        } catch (err) {
            console.error("Erro ao atualizar processo:", err);
            throw err;
        }
    }
}

module.exports = Processo;