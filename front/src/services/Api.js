class Api {
  static baseUrl = 'http://localhost:3000/api';

  static post(url, data) {
    console.log(`POST Request to: ${url} with data:`, data);
  }

  static generateRandomArray() {
    const length = Math.floor(Math.random() * 5) + 3; // Gera entre 3 e 7 elementos
    return Array.from({ length }, () => Math.floor(Math.random() * 5) + 1);
  }

  static startNewEvaluation(data) {
    const url = `${this.baseUrl}/start-evaluation`;
    console.log('Enviando dados para iniciar nova avaliação:', data);
    this.post(url, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = this.generateRandomArray();
        console.log('Resposta do início da avaliação:', response);
        resolve(response);
      }, 1000);
    });
  }

  static submitEvaluationData(data) {
    const url = `${this.baseUrl}/submit-data`;
    console.log('Dados enviados para avaliação:', data);
    this.post(url, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Decidir aleatoriamente se a avaliação termina
        if (Math.random() > 0.7) { // 30% de chance de finalizar
          console.log('Avaliação finalizada');
          resolve({ finalizada: true });
        } else {
          const newSetup = this.generateRandomArray();
          console.log('Nova configuração recebida do back-end:', newSetup);
          resolve({ setup: newSetup });
        }
      }, 1000);
    });
  }
}

export default Api;