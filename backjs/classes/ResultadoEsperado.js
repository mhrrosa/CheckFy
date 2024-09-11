class ResultadoEsperado {
    constructor(db) {
        this.db = db;
    }

    async addResultadoEsperado(descricao, idNivelIntervaloInicio, idNivelIntervaloFim, idProcesso) {
        const query = `
            INSERT INTO resultado_esperado_mpsbr (Descricao, ID_Nivel_Intervalo_Inicio, ID_Nivel_Intervalo_Fim, ID_Processo)
            VALUES (?, ?, ?, ?)
        `;
        const values = [descricao, idNivelIntervaloInicio, idNivelIntervaloFim, idProcesso];
        try {
            await this.db.executeQuery(query, values);
        } catch (err) {
            console.error("Erro ao adicionar resultado esperado:", err);
            throw err;
        }
    }

    async updateResultadoEsperado(resultadoId, novaDescricao, novoIdNivelIntervaloInicio, novoIdNivelIntervaloFim, novoIdProcesso) {
        const query = `
            UPDATE resultado_esperado_mpsbr 
            SET Descricao = ?, ID_Nivel_Intervalo_Inicio = ?, ID_Nivel_Intervalo_Fim = ?, ID_Processo = ? 
            WHERE ID = ?
        `;
        const values = [novaDescricao, novoIdNivelIntervaloInicio, novoIdNivelIntervaloFim, novoIdProcesso, resultadoId];
        try {
            await this.db.executeQuery(query, values);
        } catch (err) {
            console.error("Erro ao atualizar resultado esperado:", err);
            throw err;
        }
    }

    async deleteResultadoEsperado(resultadoId) {
        const query = "DELETE FROM resultado_esperado_mpsbr WHERE ID = ?";
        try {
            await this.db.executeQuery(query, [resultadoId]);
        } catch (err) {
            console.error("Erro ao deletar resultado esperado:", err);
            throw err;
        }
    }

    async getResultadosEsperados(idProcessos) {
        const placeholders = idProcessos.map(() => '?').join(', ');
        const query = `
            SELECT * 
            FROM resultado_esperado_mpsbr 
            WHERE ID_Processo IN (${placeholders})
        `;
        try {
            const resultados = await this.db.fetchAll(query, idProcessos);
            return resultados;
        } catch (err) {
            console.error("Erro ao buscar resultados esperados:", err);
            throw err;
        }
    }
}

module.exports = ResultadoEsperado;