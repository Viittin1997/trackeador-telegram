import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

// Dados de exemplo para testes quando o banco de dados estiver indisponível
const usuariosExemplo = [
  {
    uu_id: '1',
    nome: 'Administrador',
    email: 'admin@bravo.bet.br',
    whatsapp: '5511999999999',
    tipo: 'admin',
    status_plano: 'ativo',
    data_teste: null
  },
  {
    uu_id: '2',
    nome: 'João Silva',
    email: 'joao@exemplo.com',
    whatsapp: '5511988888888',
    tipo: 'user',
    status_plano: 'teste',
    data_teste: '2025-05-30'
  },
  {
    uu_id: '3',
    nome: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    whatsapp: '5511977777777',
    tipo: 'user',
    status_plano: 'ativo',
    data_teste: null
  },
  {
    uu_id: '4',
    nome: 'Pedro Santos',
    email: 'pedro@exemplo.com',
    whatsapp: '5511966666666',
    tipo: 'user',
    status_plano: 'suspenso',
    data_teste: null
  },
  {
    uu_id: '5',
    nome: 'Ana Costa',
    email: 'ana@exemplo.com',
    whatsapp: '5511955555555',
    tipo: 'user',
    status_plano: 'cancelado',
    data_teste: null
  }
];

const GerenciamentoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Opções de status de plano
  const statusOptions = [
    { value: 'ativo', label: 'Ativo', color: '#34a853' },
    { value: 'teste', label: 'Teste', color: '#4285F4' },
    { value: 'suspenso', label: 'Suspenso', color: '#FBBC05' },
    { value: 'cancelado', label: 'Cancelado', color: '#EA4335' }
  ];
  
  // Verificar se o usuário é administrador
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    setIsAdmin(userType === 'admin');
    
    // Se não for admin, não carregar os dados
    if (userType !== 'admin') {
      setLoading(false);
      setError('Acesso restrito. Apenas administradores podem acessar esta página.');
    }
  }, []);
  
  // Buscar usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      // Se não for admin, não buscar usuários
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        setError('');
        
        const response = await AuthService.getUsers();
        
        if (response.error) {
          console.error('Erro ao buscar usuários:', response.error);
          throw new Error(response.error.message || 'Erro ao buscar usuários');
        }
        
        setUsuarios(response.users || []);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err.message);
        setError('Erro ao carregar usuários. Tente novamente.');
        // Usar dados de exemplo apenas se estiver em ambiente de desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          setUsuarios(usuariosExemplo);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuarios();
  }, [isAdmin]);
  
  // Função para recarregar a lista de usuários
  const reloadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await AuthService.getUsers();
      
      if (response.error) {
        console.error('Erro ao recarregar usuários:', response.error);
        throw new Error(response.error.message || 'Erro ao recarregar usuários');
      }
      
      setUsuarios(response.users || []);
    } catch (err) {
      console.error('Erro ao recarregar usuários:', err.message);
      // Não definir erro para não mostrar mensagem de erro ao usuário
    } finally {
      setLoading(false);
    }
  };
  
  // Abrir modal de edição
  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      status_plano: user.status_plano || 'ativo', // Valor padrão caso não tenha status
      data_teste: user.data_teste || '' // Incluir a data de teste
    });
    setShowModal(true);
  };
  
  // Salvar alterações
  const handleSaveUser = async () => {
    try {
      setLoading(true);
      
      // Armazenar o ID do usuário que está sendo editado
      const editingUserId = editingUser.uu_id || editingUser.id;
      
      const { error } = await AuthService.updateUserStatus(
        editingUserId, 
        editingUser.status_plano,
        editingUser.data_teste
      );
      
      if (error) throw error;
      
      // Primeiro, atualizar localmente para feedback imediato
      setUsuarios(prevUsuarios => {
        return prevUsuarios.map(user => {
          // Verificar se este é o usuário que estamos editando
          if ((user.uu_id === editingUserId) || (user.id === editingUserId)) {
            // Retornar uma cópia do usuário com os campos atualizados
            return { 
              ...user, 
              status_plano: editingUser.status_plano, 
              data_teste: editingUser.data_teste 
            };
          }
          // Para todos os outros usuários, retornar sem alterações
          return user;
        });
      });
      
      // Mostrar mensagem de sucesso
      setSuccessMessage(`Dados do usuário ${editingUser.nome || editingUser.email} atualizados com sucesso!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      
      // Recarregar dados do servidor para garantir sincronização
      setTimeout(() => {
        reloadUsers();
      }, 500);
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err.message);
      setError('Erro ao salvar alterações. Tente novamente.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Obter cor do status
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : '#757575';
  };
  
  // Obter label do status
  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : 'Desconhecido';
  };

  // Formatar data para exibição
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Não definido';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };
  
  // Formatar data para o input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD para input type="date"
    } catch (error) {
      console.error('Erro ao formatar data para input:', error);
      return dateString;
    }
  };

  // Filtrar usuários com base na pesquisa e filtro de status
  const filteredUsuarios = usuarios.filter(user => {
    const matchesSearch = 
      (user.nome && user.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === 'all' || 
      user.status_plano === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Gerenciamento de Usuários</h2>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      {!isAdmin && (
        <div className="access-denied">
          <div className="error-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h3>Acesso Restrito</h3>
          <p>Esta página é exclusiva para administradores do sistema.</p>
          <p>Se você acredita que deveria ter acesso, entre em contato com o administrador.</p>
        </div>
      )}
      
      {isAdmin && loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando usuários...</p>
        </div>
      )}
      
      {isAdmin && !loading && (
        <div className="user-management-container">
          <div className="filters-container">
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="status-filter">
              <label>Filtrar por status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-select"
              >
                <option value="all">Todos os status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="user-count">
            <span>Exibindo {filteredUsuarios.length} de {usuarios.length} usuários</span>
          </div>
          
          <div className="usuarios-table-container">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>WhatsApp</th>
                  <th>Tipo</th>
                  <th>Status do Plano</th>
                  <th>Data de Término do Teste</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map(user => (
                  <tr key={user.uu_id || user.id}>
                    <td>{user.nome || '-'}</td>
                    <td>{user.email}</td>
                    <td>{user.whatsapp || '-'}</td>
                    <td>
                      <span className={`user-type ${user.tipo === 'admin' ? 'admin' : 'regular'}`}>
                        {user.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(user.status_plano || 'ativo') }}
                      >
                        {getStatusLabel(user.status_plano || 'ativo')}
                      </span>
                    </td>
                    <td>
                      {user.data_teste ? (
                        <span className="date-badge">
                          {formatDateForDisplay(user.data_teste)}
                        </span>
                      ) : (
                        <span className="no-date">Não definido</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditUser(user)}
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsuarios.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-results">
                      <i className="fas fa-search"></i>
                      <p>Nenhum usuário encontrado com os filtros atuais</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Modal de Edição */}
      {showModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Editar Status do Plano</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="user-details">
                  <h4>{editingUser.nome || 'Usuário'}</h4>
                  <p>{editingUser.email}</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Status do Plano:</label>
                <div className="status-options">
                  {statusOptions.map(option => (
                    <div 
                      key={option.value}
                      className={`status-option ${editingUser.status_plano === option.value ? 'selected' : ''}`}
                      style={{ 
                        borderColor: editingUser.status_plano === option.value ? option.color : 'transparent',
                        boxShadow: editingUser.status_plano === option.value ? `0 2px 8px rgba(0, 0, 0, 0.1)` : 'none'
                      }}
                      onClick={() => {
                        // Se selecionar um status diferente de 'teste', limpar a data de teste
                        if (option.value !== 'teste') {
                          setEditingUser({
                            ...editingUser, 
                            status_plano: option.value,
                            data_teste: ''
                          });
                        } else {
                          setEditingUser({
                            ...editingUser, 
                            status_plano: option.value
                          });
                        }
                      }}
                    >
                      <div className="status-color" style={{ backgroundColor: option.color }}></div>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  Data de Término do Teste:
                  {editingUser.status_plano === 'teste' && (
                    <span className="required-field"> *</span>
                  )}
                </label>
                <div className="date-input-container">
                  <input
                    type="date"
                    value={formatDateForInput(editingUser.data_teste || '')}
                    onChange={(e) => setEditingUser({...editingUser, data_teste: e.target.value})}
                    className="date-input"
                    placeholder="dd/mm/aaaa"
                    disabled={editingUser.status_plano !== 'teste'}
                    required={editingUser.status_plano === 'teste'}
                  />
                </div>
                {editingUser.status_plano === 'teste' && !editingUser.data_teste && (
                  <p className="date-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    É necessário definir uma data de término para o período de teste
                  </p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i> Cancelar
              </button>
              <button 
                className="save-button"
                onClick={handleSaveUser}
                disabled={loading || (editingUser.status_plano === 'teste' && !editingUser.data_teste)}
                title={editingUser.status_plano === 'teste' && !editingUser.data_teste ? 
                  'É necessário definir uma data de término para o período de teste' : 
                  'Salvar alterações'}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciamentoUsuarios;
