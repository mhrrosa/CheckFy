class ResultadoEsperado:
    def __init__(self, db):
        self.db = db

    def add_resultado_esperado(self, descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo):
        query = "INSERT INTO resultado_esperado_mpsbr (Descricao, ID_Nivel_Intervalo_Inicio, ID_Nivel_Intervalo_Fim, ID_Processo) VALUES (%s, %s, %s, %s)"
        print(f"Executando query: {query} com valores ({descricao}, {id_nivel_intervalo_inicio}, {id_nivel_intervalo_fim}, {id_processo})")
        self.db.execute_query(query, (descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo))

    def update_resultado_esperado(self, resultado_id, nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo):
        print(f"Atualizando resultado esperado ID {resultado_id}")
        query = "UPDATE resultado_esperado_mpsbr SET Descricao = %s, ID_Nivel_Intervalo_Inicio = %s, ID_Nivel_Intervalo_Fim = %s, ID_Processo = %s WHERE ID = %s"
        self.db.execute_query(query, (nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo, resultado_id))

    def delete_resultado_esperado(self, resultado_id):
        query = "DELETE FROM resultado_esperado_mpsbr WHERE ID = %s"
        print(f"Executando query: {query} com valor ({resultado_id})")
        self.db.execute_query(query, (resultado_id,))

    def get_resultados_esperados(self, id_processos):
        placeholders = ', '.join(['%s'] * len(id_processos))
        print(id_processos, placeholders, tuple(id_processos))
        resultados = self.db.fetch_all(f"SELECT * FROM resultado_esperado_mpsbr WHERE ID_Processo IN ({placeholders})", tuple(id_processos))
        return resultados