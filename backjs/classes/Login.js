const bcrypt = require('bcrypt');

class Login {
    constructor(db) {
        this.db = db;
    }

    async login(email, senha) {
        const query = "SELECT ID, Senha, ID_Tipo, Nome FROM usuario WHERE Email = ?";
        try {
            const [user] = await this.db.fetchAll(query, [email]);

            if (user) {
                const validPassword = await bcrypt.compare(senha, user.Senha);
                if (validPassword) {
                    return {
                        message: "Login realizado com sucesso!",
                        user_id: user.ID,
                        user_type: user.ID_Tipo,
                        nome: user.Nome,
                        status: 200
                    };
                } else {
                    return { message: "Credenciais inválidas.", status: 401 };
                }
            } else {
                return { message: "Usuário não encontrado.", status: 404 };
            }

        } catch (err) {
            console.error("Erro no login:", err);
            return { message: `Erro no login: ${err.message}`, status: 500 };
        }
    }
}

module.exports = Login;