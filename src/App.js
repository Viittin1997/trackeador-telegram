import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { initDB, saveUserData, clearUserData } from './utils/indexedDBUtil';
// eslint-disable-next-line no-unused-vars
import PlanoBloqueado from './components/PlanoBloqueado';
import AuthService from './services/auth.service';
import Dashboard from './components/Dashboard';
import CadastroForm from './components/CadastroForm';
import GerenciamentoUsuarios from './components/GerenciamentoUsuarios';
import EstatisticasGerais from './components/EstatisticasGerais';
import RelatoriosDiarios from './components/RelatoriosDiarios';

// Componente principal da aplicação

// Componente de Login
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Converter o email para minúsculas para evitar problemas de case sensitivity
      const emailLowerCase = email.toLowerCase();
      
      console.log("Tentando fazer login com:", emailLowerCase, password);
      
      // Autenticação via API
      const data = await AuthService.login(emailLowerCase, password);
      
      // Salvar token no localStorage
      localStorage.setItem('authToken', data.token);
      
      // Salvar informações do usuário
      localStorage.setItem('dashboardAuthenticated', 'true');
      localStorage.setItem('userType', data.user.tipo); // Armazenar o tipo (admin/user)
      localStorage.setItem('userId', data.user.id); // Armazenar o ID do usuário
      localStorage.setItem('userPlanStatus', data.user.status_plano || 'ativo'); // Armazenar o status do plano
      localStorage.setItem('dashboardUser', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        user_metadata: {
          nome: data.user.nome || ''
        }
      }));
      
      console.log('Login bem-sucedido via API:');
      console.log('- ID do usuário:', data.user.id);
      console.log('- Tipo do usuário:', data.user.tipo);
      
      // Salvar dados no IndexedDB para acesso offline
      await saveUserData({
        uu_id: data.user.id,
        email: data.user.email,
        tipo: data.user.tipo,
        nome: data.user.nome || '',
        token: data.token
      });
      
      onLogin({
        id: data.user.id,
        email: data.user.email
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      setError('Credenciais inválidas ou usuário não autorizado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="/logotipo-branco.png" alt="TrackPro" style={{ maxWidth: '250px', marginBottom: '15px' }} />
        <p style={{ color: '#555', fontSize: '16px', marginTop: '5px' }}>Dados precisos, decisões inteligentes</p>
      </div>
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <div className="signup-link">
            Novo por aqui? <a href="/cadastro-usuarios">Cadastre-se</a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Modal (usado internamente)
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
const LinkForm = ({ initialData = {}, onSubmit, buttonText = "Cadastrar" }) => {
  const [formData, setFormData] = useState({
    link: '',
    nome_link: '',
    expert_apelido: '',
    group_name: '',
    token_api: '',
    pixel_id: '',
    id_channel_telegram: '',
    bio_ou_externo: false,
    selected_user_id: '',
    ...initialData
  });
  const [users, setUsers] = useState([]);
  const userType = localStorage.getItem('userType');
  
  // Buscar usuários se for admin e estiver editando (initialData tem id)
  useEffect(() => {
    const fetchUsers = async () => {
      if (userType === 'admin' && initialData.id) {
        try {
          const { data, error } = await AuthService.getUsers();
            
          if (error) throw error;
          setUsers(data || []);
          
          // Se o link já tem um user_id, selecionar ele no dropdown
          if (initialData.user_id) {
            setFormData(prev => ({ ...prev, selected_user_id: initialData.user_id }));
          }
        } catch (err) {
          console.error('Erro ao buscar usuários:', err.message);
        }
      }
    };
    
    fetchUsers();
  }, [userType, initialData.id, initialData.user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
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
      {/* Campo para selecionar usuário (apenas para admins na edição) */}
      {userType === 'admin' && initialData.id && (
        <div className="form-group">
          <label className="form-label">Usuário Proprietário:</label>
          <select 
            name="selected_user_id"
            className="form-input"
            value={formData.selected_user_id || ''}
            onChange={handleChange}
          >
            <option value="">Selecione um usuário</option>
            {users.map(user => (
              <option key={user.uu_id} value={user.uu_id}>
                {user.email}
              </option>
            ))}
          </select>
          <div className="form-instructions">
            <p>Altere o usuário proprietário deste link.</p>
          </div>
        </div>
      )}
      
      {/* Campo ID do Canal Telegram */}
      {renderFieldWithInstructions(
        'id_channel_telegram',
        'ID do Canal Telegram',
        <div>
          <p>Este ID será fornecido manualmente.</p>
          <p>Formato exemplo: <code>-1002156853392</code> (inclua o sinal de menos se presente)</p>
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
      
      {/* Campo Nome do Link com instruções */}
      {renderFieldWithInstructions(
        'nome_link',
        'Nome do Link',
        <div>
          <p>Especificação para nome do link no Telegram:</p>
          <ol>
            <li>Ao criar um link de convite personalizado no Telegram, você precisa definir um nome único</li>
            <li>Recomendamos seguir o padrão: <code>bot_[apelido do expert]_[local onde está]</code></li>
            <li>Exemplo: <code>bot_llaviator_lpviittin</code></li>
          </ol>
          <p><strong>Importante:</strong> Este nome deve ser único no Telegram.</p>
        </div>
      )}
      
      {/* Campo Nome do Grupo com instruções */}
      {renderFieldWithInstructions(
        'group_name',
        'Nome do Grupo',
        <div>
          <p>Instruções para o nome do grupo:</p>
          <ul>
            <li>O ideal é utilizar o nome exato do grupo do Telegram</li>
            <li>Este campo não precisa ser único, pois podem existir vários links para o mesmo grupo</li>
            <li>Serve principalmente para identificação e organização dos links</li>
          </ul>
        </div>
      )}
      
      {/* Campo Apelido do Expert com instruções */}
      {renderFieldWithInstructions(
        'expert_apelido',
        'Apelido do Expert',
        <div>
          <p><strong>Importante: Mantenha a consistência do apelido!</strong></p>
          <ul>
            <li>Se já usou um apelido anteriormente (ex: "llaviator"), utilize sempre o mesmo</li>
            <li>Isso facilita a filtragem e organização dos links no dashboard</li>
            <li>Não use variações do mesmo apelido (ex: "llaviator", "llaviator1", "llaviator_oficial")</li>
            <li>Verifique os apelidos existentes antes de criar um novo</li>
          </ul>
        </div>
      )}
      
      {/* Campo Toggle para Bio ou Link Externo */}
      <div className="form-group">
        <label className="form-label">Link Externo (Bio Instagram ou similar)</label>
        <div className="toggle-container">
          <label className="toggle">
            <input
              type="checkbox"
              name="bio_ou_externo"
              checked={formData.bio_ou_externo || false}
              onChange={handleToggleChange}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            {formData.bio_ou_externo ? 'Ativado' : 'Desativado'}
          </span>
        </div>
        <div className="form-instructions">
          <p><strong>Importante:</strong> Ative esta opção apenas se o link for usado em uma bio do Instagram ou outro local externo.</p>
          <p>Quando ativado, o pixel não será marcado na automação do n8n para rastreamento do anúncio.</p>
        </div>
      </div>

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
          key !== 'saidas_que_usaram_link' &&
          key !== 'nome_link' &&
          key !== 'group_name' &&
          key !== 'expert_apelido' &&
          key !== 'lead_count' &&
          key !== 'created_at' &&
          key !== 'bio_ou_externo' &&
          key !== 'selected_user_id'
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

// Componente Principal
const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  // eslint-disable-next-line no-unused-vars
  const [planoStatus, setPlanoStatus] = useState('ativo');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Alternar o estado da barra lateral
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Verificar status do plano no API
  const verificarStatusPlano = useCallback(async () => {
    try {
      // Verificar se o usuário está autenticado
      const userId = localStorage.getItem('userId');
      // Não verificar para administradores ou se não estiver logado
      if (!userId || userType === 'admin') return;
      
      console.log('Verificando status do plano no API para o usuário:', userId);
      
      // Buscar dados do usuário diretamente do API
      const { data, error } = await AuthService.getUserStatus(userId);
      
      if (error) {
        console.error('Erro ao verificar status do plano:', error);
        return;
      }
      
      console.log('Status do plano atual:', data.status_plano);
      
      // Atualizar o estado com o status do plano
      setPlanoStatus(data.status_plano);
      
      // Verificar se o período de teste expirou
      if (data.status_plano === 'teste' && data.data_teste) {
        const dataFinalTeste = new Date(data.data_teste);
        const dataAtual = new Date();
        
        // Se a data atual for maior que a data final do teste, atualizar status para suspenso
        if (dataAtual > dataFinalTeste) {
          console.log('Período de teste expirado. Atualizando status para suspenso.');
          
          // Atualizar status no banco de dados
          const { error: updateError } = await AuthService.updateUserStatus(userId, 'suspenso');
          
          if (updateError) {
            console.error('Erro ao atualizar status do plano:', updateError);
            return;
          }
          
          // Atualizar estado local
          setPlanoStatus('suspenso');
          localStorage.setItem('userPlanStatus', 'suspenso');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status do plano:', error.message);
    }
  }, []);

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Verificar se há token no localStorage
        const token = localStorage.getItem('authToken');
        console.log('Token encontrado no localStorage:', token ? 'Sim' : 'Não');
        
        if (token) {
          try {
            console.log('Tentando verificar token com o servidor...');
            // Verificar se o token é válido fazendo uma requisição ao servidor
            const userData = await AuthService.checkStatus();
            console.log('Verificação de token bem-sucedida:', userData);
            
            // Atualizar dados do usuário no localStorage
            localStorage.setItem('dashboardAuthenticated', 'true');
            localStorage.setItem('userType', userData.user.tipo);
            localStorage.setItem('userId', userData.user.userId || userData.user.uu_id);
            localStorage.setItem('userPlanStatus', userData.user.status_plano || 'ativo');
            
            // Atualizar o estado da aplicação
            setUser(userData.user);
            setAuthenticated(true);
            
            // Verificar status do plano no API
            await verificarStatusPlano();
          } catch (error) {
            console.error('Erro ao verificar token:', error);
            // Limpar dados de autenticação
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            localStorage.removeItem('dashboardAuthenticated');
            localStorage.removeItem('userType');
            localStorage.removeItem('userId');
            localStorage.removeItem('userPlanStatus');
            localStorage.removeItem('userData');
            
            setAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('Nenhum token encontrado no localStorage');
          setAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Inicializar o banco de dados IndexedDB
    initDB().then(() => {
      checkAuth();
    });
  }, [verificarStatusPlano]);

  // Função para lidar com o login
  const handleLogin = (userData) => {
    setAuthenticated(true);
    setUser(userData);
  };

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      // Limpar dados do usuário no localStorage
      localStorage.removeItem('dashboardAuthenticated');
      localStorage.removeItem('dashboardUser');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userPlanStatus');
      localStorage.removeItem('userData');
      
      // Limpar dados do IndexedDB
      await clearUserData();
      
      // Redirecionar para a página inicial em vez de /login
      setAuthenticated(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!authenticated) {
    return (
      <div className="app-container">
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  // Verificar se o usuário tem plano suspenso ou cancelado
  const userType = localStorage.getItem('userType');
  const userPlanStatus = localStorage.getItem('userPlanStatus');
  // Removemos a verificação do plano bloqueado aqui, pois será tratado apenas no componente Dashboard
  // const showPlanoBloqueado = userType !== 'admin' && (userPlanStatus === 'suspenso' || userPlanStatus === 'cancelado');

  // Se estiver autenticado, mostrar o dashboard
  return (
    <div className="app-container">
      {/* Removemos o banner de plano bloqueado daqui */}
      
      <div className="app-content">
        <div className="dashboard-wrapper">
          {/* Botão do menu lateral */}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          
          {/* Menu lateral */}
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h2>TrackPro</h2>
              <button className="sidebar-close" onClick={toggleSidebar}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <nav className="sidebar-nav">
              <button 
                onClick={() => { 
                  setCurrentTab('dashboard'); 
                  toggleSidebar(); 
                }} 
                className={`sidebar-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
              >
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </button>
              <button 
                onClick={() => { 
                  setCurrentTab('estatisticas-gerais'); 
                  toggleSidebar(); 
                }} 
                className={`sidebar-nav-item ${currentTab === 'estatisticas-gerais' ? 'active' : ''}`}
              >
                <i className="fas fa-chart-bar"></i>
                Estatísticas Gerais
              </button>
              <button 
                onClick={() => { 
                  setCurrentTab('relatorios-diarios'); 
                  toggleSidebar(); 
                }} 
                className={`sidebar-nav-item ${currentTab === 'relatorios-diarios' ? 'active' : ''}`}
              >
                <i className="fas fa-calendar-alt"></i>
                Relatórios Diários
              </button>
              <button 
                onClick={() => { 
                  setCurrentTab('cadastro'); 
                  toggleSidebar(); 
                }} 
                className={`sidebar-nav-item ${currentTab === 'cadastro' ? 'active' : ''}`}
              >
                <i className="fas fa-plus-circle"></i>
                Novo Cadastro
              </button>
              {localStorage.getItem('userType') === 'admin' && (
                <button
                  onClick={() => {
                    navigate('/cadastro-usuarios');
                    toggleSidebar();
                  }}
                  className="sidebar-nav-item"
                >
                  <i className="fas fa-users"></i>
                  Cadastrar Usuários
                </button>
              )}
              {localStorage.getItem('userType') === 'admin' && (
                <button
                  onClick={() => {
                    setCurrentTab('gerenciamento-usuarios');
                    toggleSidebar();
                  }}
                  className={`sidebar-nav-item ${currentTab === 'gerenciamento-usuarios' ? 'active' : ''}`}
                >
                  <i className="fas fa-users-cog"></i>
                  Gerenciamento de Usuários
                </button>
              )}
              <button
                className="sidebar-nav-item"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </nav>
            <div className="sidebar-footer">
              <p>TrackPro v1.0</p>
            </div>
          </div>
          
          <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
          
          <nav className="nav navbar">
            <div className="nav-container">
              <button 
                className={`nav-button ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentTab('dashboard')}
              >
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </button>
              <button 
                className={`nav-button ${currentTab === 'estatisticas-gerais' ? 'active' : ''}`}
                onClick={() => setCurrentTab('estatisticas-gerais')}
              >
                <i className="fas fa-chart-bar"></i> Estatísticas Gerais
              </button>
              <button 
                className={`nav-button ${currentTab === 'relatorios-diarios' ? 'active' : ''}`}
                onClick={() => setCurrentTab('relatorios-diarios')}
              >
                <i className="fas fa-calendar-alt"></i> Relatórios Diários
              </button>
              <button 
                className={`nav-button ${currentTab === 'cadastro' ? 'active' : ''}`}
                onClick={() => setCurrentTab('cadastro')}
              >
                <i className="fas fa-plus-circle"></i> Novo Cadastro
              </button>
              {localStorage.getItem('userType') === 'admin' && (
                <button
                  onClick={() => navigate('/cadastro-usuarios')}
                  className="nav-button"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="fas fa-users"></i>
                  Cadastrar Usuários
                </button>
              )}
              {localStorage.getItem('userType') === 'admin' && (
                <button
                  onClick={() => setCurrentTab('gerenciamento-usuarios')}
                  className={`nav-button ${currentTab === 'gerenciamento-usuarios' ? 'active' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  <i className="fas fa-users-cog"></i>
                  Gerenciamento de Usuários
                </button>
              )}
              <button
                className="nav-button"
                onClick={handleLogout}
                style={{ marginLeft: 'auto' }}
              >
                <i className="fas fa-sign-out-alt"></i>
                Sair
              </button>
            </div>
          </nav>

          <main className="main-content">
            {currentTab === 'dashboard' ? (
              <Dashboard setCurrentTab={setCurrentTab} currentTab={currentTab} />
            ) : currentTab === 'gerenciamento-usuarios' ? (
              <GerenciamentoUsuarios />
            ) : currentTab === 'estatisticas-gerais' ? (
              <EstatisticasGerais />
            ) : currentTab === 'relatorios-diarios' ? (
              <RelatoriosDiarios />
            ) : (
              <CadastroForm onCadastroSuccess={() => setCurrentTab('dashboard')} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
