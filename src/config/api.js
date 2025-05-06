// Configuração da API
const API_URL = 'https://apitrack.trackpro.com.br/api';

// Endpoints da API
const endpoints = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    status: `${API_URL}/auth/status`,
  },
  links: {
    base: `${API_URL}/links`,
    stats: (linkId) => `${API_URL}/links/${linkId}/stats`,
  },
  reports: {
    daily: `${API_URL}/reports/daily`,
    weekly: `${API_URL}/reports/weekly`,
    monthly: `${API_URL}/reports/monthly`,
  },
  users: {
    base: `${API_URL}/users`,
  }
};

// Funções de utilidade para requisições à API
const api = {
  // Função para fazer login
  login: async (email, password) => {
    console.log('Chamando API de login:', endpoints.auth.login);
    console.log('Dados enviados:', { email, password: '******' });
    
    try {
      const response = await fetch(endpoints.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Erro na resposta da API:', error);
        throw new Error(error.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      console.log('Dados recebidos da API:', {
        token: data.token ? `${data.token.substring(0, 20)}...` : 'undefined',
        user: data.user
      });
      
      return data;
    } catch (error) {
      console.error('Exceção durante o login:', error);
      throw error;
    }
  },

  // Função para verificar o status do usuário
  checkStatus: async (token) => {
    const response = await fetch(endpoints.auth.status, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao verificar status');
    }

    return response.json();
  },

  // Função genérica para fazer requisições autenticadas
  request: async (url, method = 'GET', data = null, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Verificar se o token foi fornecido ou se existe no localStorage
    const authToken = token || localStorage.getItem('authToken');
    
    if (authToken) {
      console.log('Adicionando token à requisição:', authToken.substring(0, 15) + '...');
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      console.log('Nenhum token disponível para a requisição');
    }

    const options = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    // Construir a URL completa se for um caminho relativo
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    console.log(`Fazendo requisição ${method} para:`, fullUrl);

    try {
      const response = await fetch(fullUrl, options);
      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Erro na requisição');
      }

      return response.json();
    } catch (error) {
      console.error(`Erro na requisição ${method} para ${fullUrl}:`, error.message);
      throw error;
    }
  },

  // Método GET para requisições autenticadas
  get: async (path) => {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await api.request(path, 'GET', null, token);
      return response;
    } catch (error) {
      console.error(`Erro na requisição GET para ${path}:`, error.message);
      
      // Se o erro for de autenticação (401), limpar o token e redirecionar para login
      if (error.message.includes('não autorizado') || error.message.includes('token inválido') || error.message.includes('expirado')) {
        console.log('Token expirado ou inválido, redirecionando para login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('dashboardAuthenticated');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('userPlanStatus');
        localStorage.removeItem('userData');
        
        // Redirecionar para a página de login
        window.location.href = '/';
      }
      
      throw error;
    }
  },

  // Método POST para requisições autenticadas
  post: async (path, data) => {
    const token = localStorage.getItem('authToken');
    const url = `${API_URL}${path}`;
    
    return api.request(url, 'POST', data, token);
  },

  // Método PUT para requisições autenticadas
  put: async (path, data) => {
    const token = localStorage.getItem('authToken');
    const url = `${API_URL}${path}`;
    
    return api.request(url, 'PUT', data, token);
  },

  // Método PATCH para requisições autenticadas
  patch: async (path, data) => {
    const token = localStorage.getItem('authToken');
    const url = `${API_URL}${path}`;
    
    return api.request(url, 'PATCH', data, token);
  },

  // Método DELETE para requisições autenticadas
  delete: async (path) => {
    const token = localStorage.getItem('authToken');
    const url = `${API_URL}${path}`;
    
    return api.request(url, 'DELETE', null, token);
  }
};

export { API_URL, endpoints, api };
