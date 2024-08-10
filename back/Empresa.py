class Empresa:
    def __init__(self, db):
        self.db = db

    def add_empresa(self, nome_empresa, cnpj):
        try:
            self.db.cursor.execute(
                "INSERT INTO empresas (Nome_Empresa, CNPJ) VALUES (%s, %s)", 
                (nome_empresa, cnpj)
            )
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao adicionar empresa ao banco de dados: {e}")
            raise e
        
    def get_empresas(self):
        try:
            self.db.cursor.execute("SELECT * FROM empresas ORDER BY Nome_Empresa")
            result = self.db.cursor.fetchall()
            return result
        except Exception as e:
            print(f"Erro ao obter empresas do banco de dados: {e}")
            raise e

    def delete_empresa(self, empresa_id):
        try:
            self.db.cursor.execute("DELETE FROM empresas WHERE ID = %s", (empresa_id,))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao deletar empresa do banco de dados: {e}")
            raise e

    def update_empresa(self, empresa_id, novo_nome, novo_cnpj):
        try:
            self.db.cursor.execute(
                "UPDATE empresas SET Nome_Empresa = %s, CNPJ = %s WHERE ID = %s", 
                (novo_nome, novo_cnpj, empresa_id)
            )
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar empresa no banco de dados: {e}")
            raise e
