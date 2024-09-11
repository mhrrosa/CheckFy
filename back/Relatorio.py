class Relatorio:
    def __init__(self, db):
        self.db = db

    def inserir_relatorio_inicial(self, descricao, id_avaliacao, caminho_arquivo):
        try:
            query = """
                INSERT INTO relatorio (Descricao, ID_Tipo, ID_Avaliacao, Caminho_Arquivo)
                VALUES (%s, %s, %s, %s)
            """
            values = (descricao, 1, id_avaliacao, caminho_arquivo)
            self.db.cursor.execute(query, values)
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao inserir relatório: {e}")
            self.db.conn.rollback()
            raise

    def atualizar_relatorio_inicial(self, descricao, id_avaliacao, caminho_arquivo):
        try:
            query = """
                UPDATE relatorio
                SET Descricao = %s, Caminho_Arquivo = %s
                WHERE ID_Avaliacao = %s AND ID_Tipo = 1
            """
            values = (descricao, caminho_arquivo, id_avaliacao)
            self.db.cursor.execute(query, values)
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar relatório: {e}")
            self.db.conn.rollback()
            raise

    def obter_relatorio_inicial(self, id_avaliacao):
        try:
            query = """
                SELECT Descricao, Caminho_Arquivo
                FROM relatorio
                WHERE ID_Avaliacao = %s AND ID_Tipo = 1
            """
            self.db.cursor.execute(query, (id_avaliacao,))
            result = self.db.cursor.fetchone()
            if result:
                return {"descricao": result[0], "caminhoArquivo": result[1]}
            return None
        except Exception as e:
            print(f"Erro ao obter relatório: {e}")
            raise
    
    # Métodos para a ata de reunião de abertura
    def inserir_ata_abertura(self, descricao, id_avaliacao):
        try:
            query = """
                INSERT INTO relatorio (Descricao, ID_Tipo, ID_Avaliacao, Caminho_Arquivo)
                VALUES (%s, %s, %s, %s)
            """
            values = (descricao, 2, id_avaliacao, 'não existe')
            self.db.cursor.execute(query, values)
            self.db.conn.commit()
            return self.db.cursor.lastrowid
        except Exception as e:
            print(f"Erro ao inserir ata de abertura: {e}")
            self.db.conn.rollback()
            raise

    def atualizar_ata_abertura(self, descricao, id_avaliacao):
        try:
            query = """
                UPDATE relatorio
                SET Descricao = %s, Caminho_Arquivo = %s
                WHERE ID_Avaliacao = %s AND ID_Tipo = 2
            """
            values = (descricao, 'não existe', id_avaliacao)
            self.db.cursor.execute(query, values)
            self.db.conn.commit()
        except Exception as e:
            print(f"Erro ao atualizar ata de abertura: {e}")
            self.db.conn.rollback()
            raise

    def obter_ata_abertura(self, id_avaliacao):
        try:
            query = """
                SELECT Descricao, Caminho_Arquivo
                FROM relatorio
                WHERE ID_Avaliacao = %s AND ID_Tipo = 2
            """
            self.db.cursor.execute(query, (id_avaliacao,))
            result = self.db.cursor.fetchone()
            if result:
                return {"descricao": result[0], "caminhoArquivo": result[1]}
            return None
        except Exception as e:
            print(f"Erro ao obter ata de abertura: {e}")
            raise