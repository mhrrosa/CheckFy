class Instituicao:
    def __init__(self, db):
        self.db = db

    def add_instituicao(self, nome_instituicao, cnpj):
        try:
            self.db.cursor.execute(
                "INSERT INTO instituicoes (Nome_Instituicao, CNPJ) VALUES (%s, %s)", 
                (nome_instituicao, cnpj)
            )
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar instituição ao banco de dados: {e}")
            raise e
        
    def get_instituicoes(self):
        try:
            self.db.cursor.execute("SELECT * FROM instituicoes ORDER BY Nome_Instituicao")
            result = self.db.cursor.fetchall()
            return result
        except Exception as e:
            print(f"Erro ao obter instituições do banco de dados: {e}")
            raise e

    def delete_instituicao(self, instituicao_id):
        try:
            self.db.cursor.execute("DELETE FROM instituicoes WHERE ID = %s", (instituicao_id,))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao deletar instituição do banco de dados: {e}")
            raise e

    def update_instituicao(self, instituicao_id, novo_nome, novo_cnpj):
        try:
            self.db.cursor.execute(
                "UPDATE instituicoes SET Nome_Instituicao = %s, CNPJ = %s WHERE ID = %s", 
                (novo_nome, novo_cnpj, instituicao_id)
            )
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar instituição no banco de dados: {e}")
            raise e
