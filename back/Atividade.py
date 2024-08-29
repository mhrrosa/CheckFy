class Atividade:
    def __init__(self, db):
        self.db = db

    def get_atividades(self):
        try:
            self.db.cursor.execute("SELECT ID, Descricao FROM atividade")
            result = self.db.cursor.fetchall()
            atividades_list = [
                {"ID": atividade[0], "Descricao": atividade[1]} for atividade in result
            ]
            return atividades_list
        except Exception as e:
            print(f"Erro ao buscar atividades: {e}")
            raise e
