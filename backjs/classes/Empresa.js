class Empresa {
    constructor(db) {
        this.db = db;
    }

    async addEmpresa(nomeEmpresa, cnpj) {
        const query = "INSERT INTO empresa (Nome, Cnpj) VALUES (?, ?)";
        try {
            const result = await this.db.executeQuery(query, [nomeEmpresa, cnpj]);
            return result.insertId; // Retorna o ID da nova empresa inserida
        } catch (err) {
            console.error("Erro ao adicionar empresa ao banco de dados:", err);
            throw err;
        }
    }

    async getEmpresas() {
        const query = "SELECT * FROM empresa ORDER BY Nome";
        try {
            const empresas = await this.db.fetchAll(query);
            return empresas;
        } catch (err) {
            console.error("Erro ao obter empresas do banco de dados:", err);
            throw err;
        }
    }

    async deleteEmpresa(empresaId) {
        const query = "DELETE FROM empresa WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [empresaId]);
        } catch (err) {
            console.error("Erro ao deletar empresa do banco de dados:", err);
            throw err;
        }
    }

    async updateEmpresa(empresaId, novoNome, novoCnpj) {
        const query = "UPDATE empresa SET Nome = ?, Cnpj = ? WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [novoNome, novoCnpj, empresaId]);
        } catch (err) {
            console.error("Erro ao atualizar empresa no banco de dados:", err);
            throw err;
        }
    }

    async empresaAvaliacaoInsert(avaliacaoId, empresaId) {
        const query = "UPDATE avaliacao SET ID_Empresa = ? WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [empresaId, avaliacaoId]);
        } catch (err) {
            console.error("Erro ao inserir empresa na avaliação:", err);
            throw err;
        }
    }

    async updateEmpresaAjusteAvaliacaoInicial(idEmpresa, nome) {
        const query = "UPDATE empresa SET Nome = ? WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [nome, idEmpresa]);
        } catch (err) {
            console.error("Erro ao atualizar empresa no banco de dados:", err);
            throw err;
        }
    }
}

module.exports = Empresa;
