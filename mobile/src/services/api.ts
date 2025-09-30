import axios from 'axios';

// Para teste em dispositivo físico, use o IP da sua máquina na rede local
const baseURL = 'http://localhost:3000';

const api = axios.create({
  baseURL,
});

export default api;