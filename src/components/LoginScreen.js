import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { saveUserData } from '../utils/indexedDBUtil';

// Componente de Login
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Converter o email para minúsculas para evitar problemas de case sensitivity
      const emailLowerCase = email.toLowerCase();
      
      console.log("Tentando fazer login com:", emailLowerCase);
      
      // Autenticação via API
      try {
        // Primeiro tenta com a nova API
        const data = await AuthService.login(emailLowerCase, password);
        
        console.log('Resposta da API:', data);
        
        // Verificar se a resposta contém token e dados do usuário
        if (!data || !data.token || !data.user) {
          throw new Error('Resposta da API incompleta');
        }
        
        // Salvar token no localStorage
        localStorage.setItem('authToken', data.token);
        
        // Salvar informações do usuário
        localStorage.setItem('dashboardAuthenticated', 'true');
        localStorage.setItem('userType', data.user.tipo); // Armazenar o tipo (admin/user)
        localStorage.setItem('userId', data.user.userId || data.user.uu_id || data.user.id); // Compatibilidade com todos os formatos
        localStorage.setItem('userPlanStatus', data.user.status_plano || 'ativo'); // Armazenar o status do plano
        
        // Armazenar objeto completo do usuário para uso em outros componentes
        const userData = {
          uu_id: data.user.userId || data.user.uu_id || data.user.id,
          email: data.user.email,
          tipo: data.user.tipo,
          nome: data.user.nome || '',
          status_plano: data.user.status_plano || 'ativo'
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Garantir que o objeto dashboardUser seja compatível com o formato esperado pelo frontend
        const dashboardUserData = {
          id: data.user.userId || data.user.uu_id || data.user.id,
          email: data.user.email,
          user_metadata: {
            nome: data.user.nome || ''
          }
        };
        
        localStorage.setItem('dashboardUser', JSON.stringify(dashboardUserData));
        
        console.log('Login bem-sucedido via API:');
        console.log('- ID do usuário:', data.user.userId || data.user.uu_id || data.user.id);
        console.log('- Tipo do usuário:', data.user.tipo);
        console.log('- Status do plano:', data.user.status_plano);
        console.log('- Dados salvos no localStorage:', {
          dashboardAuthenticated: localStorage.getItem('dashboardAuthenticated'),
          userType: localStorage.getItem('userType'),
          userId: localStorage.getItem('userId'),
          userPlanStatus: localStorage.getItem('userPlanStatus'),
          dashboardUser: localStorage.getItem('dashboardUser')
        });
        
        // Salvar dados no IndexedDB para acesso offline
        saveUserData({
          id: data.user.userId || data.user.uu_id || data.user.id,
          email: data.user.email,
          tipo: data.user.tipo,
          nome: data.user.nome || '',
          token: data.token
        });
        
        // Não mostrar alerta aqui, o componente PlanoBloqueado já mostrará a mensagem apropriada
        // if (data.message) {
        //   alert(data.message);
        // }
        
        // Chamar a função de callback para informar que o login foi bem-sucedido
        onLogin(dashboardUserData);
      } catch (apiError) {
        console.warn('Erro ao fazer login via API, tentando método alternativo:', apiError.message);
        
        // Fallback para o método antigo com Supabase
        // const { data, error } = await supabase.auth.signInWithPassword({
        //   email: emailLowerCase,
        //   password: password,
        // });
        
        // console.log("Resposta do Supabase:", data, error);
        
        // if (error) throw error;
        
        // // Verificar se o usuário existe na tabela bravobet_users
        // const { data: userData, error: userError } = await supabase
        //   .from('bravobet_users')
        //   .select('*')
        //   .eq('email', emailLowerCase)
        //   .single();
        
        // if (userError || !userData) {
        //   // Usuário não está cadastrado na aplicação
        //   await supabase.auth.signOut(); // Fazer logout do Auth
        //   throw new Error('Usuário não autorizado para esta aplicação');
        // }
        
        // // Verificar o status do plano
        // if (userData.tipo !== 'admin') {
        //   console.log('Verificando status do plano:', userData.status_plano);
        //   // Não bloqueamos o login, apenas armazenamos o status para mostrar a tela de aviso depois
        //   if (userData.status_plano === 'suspenso' || userData.status_plano === 'cancelado') {
        //     console.log('Usuário com plano', userData.status_plano);
        //   }
        // }
        
        // // Salvar no localStorage para manter o login entre sessões
        // localStorage.setItem('dashboardAuthenticated', 'true');
        // localStorage.setItem('dashboardUser', JSON.stringify(data.user));
        // localStorage.setItem('userType', userData.tipo); // Armazenar o tipo (admin/user)
        // localStorage.setItem('userId', userData.id); // Armazenar o ID do usuário da tabela bravobet_users
        // localStorage.setItem('userPlanStatus', userData.status_plano || 'ativo'); // Armazenar o status do plano
        
        // console.log('Login bem-sucedido via Supabase:');
        // console.log('- ID do usuário (Auth):', data.user.id);
        // console.log('- ID do usuário (DB):', userData.id);
        // console.log('- Tipo do usuário:', userData.tipo);
        
        // onLogin(data.user);
        throw new Error('Credenciais inválidas ou usuário não autorizado. Tente novamente.');
      }
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

export default LoginScreen;
