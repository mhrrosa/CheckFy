class Projeto:
    def __init__(self, db):
        self.db = db

    def add_projeto(self, id_avaliacao, nome_projeto, projeto_habilitado, numero_projeto):
        query = "INSERT INTO projeto (ID_Avaliacao, Nome_Projeto, Projeto_Habilitado, Numero_Projeto) VALUES (%s, %s, %s, %s)"
        try:
            self.db.cursor.execute(query, (id_avaliacao, nome_projeto, projeto_habilitado, numero_projeto))
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao adicionar projeto: {e}")
            self.db.conn.rollback()
            raise

    def get_projetos_by_id_avaliacao(self, id_avaliacao):
        query_projetos = "SELECT * FROM projeto WHERE ID_Avaliacao = %s"
        
        self.db.cursor.execute(query_projetos, (id_avaliacao,))
        projetos = self.db.cursor.fetchall()

        projetos_com_documentos = []
        for projeto in projetos:
            query_documentos = """
            SELECT d.ID, d.Caminho_Arquivo, d.Nome_Arquivo, d.ID_Projeto 
            FROM documento d 
            WHERE d.ID_Projeto = %s
            """
            self.db.cursor.execute(query_documentos, (projeto[0],))
            documentos = self.db.cursor.fetchall()
            projetos_com_documentos.append({
                'ID': projeto[0],
                'ID_Avaliacao': projeto[1],
                'Projeto_Habilitado': projeto[2],
                'Numero_Projeto': projeto[3],
                'Nome_Projeto': projeto[4],
                'Documentos': [
                    {
                        'ID': doc[0],
                        'Caminho_Arquivo': doc[1],
                        'Nome_Arquivo': doc[2],
                        'ID_Projeto': doc[3]
                    } for doc in documentos
                ]
            })

        return projetos_com_documentos

    def update_projeto(self, projeto_id, nome_projeto, projeto_habilitado):
        query = "UPDATE projeto SET Nome_Projeto = %s, Projeto_Habilitado = %s WHERE ID = %s"
        self.db.cursor.execute(query, (nome_projeto, projeto_habilitado, projeto_id))
        self.db.conn.commit()

    def get_next_numero_projeto(self, id_avaliacao):
        query = "SELECT MAX(Numero_Projeto) FROM projeto WHERE ID_Avaliacao = %s"
        self.db.cursor.execute(query, (id_avaliacao,))
        result = self.db.cursor.fetchone()
        print(f"Próximo número de projeto: {result[0]}")
        return (result[0] or 0) + 1
