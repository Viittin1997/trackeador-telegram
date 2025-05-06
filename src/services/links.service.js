import api from './api';

const LinksService = {
  // Obter todos os links
  getLinks: async () => {
    try {
      const response = await api.get('/links');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      return {
        success: false,
        links: [],
        message: error.response?.data?.message || 'Erro ao buscar links. Tente novamente mais tarde.',
        status_plano: localStorage.getItem('userPlanStatus') || 'ativo'
      };
    }
  },

  // Obter um link específico por ID
  getLinkById: async (id) => {
    try {
      const response = await api.get(`/links/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar link ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Erro ao buscar link ${id}. Tente novamente mais tarde.`
      };
    }
  },

  // Criar um novo link
  createLink: async (linkData) => {
    try {
      const response = await api.post('/links', linkData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar link:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar link. Tente novamente mais tarde.'
      };
    }
  },

  // Atualizar um link existente
  updateLink: async (id, linkData) => {
    try {
      const response = await api.put(`/links/${id}`, linkData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar link ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Erro ao atualizar link ${id}. Tente novamente mais tarde.`
      };
    }
  },

  // Excluir um link
  deleteLink: async (id) => {
    try {
      const response = await api.delete(`/links/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir link ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Erro ao excluir link ${id}. Tente novamente mais tarde.`
      };
    }
  }
};

export default LinksService;
