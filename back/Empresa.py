class Empresa:
    def __init__(self, db):
        self.db = db

    def add_empresa(self, nome_empresa, cnpj):
        try:
            self.db.cursor.execute(
                "INSERT INTO empresa (Nome, Cnpj) VALUES (%s, %s)", 
                (nome_empresa, cnpj)
            )
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao adicionar empresa ao banco de dados: {e}")
            raise e
        
    def get_empresas(self):
        try:
            self.db.cursor.execute("SELECT * FROM empresa ORDER BY Nome")
            result = self.db.cursor.fetchall()
            return result
        except Exception as e:
            print(f"Erro ao obter empresas do banco de dados: {e}")
            raise e

    def delete_empresa(self, empresa_id):
        try:
            self.db.cursor.execute("DELETE FROM empresa WHERE ID = %s", (empresa_id,))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao deletar empresa do banco de dados: {e}")
            raise e

    def update_empresa(self, empresa_id, novo_nome, novo_cnpj):
        try:
            self.db.cursor.execute(
                "UPDATE empresa SET Nome = %s, Cnpj = %s WHERE ID = %s", 
                (novo_nome, novo_cnpj, empresa_id)
            )
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar empresa no banco de dados: {e}")
            raise e
        
    def empresa_avaliacao_insert(self, avaliacao_id, empresa_id):
        try:
            self.db.cursor.execute("UPDATE avaliacao set ID_Empresa = %s WHERE ID = %s", (empresa_id, avaliacao_id))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao deletar empresa do banco de dados: {e}")
            raise e
        
    
    def update_empresa_ajuste_avaliacao_inicial(self, id_empresa, nome):
        try:
            self.db.cursor.execute(
                "UPDATE empresa SET Nome = %s WHERE ID = %s", 
                (nome, id_empresa)
            )
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar empresa no banco de dados: {e}")
            raise e