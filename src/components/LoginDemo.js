import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import AuthService from '../services/auth.service';

const LoginDemo = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userData = AuthService.getUserData();
          setUser(userData);
          setIsAuthenticated(true);
          
          // Opcionalmente, verificar status na API
          try {
            const userStatus = await AuthService.checkStatus();
            console.log('Status do usuário:', userStatus);
          } catch (error) {
            console.error('Erro ao verificar status:', error);
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
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
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

  // Renderizar dashboard simplificado
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <img src="/logo.png" alt="Trackeador Telegram - BravoBet" />
        </div>
        <div className="user-menu">
          <span>{user ? user.email || user.id : ''}</span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </header>
      
      <main className="app-content">
        <div className="dashboard-container">
          <h1>Login com Nova API</h1>
          <p>Você está logado com sucesso usando a nova API!</p>
          
          <div className="user-info">
            <h2>Informações do Usuário</h2>
            <ul>
              <li><strong>ID:</strong> {user?.id}</li>
              <li><strong>Tipo:</strong> {user?.tipo}</li>
              <li><strong>Status do Plano:</strong> {user?.status_plano}</li>
            </ul>
          </div>
          
          <div className="api-info">
            <h2>Informações da API</h2>
            <p>A nova API está configurada para acessar: <code>{process.env.REACT_APP_API_URL}</code></p>
            <p>Para testar completamente, certifique-se de que o servidor da API está rodando.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginDemo;
