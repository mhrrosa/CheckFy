from werkzeug.security import check_password_hash
from Database import Database

class Login:
    def __init__(self, db: Database):
        self.db = db

    def login(self, email, senha):
        try:
            query = "SELECT id, senha FROM usuario WHERE email = %s"
            self.db.cursor.execute(query, (email,))
            user = self.db.cursor.fetchone()
            
            # Garantir que todos os resultados sejam processados
            self.db.cursor.fetchall()  # Limpa qualquer resultado pendente

            if user and check_password_hash(user[1], senha):
                return {"message": "Login realizado com sucesso!", "user_id": user[0]}
            else:
                return {"message": "Credenciais inválidas."}, 401
        
        except Exception as e:
            print(f"Erro no login: {e}")
            return {"message": f"Erro no login: {str(e)}"}, 500
