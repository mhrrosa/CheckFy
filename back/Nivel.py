class Nivel:
    def __init__(self, db):
        self.db = db

    def add_nivel(self, nivel):
        self.db.cursor.execute("INSERT INTO nivel_maturidade_mpsbr (nivel) VALUES (%s)", (nivel,))
        self.db.conn.commit()

    def get_all_niveis_ordered(self):
        self.db.cursor.execute("SELECT * FROM nivel_maturidade_mpsbr ORDER BY nivel")
        result = self.db.cursor.fetchall()
        return result

    def delete_nivel(self, nivel_id):
        self.db.cursor.execute("DELETE FROM nivel_maturidade_mpsbr WHERE id = %s", (nivel_id,))
        self.db.conn.commit()

    def update_nivel(self, nivel_id, novo_nivel):
        novo_nivel_aux = novo_nivel['nivel']
        self.db.cursor.execute("UPDATE nivel_maturidade_mpsbr SET nivel = %s WHERE id = %s", (novo_nivel_aux, nivel_id))
        self.db.conn.commit()
