from werkzeug.security import check_password_hash
from Database import Database

class Login:
    def __init__(self, db: Database):
        self.db = db

    def login(self, email, senha):
        query = "SELECT id, senha FROM usuarios WHERE email = %s"
        self.db.cursor.execute(query, (email,))
        user = self.db.cursor.fetchone()
        
        if user and check_password_hash(user[1], senha):
            return {"message": "Login realizado com sucesso!", "user_id": user[0]}
        else:
            return {"message": "Credenciais inválidas."}, 401