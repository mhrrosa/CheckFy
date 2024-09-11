class Atividade {
    constructor(db) {
        this.db = db;
    }

    async getAtividades() {
        try {
            const query = 'SELECT ID, Descricao FROM atividade';
            const result = await this.db.fetchAll(query);
            const atividadesList = result.map(atividade => ({
                ID: atividade.ID,
                Descricao: atividade.Descricao
            }));
            return atividadesList;
        } catch (err) {
            console.error('Erro ao buscar atividades:', err);
            throw err;
        }
    }
}

module.exports = Atividade;