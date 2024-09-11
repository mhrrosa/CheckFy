class Auditor {
    constructor(db) {
        this.db = db;
    }

    async adicionarAuditor(idAvaliacao, auditorEmails) {
        try {
            const inserirOuLinkarUsuario = async (email, idFuncao) => {
                let query = "SELECT ID FROM usuario WHERE Email = ?";
                let [usuario] = await this.db.fetchAll(query, [email]);

                if (usuario) {
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (?, ?, ?)";
                    await this.db.executeQuery(query, [idAvaliacao, usuario.ID, idFuncao]);
                } else {
                    query = "INSERT INTO usuario (Nome, Email, Senha, ID_Tipo) VALUES (?, ?, ?, ?)";
                    await this.db.executeQuery(query, ["Usuário", email, "senha", idFuncao]);
                    const novoUsuarioId = this.db.conn.lastInsertId;  // Obter o ID do último inserido
                    query = "INSERT INTO usuarios_avaliacao (ID_Avaliacao, ID_Usuario, ID_Funcao) VALUES (?, ?, ?)";
                    await this.db.executeQuery(query, [idAvaliacao, novoUsuarioId, idFuncao]);
                    console.log(`Simulação de envio de e-mail para ${email} solicitando cadastro no sistema.`);
                }
            };

            for (let email of auditorEmails) {
                await inserirOuLinkarUsuario(email, 3);  // 3 seria o ID da função para auditores
            }

            this.db.conn.commit();
        } catch (err) {
            console.error('Erro ao adicionar auditores:', err);
            this.db.conn.rollback();
            throw err;
        }
    }

    async getEmailAuditor(avaliacaoId) {
        try {
            let query = `
                SELECT ID_Usuario 
                FROM usuarios_avaliacao 
                WHERE ID_Avaliacao = ? AND ID_Funcao = 3
            `;
            let [idUsuario] = await this.db.fetchAll(query, [avaliacaoId]);

            if (idUsuario) {
                query = "SELECT Email FROM usuario WHERE ID = ?";
                let [email] = await this.db.fetchAll(query, [idUsuario.ID_Usuario]);

                return email ? email.Email : null;
            } else {
                return null;
            }
        } catch (err) {
            console.error('Erro ao buscar e-mail do auditor:', err);
            throw err;
        }
    }

    async updateEmailAuditor(avaliacaoId, novoEmail) {
        try {
            const query = `
                UPDATE usuario u
                JOIN usuarios_avaliacao ua ON u.ID = ua.ID_Usuario
                SET u.Email = ?
                WHERE ua.ID_Avaliacao = ? AND ua.ID_Funcao = 3
            `;
            const result = await this.db.executeQuery(query, [novoEmail, avaliacaoId]);

            if (result.affectedRows === 0) {
                throw new Error("Auditor não encontrado para essa avaliação");
            }

            this.db.conn.commit();
        } catch (err) {
            console.error('Erro ao atualizar e-mail do auditor:', err);
            this.db.conn.rollback();
            throw err;
        }
    }
}

module.exports = Auditor;