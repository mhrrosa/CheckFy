const mockApiCall = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simule diferentes respostas alterando o array abaixo
        resolve([2, 2, 3,1,1,1,1,2,3,3]);
      }, 1000); // Delay de 1000ms
    });
  };
  
  export { mockApiCall };