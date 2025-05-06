import api from './api';

const StatsService = {
  // Obter estatísticas gerais
  getGeneralStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas gerais:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao buscar estatísticas gerais. Tente novamente mais tarde.'
      };
    }
  },

  // Obter estatísticas diárias
  getDailyStats: async (startDate, endDate) => {
    try {
      const response = await api.get('/stats/daily', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas diárias:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao buscar estatísticas diárias. Tente novamente mais tarde.'
      };
    }
  },

  // Obter estatísticas de um link específico
  getLinkStats: async (linkId) => {
    try {
      const response = await api.get(`/stats/link/${linkId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar estatísticas do link ${linkId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Erro ao buscar estatísticas do link. Tente novamente mais tarde.`
      };
    }
  },

  // Obter links para seleção nos relatórios
  getLinks: async () => {
    try {
      const response = await api.get('/links');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      return {
        success: false,
        links: [],
        message: error.response?.data?.message || 'Erro ao buscar links. Tente novamente mais tarde.'
      };
    }
  },

  // Obter estatísticas diárias de um link específico
  getLinkDailyStats: async (linkId, startDate, endDate) => {
    try {
      const response = await api.get(`/stats/link/${linkId}/daily`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar estatísticas diárias do link ${linkId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Erro ao buscar estatísticas diárias do link. Tente novamente mais tarde.`
      };
    }
  },

  // Obter entradas detalhadas de um link
  getLinkDetailedEntries: async (linkId, startDate, endDate) => {
    try {
      const response = await api.get(`/stats/link/${linkId}/detailed`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar entradas detalhadas do link ${linkId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Erro ao buscar entradas detalhadas do link. Tente novamente mais tarde.`
      };
    }
  }
};

export default StatsService;
