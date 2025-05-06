import React, { useState, useEffect, useCallback } from 'react';
import LinksService from '../services/links.service';
import Modal from './Modal'; // Ajuste o caminho conforme necessário
import LinkForm from './LinkForm'; // Ajuste o caminho conforme necessário
import PlanoBloqueado from './PlanoBloqueado';
import LinkStats from './LinkStats'; // Importar o novo componente de estatísticas

const Dashboard = ({ setCurrentTab, currentTab }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(10);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedLinkStats, setSelectedLinkStats] = useState(null);
  const [userType, setUserType] = useState('user');
  const [planStatus, setPlanStatus] = useState('ativo');

  // eslint-disable-next-line no-unused-vars
  const calculateStats = useCallback((link) => {
    const entryPercentage = link.entrada_total_grupo > 0 
      ? ((link.quantidade_entrada / link.entrada_total_grupo) * 100).toFixed(2) 
      : 0;
    
    // Calcular média diária de entradas
    const createdAt = link.created_at ? new Date(link.created_at) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const entriesPerDay = diffDays > 0 
      ? (link.quantidade_entrada / diffDays).toFixed(1) 
      : link.quantidade_entrada;
    
    return {
      entryPercentage,
      entriesPerDay
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  const getColorByPerformance = useCallback((value, higherIsBetter, reference = 50) => {
    const numValue = parseFloat(value);
    
    if (higherIsBetter) {
      // Quanto maior o valor, melhor o desempenho
      if (numValue >= reference * 1.5) return '#34a853'; // Verde escuro
      if (numValue >= reference) return '#4CAF50'; // Verde
      if (numValue >= reference * 0.5) return '#FFC107'; // Amarelo
      return '#F44336'; // Vermelho
    } else {
      // Quanto menor o valor, melhor o desempenho
      if (numValue <= reference * 0.5) return '#34a853'; // Verde escuro
      if (numValue <= reference) return '#4CAF50'; // Verde
      if (numValue <= reference * 1.5) return '#FFC107'; // Amarelo
      return '#F44336'; // Vermelho
    }
  }, []);

  // Buscar links do usuário
  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obter dados do usuário do localStorage
      let userType = 'user';
      let planStatus = 'ativo';
      let userId = '';
      
      // Tentar obter do objeto userData completo primeiro
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.tipo) {
          userType = userData.tipo;
          planStatus = userData.status_plano || 'ativo';
          userId = userData.uu_id || '';
          console.log('Dados obtidos do objeto userData:', { userType, planStatus, userId });
        } else {
          // Fallback para os campos individuais
          userType = localStorage.getItem('userType') || 'user';
          planStatus = localStorage.getItem('userPlanStatus') || 'ativo';
          userId = localStorage.getItem('userId') || '';
          console.log('Dados obtidos dos campos individuais:', { userType, planStatus, userId });
        }
      } catch (e) {
        // Fallback para os campos individuais em caso de erro
        userType = localStorage.getItem('userType') || 'user';
        planStatus = localStorage.getItem('userPlanStatus') || 'ativo';
        userId = localStorage.getItem('userId') || '';
        console.log('Erro ao obter userData, usando campos individuais:', { userType, planStatus, userId });
      }
      
      setUserType(userType);
      setPlanStatus(planStatus);
      
      console.log('Dados do usuário para busca de links:', { userType, planStatus, userId });
      
      // Buscar links usando o serviço
      const response = await LinksService.getLinks();
      console.log('Resposta da API:', response);
      
      // Verificar se a resposta foi bem-sucedida
      if (response.success === false) {
        console.error('Erro ao buscar links:', response.message);
        setLinks([]);
        setLoading(false);
        return;
      }
      
      // Verificar se a resposta contém a propriedade status_plano e atualizá-la no localStorage e state
      if (response.status_plano) {
        setPlanStatus(response.status_plano);
        localStorage.setItem('userPlanStatus', response.status_plano);
        
        // Atualizar também no objeto userData se existir
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (userData.tipo) {
            userData.status_plano = response.status_plano;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        } catch (e) {
          console.error('Erro ao atualizar status_plano no userData:', e);
        }
      }
      
      // Verificar se a resposta contém a propriedade links
      const linksData = response.links || (Array.isArray(response) ? response : []);
      setLinks(linksData);
      
      // Não mostrar mensagem de alerta aqui, será mostrado apenas o componente PlanoBloqueado
    } catch (error) {
      console.error('Erro ao buscar links:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar links ao montar o componente
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Filtrar links com base no termo de busca
  const filteredLinks = links.filter(link => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      link.nome_link?.toLowerCase().includes(searchTermLower) ||
      link.expert_apelido?.toLowerCase().includes(searchTermLower) ||
      link.group_name?.toLowerCase().includes(searchTermLower)
    );
  });

  // Paginação
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);

  // Função para mudar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Manipuladores de eventos
  const handleEdit = (link) => {
    setEditingLink(link);
  };

  const handleUpdate = async (updatedLink) => {
    try {
      await LinksService.updateLink(updatedLink.id, updatedLink);
      setEditingLink(null);
      fetchLinks(); // Recarregar links após atualização
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
    }
  };

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;
    
    try {
      await LinksService.deleteLink(linkToDelete.id);
      setIsDeleteModalOpen(false);
      setLinkToDelete(null);
      fetchLinks(); // Recarregar links após exclusão
    } catch (error) {
      console.error('Erro ao excluir link:', error);
    }
  };

  const handleStatsClick = (link) => {
    setSelectedLinkStats(link);
    setStatsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard de Links</h2>
        <button onClick={fetchLinks} className="button button-update">
          Atualizar Dados
        </button>
      </div>

      {/* Barra de busca */}
      <div className="search-container">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Buscar por nome do link ou apelido do expert..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Resetar para a primeira página ao buscar
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Carregando...</div>
      ) : userType !== 'admin' && (planStatus === 'suspenso' || planStatus === 'cancelado') ? (
        <PlanoBloqueado 
          status={planStatus}
        />
      ) : filteredLinks.length === 0 ? (
        <div className="no-links-message">
          <p>Você ainda não possui links cadastrados.</p>
          <button 
            className="button"
            onClick={() => setCurrentTab('cadastro')}
          >
            Cadastrar meu primeiro link
          </button>
        </div>
      ) : (
        <>
          <div className="cards-grid">
            {currentLinks.map((link) => (
              <div key={link.id} className="card">
                <div className="card-header">
                  <h3 className="card-title">{link.group_name || 'Sem nome de grupo'}</h3>
                  <p className="card-subtitle">Expert: {link.expert_apelido || 'Não definido'}</p>
                </div>
                
                <div className="card-stats">
                  <div className="stats-row">
                    <span>Entradas pelo link:</span>
                    <span style={{ color: '#34a853', fontWeight: 'bold' }}>{link.quantidade_entrada || 0}</span>
                  </div>
                  <div className="stats-row">
                    <span>Entradas totais:</span>
                    <span style={{ color: '#4285F4', fontWeight: 'bold' }}>{link.entrada_total_grupo || 0}</span>
                  </div>
                  <div className="stats-row">
                    <span>Leads:</span>
                    <span style={{ color: '#34a853', fontWeight: 'bold' }}>{link.lead_count || 0}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <p><strong>Nome:</strong> {link.nome_link}</p>
                  <p><strong>Link:</strong> <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a></p>
                  <p><strong>ID do Canal:</strong> {link.id_channel_telegram || 'Não definido'}</p>
                  <p><strong>Pixel ID:</strong> {link.pixel_id || 'Não definido'}</p>
                  <p><strong>Data de Criação:</strong> {link.created_at ? new Date(link.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Não disponível'}</p>
                </div>

                <div className="card-actions">
                  <button 
                    className="button" 
                    onClick={() => handleEdit(link)}
                  >
                    Editar
                  </button>
                  <button 
                    className="button button-danger" 
                    onClick={() => handleDeleteClick(link)}
                  >
                    Excluir
                  </button>
                  <button 
                    className="button" 
                    onClick={() => handleStatsClick(link)}
                  >
                    Estatísticas
                  </button>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    Abrir Link →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                &laquo; Anterior
              </button>
              
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Próxima &raquo;
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de edição */}
      {editingLink && (
        <Modal
          isOpen={!!editingLink}
          onClose={() => setEditingLink(null)}
          title="Editar Link"
        >
          <LinkForm
            initialData={editingLink}
            onSubmit={handleUpdate}
            buttonText="Atualizar"
          />
        </Modal>
      )}

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        className="modal-confirm"
        footer={
          <div>
            <button 
              className="button"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </button>
            <button 
              className="button button-danger"
              onClick={handleDelete}
            >
              Excluir
            </button>
          </div>
        }
      >
        <p>Tem certeza que deseja excluir o link "{linkToDelete?.nome_link}"?</p>
        <p className="confirm-warning">Esta ação não pode ser desfeita.</p>
      </Modal>
      
      {/* Modal de Estatísticas */}
      <Modal
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        title={`Estatísticas: ${selectedLinkStats?.nome_link}`}
        className="modal-stats"
      >
        {selectedLinkStats && <LinkStats linkStats={selectedLinkStats} />}
      </Modal>
    </div>
  );
};

export default Dashboard;
