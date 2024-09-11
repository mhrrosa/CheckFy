class Instituicao {
    constructor(db) {
        this.db = db;
    }

    async addInstituicao(nomeInstituicao, cnpj) {
        const query = "INSERT INTO instituicao (Nome, Cnpj) VALUES (?, ?)";
        try {
            const result = await this.db.executeQuery(query, [nomeInstituicao, cnpj]);
            return result.insertId; // Retorna o ID da nova instituição inserida
        } catch (err) {
            console.error("Erro ao adicionar instituição ao banco de dados:", err);
            throw err;
        }
    }

    async getInstituicoes() {
        const query = "SELECT * FROM instituicao ORDER BY Nome";
        try {
            const instituicoes = await this.db.fetchAll(query);
            return instituicoes;
        } catch (err) {
            console.error("Erro ao obter instituições do banco de dados:", err);
            throw err;
        }
    }

    async instituicaoAvaliacaoInsert(avaliacaoId, instituicaoId) {
        const query = "UPDATE avaliacao SET ID_Instituicao = ? WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [instituicaoId, avaliacaoId]);
        } catch (err) {
            console.error("Erro ao atualizar instituição na avaliação:", err);
            throw err;
        }
    }
}

module.exports = Instituicao;