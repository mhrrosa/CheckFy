class Projeto:
    def __init__(self, db):
        self.db = db

    def add_projeto(self, id_avaliacao, projeto_habilitado, numero_projeto):
        print(f"Adicionando projeto: id_avaliacao={id_avaliacao}, projeto_habilitado={projeto_habilitado}, numero_projeto={numero_projeto}")
        query = "INSERT INTO projeto (ID_Avaliacao, Projeto_Habilitado, Numero_Projeto) VALUES (%s, %s, %s)"
        try:
            self.db.cursor.execute(query, (id_avaliacao, projeto_habilitado, numero_projeto))
            self.db.conn.commit()
            print(f"Projeto adicionado com sucesso: {self.db.cursor.lastrowid}")
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
            query_documentos = "SELECT * FROM documento WHERE ID_Projeto = %s"
            self.db.cursor.execute(query_documentos, (projeto[0],))  # Acessando o campo ID da tabela projeto
            documentos = self.db.cursor.fetchall()
            projetos_com_documentos.append({
                'ID': projeto[0],
                'ID_Avaliacao': projeto[1],
                'Projeto_Habilitado': projeto[2],
                'Numero_Projeto': projeto[3],
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

    def update_projeto(self, projeto_id, projeto_habilitado):
        query = "UPDATE projeto SET Projeto_Habilitado = %s WHERE ID = %s"
        self.db.cursor.execute(query, (projeto_habilitado, projeto_id))
        self.db.conn.commit()

    def add_documento(self, caminho_arquivo, nome_arquivo, id_projeto):
        print(f"Adicionando documento: caminho_arquivo={caminho_arquivo}, nome_arquivo={nome_arquivo}, id_projeto={id_projeto}")
        query = "INSERT INTO documento (Caminho_Arquivo, Nome_Arquivo, ID_Projeto) VALUES (%s, %s, %s)"
        try:
            self.db.cursor.execute(query, (caminho_arquivo, nome_arquivo, id_projeto))
            self.db.conn.commit()
            print(f"Documento adicionado com sucesso: {self.db.cursor.lastrowid}")
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao adicionar documento: {e}")
            self.db.conn.rollback()
            raise

    def get_documentos_by_projeto(self, id_projeto):
        query = "SELECT * FROM documento WHERE ID_Projeto = %s"
        self.db.cursor.execute(query, (id_projeto,))
        return self.db.cursor.fetchall()
    
    def update_documento(self, documento_id, nome_arquivo, caminho_arquivo):
        print(f"Atualizando documento: id={documento_id}, caminho_arquivo={caminho_arquivo}, nome_arquivo={nome_arquivo}")
        query = "UPDATE documento SET Nome_Arquivo = %s, Caminho_Arquivo = %s WHERE ID = %s"
        try:
            self.db.cursor.execute(query, (nome_arquivo, caminho_arquivo, documento_id))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar documento: {e}")
            self.db.conn.rollback()
            raise

    def get_next_numero_projeto(self, id_avaliacao):
        print(f"Buscando próximo número de projeto para id_avaliacao={id_avaliacao}")
        query = "SELECT MAX(Numero_Projeto) FROM projeto WHERE ID_Avaliacao = %s"
        self.db.cursor.execute(query, (id_avaliacao,))
        result = self.db.cursor.fetchone()
        print(f"Próximo número de projeto: {result[0]}")
        return (result[0] or 0) + 1