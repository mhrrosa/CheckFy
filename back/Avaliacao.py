class Avaliacao:
    def __init__(self, db):
        self.db = db

    def adicionar_avaliacao(self, nome, descricao, id_avaliador_lider, status, modelo, id_atividade, id_empresa, id_nivel_solicitado, id_nivel_atribuido, parece_nivel_final):
        query = "INSERT INTO avaliacao (Nome, Descricao, ID_Avaliador_Lider, Status, Modelo, ID_Atividade, ID_Empresa, ID_Nivel_Solicitado, ID_Nivel_Atribuido, Parece_Nivel_Final) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        values = (nome, descricao, id_avaliador_lider, status, modelo, id_atividade, id_empresa, id_nivel_solicitado, id_nivel_atribuido, parece_nivel_final)
        self.db.cursor.execute(query, values)
        self.db.conn.commit()

    def listar_avaliacoes(self):
        query = "SELECT * FROM avaliacao"
        print(f"Executando query: {query}")
        self.db.cursor.execute(query)
        result = self.db.cursor.fetchall()
        return result

    def deletar_avaliacao(self, projeto_id):
        query = "DELETE FROM avaliacao WHERE ID = %s"
        self.db.cursor.execute(query, (projeto_id,))
        self.db.conn.commit()

    def atualizar_avaliacao(self, projeto_id, novo_nome, nova_descricao, novo_id_avaliador_lider, novo_status, novo_modelo, novo_id_atividade, novo_id_empresa, novo_id_nivel_solicitado, novo_id_nivel_atribuido, novo_parece_nivel_final):
        query = "UPDATE avaliacao SET Nome = %s, Descricao = %s, ID_Avaliador_Lider = %s, Status = %s, Modelo = %s, ID_Atividade = %s, ID_Empresa = %s, ID_Nivel_Solicitado = %s, ID_Nivel_Atribuido = %s, Parece_Nivel_Final = %s WHERE ID = %s"
        values = (novo_nome, nova_descricao, novo_id_avaliador_lider, novo_status, novo_modelo, novo_id_atividade, novo_id_empresa, novo_id_nivel_solicitado, novo_id_nivel_atribuido, novo_parece_nivel_final, projeto_id)
        self.db.cursor.execute(query, values)
        self.db.conn.commit()
