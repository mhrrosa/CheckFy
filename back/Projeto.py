class Projeto:
    def __init__(self, db):
        self.db = db

    def add_projeto(self, id_avaliacao, projeto_habilitado, numero_projeto):
        self.db.cursor.execute("INSERT INTO projeto (ID_Avaliacao, Projeto_Habilitado, Numero_Projeto) VALUES (%s, %s, %s)", (id_avaliacao, projeto_habilitado, numero_projeto,))
        self.db.conn.commit()

    def get_projetos_by_id_avaliacao(self, id_avaliacao):
        query = "SELECT * FROM projeto WHERE ID_Avaliacao = %s"
        print(f"Executando query: {query}")
        self.db.cursor.execute(query, (id_avaliacao,))
        result = self.db.cursor.fetchall()
        return result

    def delete_projeto(self, projeto_id):
        self.db.cursor.execute("DELETE FROM projeto WHERE ID = %s", (projeto_id,))
        self.db.conn.commit()

    def update_projeto(self, projeto_id, novo_projeto):
        id_avaliacao = novo_projeto['id_avaliacao']
        projeto_habilitado = novo_projeto['projeto_habilitado']
        numero_projeto = novo_projeto['numero_projeto']
        self.db.cursor.execute("UPDATE projeto SET ID_Avaliacao = %s, Projeto_Habilitado = %s, Numero_Projeto = %s WHERE ID = %s", (id_avaliacao, projeto_habilitado, numero_projeto, projeto_id))
        self.db.conn.commit()
