import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles.css';

// Inicialização do cliente Supabase
const supabase = createClient(
  'https://apidb.meumenu2023.uk',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzAzMzg2ODAwLAogICJleHAiOiAxODYxMjM5NjAwCn0.kU_d1xlxfuEgkYMC0mYoiZHQpUvRE2EnilTZ7S0bfIM'
);

// Componente de Login
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const correctPassword = 'Bravobet2025!';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      // Salvar no localStorage para manter o login entre sessões
      localStorage.setItem('dashboardAuthenticated', 'true');
      onLogin();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <h2 className="login-title">Trackeador Telegram - BravoBet</h2>
        <p className="login-subtitle">Digite a senha para acessar o sistema</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            className="login-input"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="login-button">
            Acessar
          </button>
          
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

// Componente Modal
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Formulário de Cadastro/Edição
const LinkForm = ({ initialData = {}, onSubmit, buttonText = "Cadastrar" }) => {
  const [formData, setFormData] = useState({
    link: '',
    nome_link: '',
    expert_apelido: '',
    group_name: '',
    token_api: '',
    pixel_id: '',
    id_channel_telegram: '',
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Função para renderizar campos com instruções especiais
  const renderFieldWithInstructions = (field, label, instructions) => {
    return (
      <div className="form-group" key={field}>
        <label className="form-label">{label}</label>
        <input
          type="text"
          name={field}
          className="form-input"
          value={formData[field] || ''}
          onChange={handleChange}
          required
        />
        {instructions && <div className="form-instructions">{instructions}</div>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo ID do Canal Telegram com instruções */}
      {renderFieldWithInstructions(
        'id_channel_telegram',
        'ID do Canal Telegram',
        <div>
          <p>Para obter o ID do canal:</p>
          <ol>
            <li>Abra o Telegram Web no computador</li>
            <li>Acesse o grupo/canal desejado</li>
            <li>O ID estará na URL do navegador</li>
            <li>Exemplo: <code>-1002156853392</code> (inclua o sinal de menos)</li>
          </ol>
        </div>
      )}
      
      {/* Campo Token API do Meta com instruções */}
      {renderFieldWithInstructions(
        'token_api',
        'Token API do Meta',
        <div>
          <p>Para obter o Token API do Meta associado ao Pixel:</p>
          <ol>
            <li>Acesse o <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">Gerenciador de Eventos do Facebook</a></li>
            <li>Selecione o Pixel ID desejado</li>
            <li>Clique em "Configurações" no menu lateral</li>
            <li>Role até a seção "Token de Acesso"</li>
            <li>Crie um novo token ou use um existente</li>
            <li>Copie o token gerado e cole neste campo</li>
          </ol>
          <p><strong>Importante:</strong> Este token é necessário para registrar as conversões no Meta Ads.</p>
        </div>
      )}
      
      {/* Campo Pixel ID com instruções */}
      {renderFieldWithInstructions(
        'pixel_id',
        'Pixel ID',
        <div>
          <p>Para encontrar seu Pixel ID:</p>
          <ol>
            <li>Acesse o <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">Gerenciador de Eventos do Facebook</a></li>
            <li>Selecione o pixel desejado</li>
            <li>O ID do pixel será exibido no topo da página ou em "Configurações"</li>
            <li>É um número de 16 dígitos (exemplo: <code>1234567890123456</code>)</li>
          </ol>
        </div>
      )}
      
      {/* Outros campos do formulário */}
      {Object.keys(formData)
        .filter(key => 
          key !== 'id' && 
          key !== 'quantidade_entrada' && 
          key !== 'id_channel_telegram' && 
          key !== 'token_api' &&
          key !== 'pixel_id' &&
          key !== 'entrada_total_grupo' && 
          key !== 'saidas_totais' && 
          key !== 'saidas_que_usaram_link'
        )
        .map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">
              {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            <input
              type="text"
              name={field}
              className="form-input"
              value={formData[field] || ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
      <button type="submit" className="button">
        {buttonText}
      </button>
    </form>
  );
};

// Componente de Cadastro
const CadastroForm = ({ onCadastroSuccess }) => {
  const handleSubmit = async (formData) => {
    try {
      const { error } = await supabase
        .from('bravobet_links_personalizados')
        .insert([{ 
          ...formData, 
          quantidade_entrada: 0,
          entrada_total_grupo: 0,
          saidas_totais: 0,
          saidas_que_usaram_link: 0
        }]);

      if (error) throw error;
      alert('Link cadastrado com sucesso!');
      if (onCadastroSuccess) onCadastroSuccess();
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Cadastro de Link Personalizado</h2>
      <LinkForm onSubmit={handleSubmit} />
    </div>
  );
};

// Componente de Dashboard
const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bravobet_links_personalizados')
        .select('*');

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Erro ao buscar links:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleEdit = (link) => {
    setEditingLink(link);
  };

  const handleUpdate = async (formData) => {
    try {
      const { error } = await supabase
        .from('bravobet_links_personalizados')
        .update(formData)
        .eq('id', formData.id);

      if (error) throw error;
      alert('Link atualizado com sucesso!');
      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      alert('Erro ao atualizar: ' + error.message);
    }
  };

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;
    
    try {
      const { error } = await supabase
        .from('bravobet_links_personalizados')
        .delete()
        .eq('id', linkToDelete.id);

      if (error) throw error;
      alert('Link excluído com sucesso!');
      setIsDeleteModalOpen(false);
      setLinkToDelete(null);
      fetchLinks();
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Trackeador Telegram - BravoBet</h2>
        <button onClick={fetchLinks} className="button button-update">
          Atualizar Dados
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Carregando...</div>
      ) : (
        <div className="cards-grid">
          {links.map((link) => (
            <div key={link.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{link.group_name}</h3>
                <p className="card-subtitle">Expert: {link.expert_apelido}</p>
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
                  <span>Saídas totais:</span>
                  <span style={{ color: '#EA4335', fontWeight: 'bold' }}>{link.saidas_totais || 0}</span>
                </div>
                <div className="stats-row">
                  <span>Saídas de usuários que usaram o link:</span>
                  <span style={{ color: '#FBBC05', fontWeight: 'bold' }}>{link.saidas_que_usaram_link || 0}</span>
                </div>
              </div>
              
              <div className="card-content">
                <p><strong>Nome:</strong> {link.nome_link}</p>
                <p><strong>Link:</strong> {link.link}</p>
                <p><strong>ID do Canal:</strong> {link.id_channel_telegram || 'Não definido'}</p>
                <p><strong>Pixel ID:</strong> {link.pixel_id}</p>
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
      )}

      {/* Modal de Edição */}
      <Modal 
        isOpen={editingLink !== null} 
        onClose={() => setEditingLink(null)}
        title="Editar Link"
      >
        {editingLink && (
          <LinkForm 
            initialData={editingLink} 
            onSubmit={handleUpdate} 
            buttonText="Atualizar"
          />
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        footer={
          <>
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
          </>
        }
      >
        <p>Tem certeza que deseja excluir o link "{linkToDelete?.nome_link}"?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

// Componente Principal
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const authenticated = localStorage.getItem('dashboardAuthenticated') === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboardAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div>
      <nav className="nav">
        <div className="nav-container">
          <button
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${activeTab === 'cadastro' ? 'active' : ''}`}
            onClick={() => setActiveTab('cadastro')}
          >
            Novo Cadastro
          </button>
          <button
            className="nav-button"
            onClick={handleLogout}
            style={{ marginLeft: 'auto' }}
          >
            Sair
          </button>
        </div>
      </nav>

      <main style={{ padding: '20px 0' }}>
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : (
          <CadastroForm onCadastroSuccess={() => setActiveTab('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default App;
