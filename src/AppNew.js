import React, { useState, useEffect } from 'react';
import './styles.css';
import { initDB, saveUserData, getUserData, clearUserData } from './utils/indexedDBUtil';
import PlanoBloqueado from './components/PlanoBloqueado';
import LoginScreen from './components/LoginScreen';
import AuthService from './services/auth.service';

// Componente Principal
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showPlanoBloqueado, setShowPlanoBloqueado] = useState(false);

  // Inicializar o IndexedDB
  useEffect(() => {
    initDB().catch(error => {
      console.error('Erro ao inicializar o IndexedDB:', error);
    });
  }, []);

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se há token no localStorage
        if (AuthService.isAuthenticated()) {
          // Recuperar dados do usuário do IndexedDB
          const userData = await getUserData();
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            
            // Verificar status do plano
            const userType = userData.tipo || localStorage.getItem('userType');
            const planStatus = localStorage.getItem('userPlanStatus');
            
            if (userType !== 'admin' && (planStatus === 'suspenso' || planStatus === 'cancelado')) {
              setShowPlanoBloqueado(true);
            }
          } else {
            // Se não encontrar no IndexedDB, tentar verificar status na API
            try {
              const userStatus = await AuthService.checkStatus();
              setUser(userStatus);
              setIsAuthenticated(true);
              
              // Verificar status do plano
              if (userStatus.tipo !== 'admin' && 
                  (userStatus.status_plano === 'suspenso' || userStatus.status_plano === 'cancelado')) {
                setShowPlanoBloqueado(true);
              }
            } catch (error) {
              console.error('Erro ao verificar status do usuário:', error);
              handleLogout();
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Função para lidar com o login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Verificar status do plano
    const userType = userData.tipo || localStorage.getItem('userType');
    const planStatus = localStorage.getItem('userPlanStatus');
    
    if (userType !== 'admin' && (planStatus === 'suspenso' || planStatus === 'cancelado')) {
      setShowPlanoBloqueado(true);
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setShowPlanoBloqueado(false);
  };

  // Renderizar componente de carregamento
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Renderizar tela de login se não estiver autenticado
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Renderizar tela de plano bloqueado se necessário
  if (showPlanoBloqueado) {
    return <PlanoBloqueado onLogout={handleLogout} />;
  }

  // Importar componentes do App.js original
  // Aqui você deve importar os componentes que estão definidos no App.js original
  // Por exemplo: const Dashboard = require('./components/Dashboard').default;
  
  // Por enquanto, vamos renderizar um placeholder
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <img src="/logo.png" alt="Trackeador Telegram - BravoBet" />
        </div>
        <nav className="main-nav">
          <ul>
            <li className={currentTab === 'dashboard' ? 'active' : ''}>
              <button onClick={() => setCurrentTab('dashboard')}>Dashboard</button>
            </li>
            <li className={currentTab === 'estatisticas' ? 'active' : ''}>
              <button onClick={() => setCurrentTab('estatisticas')}>Estatísticas</button>
            </li>
            <li className={currentTab === 'relatorios' ? 'active' : ''}>
              <button onClick={() => setCurrentTab('relatorios')}>Relatórios</button>
            </li>
            {user && user.tipo === 'admin' && (
              <li className={currentTab === 'usuarios' ? 'active' : ''}>
                <button onClick={() => setCurrentTab('usuarios')}>Usuários</button>
              </li>
            )}
          </ul>
        </nav>
        <div className="user-menu">
          <span>{user ? user.email : ''}</span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </header>
      
      <main className="app-content">
        {/* Renderizar o conteúdo com base na aba selecionada */}
        {currentTab === 'dashboard' && <div>Dashboard (Implementar)</div>}
        {currentTab === 'estatisticas' && <div>Estatísticas (Implementar)</div>}
        {currentTab === 'relatorios' && <div>Relatórios (Implementar)</div>}
        {currentTab === 'usuarios' && user && user.tipo === 'admin' && <div>Gerenciamento de Usuários (Implementar)</div>}
      </main>
    </div>
  );
}

export default App;
