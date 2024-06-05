class Documento:
    def __init__(self, db):
        self.db = db

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

    def delete_documento(self, documento_id):
        try:
            # Deletar as referências na tabela evidencia primeiro
            delete_evidencia_query = "DELETE FROM evidencia WHERE ID_Documento = %s"
            self.db.cursor.execute(delete_evidencia_query, (documento_id,))
            self.db.conn.commit()

            # Deletar o documento na tabela documento
            delete_documento_query = "DELETE FROM documento WHERE ID = %s"
            self.db.cursor.execute(delete_documento_query, (documento_id,))
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao deletar documento: {e}")
            self.db.conn.rollback()
            raise

    def get_documentos_by_projeto(self, id_projeto):
        query = "SELECT * FROM documento WHERE ID_Projeto = %s"
        self.db.cursor.execute(query, (id_projeto,))
        return self.db.cursor.fetchall()
