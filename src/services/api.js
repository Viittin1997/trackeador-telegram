import axios from 'axios';

// Cria uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: 'https://apitrack.trackpro.com.br/api',
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token adicionado à requisição:', token.substring(0, 15) + '...');
    } else {
      console.warn('Nenhum token de autenticação encontrado no localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Não autorizado), redirecionar para a página de login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      localStorage.removeItem('userPlanStatus');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
