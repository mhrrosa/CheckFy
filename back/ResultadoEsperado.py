class ResultadoEsperado:
    def __init__(self, db):
        self.db = db

    def add_resultado_esperado(self, descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo):
        self.db.cursor.execute("INSERT INTO resultado_esperado_mpsbr (Descricao, ID_Nivel_Intervalo_Inicio, ID_Nivel_Intervalo_Fim, ID_Processo) VALUES (%s, %s, %s, %s)",
                               (descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo))
        self.db.conn.commit()

    def update_resultado_esperado(self, resultado_id, nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo):
        self.db.cursor.execute("UPDATE resultado_esperado_mpsbr SET Descricao = %s, ID_Nivel_Intervalo_Inicio = %s, ID_Nivel_Intervalo_Fim = %s, ID_Processo = %s WHERE ID = %s",
                               (nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo, resultado_id))
        self.db.conn.commit()

    def delete_resultado_esperado(self, resultado_id):
        self.db.cursor.execute("DELETE FROM resultado_esperado_mpsbr WHERE ID = %s", (resultado_id,))
        self.db.conn.commit()

    def get_all_resultados_esperados(self):
        self.db.cursor.execute("SELECT * FROM resultado_esperado_mpsbr")
        result = self.db.cursor.fetchall()
        return result
