class Instituicao:
    def __init__(self, db):
        self.db = db

    def add_instituicao(self, nome_instituicao, cnpj):
        try:
            self.db.cursor.execute(
                "INSERT INTO instituicao (Nome, Cnpj) VALUES (%s, %s)", 
                (nome_instituicao, cnpj)
            )
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao adicionar instituição ao banco de dados: {e}")
            raise e
        
    def get_instituicoes(self):
        try:
            self.db.cursor.execute("SELECT * FROM instituicao ORDER BY Nome")
            result = self.db.cursor.fetchall()
            return result
        except Exception as e:
            print(f"Erro ao obter instituições do banco de dados: {e}")
            raise e

    def instituicao_avaliacao_insert(self, avaliacao_id, instituicao_id):
        try:
            self.db.cursor.execute("UPDATE avaliacao set ID_Instituicao = %s WHERE ID = %s", (instituicao_id, avaliacao_id))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar instituição na avaliação: {e}")
            raise e