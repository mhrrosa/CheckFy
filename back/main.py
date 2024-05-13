from flask import Flask, request, jsonify
from flask_cors import CORS
from Database import Database
from Nivel import Nivel
from Processo import Processo
from ResultadoEsperado import ResultadoEsperado

app = Flask(__name__)
CORS(app) 

# Conexão com o banco de dados MySQL
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "root",
    "database": "checkfy"
}

#criando objetos
db = Database(**db_config)
nivel = Nivel(db)
processo = Processo(db)
resultado_esperado = ResultadoEsperado(db)

# main.py
@app.route('/add_nivel', methods=['POST'])
def add_nivel():
    nivel_data = request.json

    # Verificar se a chave correta está presente no JSON
    if 'nivel' not in nivel_data:
        return jsonify({"message": "Campo 'nivel' ausente no JSON"}), 400

    try:
        # Usar a chave correta 'nivel' para passar para o método
        nivel.add_nivel(nivel_data['nivel'])
        return jsonify({"message": "Nível adicionado com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao adicionar nível: {e}")  # Mostra o erro específico
        return jsonify({"message": "Erro ao adicionar nível", "error": str(e)}), 500


@app.route('/get_all_niveis', methods=['GET'])
def get_all_niveis():
    niveis = nivel.get_all_niveis_ordered()
    return jsonify(niveis), 200

@app.route('/delete_nivel/<int:nivel_id>', methods=['DELETE'])
def delete_nivel(nivel_id):
    nivel.delete_nivel(nivel_id)
    return jsonify({"message": "Nível deletado com sucesso"}), 200

@app.route('/update_nivel/<int:nivel_id>', methods=['PUT'])
def update_nivel(nivel_id):
    nivel_data = request.json
    nivel.update_nivel(nivel_id, nivel_data)
    return jsonify({"message": "Nível atualizado com sucesso"}), 200


@app.route('/add_processo', methods=['POST'])
def add_processo():
    descricao = request.json['descricao']
    tipo = request.json['tipo']
    processo.add_processo(descricao, tipo)
    return jsonify({"message": "Processo adicionado com sucesso"}), 200

@app.route('/get_all_processos', methods=['GET'])
def get_all_processos():
    processos = processo.get_all_processos()
    return jsonify(processos), 200

@app.route('/delete_processo/<int:processo_id>', methods=['DELETE'])
def delete_processo(processo_id):
    processo.delete_processo(processo_id)
    return jsonify({"message": "Processo deletado com sucesso"}), 200

@app.route('/update_processo/<int:processo_id>', methods=['PUT'])
def update_processo(processo_id):
    nova_descricao = request.json['nova_descricao']
    novo_tipo = request.json['novo_tipo']
    processo.update_processo(processo_id, nova_descricao, novo_tipo)
    return jsonify({"message": "Processo atualizado com sucesso"}), 200

@app.route('/add_resultado_esperado', methods=['POST'])
def add_resultado_esperado():
    data = request.json
    descricao = data['descricao']
    id_nivel_intervalo_inicio = data['id_nivel_intervalo_inicio']
    id_nivel_intervalo_fim = data['id_nivel_intervalo_fim']
    id_processo = data['id_processo']
    resultado_esperado.add_resultado_esperado(descricao, id_nivel_intervalo_inicio, id_nivel_intervalo_fim, id_processo)
    return jsonify({"message": "Resultado esperado adicionado com sucesso"}), 200

@app.route('/get_all_resultados_esperados', methods=['GET'])
def get_all_resultados_esperados():
    resultados_esperados = resultado_esperado.get_all_resultados_esperados()
    return jsonify(resultados_esperados), 200

@app.route('/delete_resultado_esperado/<int:resultado_id>', methods=['DELETE'])
def delete_resultado_esperado(resultado_id):
    resultado_esperado.delete_resultado_esperado(resultado_id)
    return jsonify({"message": "Resultado esperado deletado com sucesso"}), 200

@app.route('/update_resultado_esperado/<int:resultado_id>', methods=['PUT'])
def update_resultado_esperado(resultado_id):
    data = request.json
    nova_descricao = data['nova_descricao']
    novo_id_nivel_intervalo_inicio = data['novo_id_nivel_intervalo_inicio']
    novo_id_nivel_intervalo_fim = data['novo_id_nivel_intervalo_fim']
    novo_id_processo = data['novo_id_processo']
    resultado_esperado.update_resultado_esperado(resultado_id, nova_descricao, novo_id_nivel_intervalo_inicio, novo_id_nivel_intervalo_fim, novo_id_processo)
    return jsonify({"message": "Resultado esperado atualizado com sucesso"}), 200

if __name__ == '__main__':
    app.run(debug=True)