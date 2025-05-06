import { api } from '../config/api';
import { clearUserData } from '../utils/indexedDBUtil';

// Serviço de autenticação
const AuthService = {
  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  },

  // Obter token de autenticação
  getToken: () => {
    // Tentar obter o token do sessionStorage primeiro, depois do localStorage
    return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  },

  // Obter dados do usuário do localStorage
  getUserData: () => {
    return {
      id: localStorage.getItem('userId'),
      tipo: localStorage.getItem('userType'),
      status_plano: localStorage.getItem('userPlanStatus')
    };
  },

  // Fazer login
  login: async (email, password) => {
    try {
      const response = await api.login(email, password);
      console.log('Resposta do login:', response);
      
      if (!response || !response.token) {
        console.error('Resposta de login inválida:', response);
        throw new Error('Resposta de login inválida');
      }
      
      // Salvar token no localStorage e sessionStorage
      localStorage.setItem('authToken', response.token);
      sessionStorage.setItem('authToken', response.token);
      console.log('Token salvo no localStorage e sessionStorage');
      
      // Salvar dados do usuário no localStorage
      localStorage.setItem('dashboardAuthenticated', 'true');
      localStorage.setItem('userType', response.user.tipo);
      localStorage.setItem('userId', response.user.userId || response.user.uu_id); 
      localStorage.setItem('userPlanStatus', response.user.status_plano || 'ativo');
      
      // Salvar os dados completos do usuário para uso offline
      try {
        localStorage.setItem('userData', JSON.stringify(response.user));
        console.log('Dados do usuário salvos no localStorage');
      } catch (e) {
        console.error('Erro ao salvar dados do usuário no localStorage:', e);
      }
      
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Verificar status do usuário
  checkStatus: async () => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Verificando status do usuário com token:', token.substring(0, 15) + '...');
      
      // Usar o endpoint correto para verificar o status
      const apiUrl = 'https://apitrack.trackpro.com.br/api';
      console.log('URL da API para verificação de status:', apiUrl);
      
      // Primeiro, vamos verificar se o token é válido decodificando-o localmente
      try {
        // Decodificar o token JWT (sem verificar a assinatura)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Token JWT inválido');
        }
        
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Payload do token:', payload);
        
        // Verificar se o token expirou
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          throw new Error('Token expirado');
        }
        
        // Se chegou até aqui, o token é válido
        // Tentar recuperar os dados do usuário do localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          console.log('Dados do usuário recuperados do localStorage:', user);
          
          return {
            user: {
              userId: user.uu_id || user.userId || user.id,
              uu_id: user.uu_id || user.userId || user.id,
              id: user.uu_id || user.userId || user.id,
              email: user.email,
              tipo: user.tipo,
              nome: user.nome || '',
              status_plano: user.status_plano || 'ativo'
            }
          };
        }
        
        // Se não conseguir recuperar os dados do localStorage, tentar fazer a requisição
        const response = await fetch(`${apiUrl}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Status da resposta de verificação:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erro na verificação de status:', errorData);
          throw new Error(errorData.message || 'Erro ao verificar status do usuário');
        }
        
        const data = await response.json();
        console.log('Dados do usuário recebidos da API:', data);
        
        return data;
      } catch (tokenError) {
        console.error('Erro ao decodificar token:', tokenError);
        
        // Se não conseguir decodificar o token, tentar fazer a requisição
        const response = await fetch(`${apiUrl}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Token inválido ou expirado');
        }
        
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Erro ao verificar status do usuário:', error);
      throw error;
    }
  },

  // Fazer logout
  logout: () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('dashboardAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userPlanStatus');
    localStorage.removeItem('userData');
    
    // Limpar dados do IndexedDB
    try {
      clearUserData();
    } catch (error) {
      console.error('Erro ao limpar dados do IndexedDB:', error);
    }
  },

  // Obter lista de usuários (apenas para administradores)
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      
      // Verificar se há erro na resposta
      if (response.error) {
        console.error('Erro ao buscar usuários:', response.error);
        return { error: response.error };
      }
      
      // Retornar os dados no formato esperado pelo componente
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return { error };
    }
  },

  // Atualizar status do plano de um usuário
  updateUserStatus: async (userId, status, dataTeste) => {
    try {
      const response = await api.patch(`/users/${userId}/status`, { 
        status_plano: status,
        data_teste: dataTeste
      });
      return { data: response.data };
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      return { error };
    }
  }
};

export default AuthService;
