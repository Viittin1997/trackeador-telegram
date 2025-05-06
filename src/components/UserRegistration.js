import React, { useState, useEffect } from 'react';
import '../styles/UserRegistration.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveUserData } from '../utils/indexedDBUtil';
import AuthService from '../services/auth.service';

// URLs dos webhooks n8n
const N8N_CADASTRO_WEBHOOK_URL = 'https://apitrack.trackpro.com.br/api/auth/register';
// eslint-disable-next-line no-unused-vars
const N8N_LOGIN_WEBHOOK_URL = 'https://apitrack.trackpro.com.br/api/auth/login';

const UserRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Função para formatar o WhatsApp
  const formatWhatsapp = (value) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limitedValue = numericValue.slice(0, 11);
    
    // Formata como (XX) XXXXX-XXXX
    if (limitedValue.length <= 2) {
      return limitedValue;
    } else if (limitedValue.length <= 7) {
      return `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2)}`;
    } else {
      return `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2, 7)}-${limitedValue.slice(7)}`;
    }
  };

  // Handler para o campo de WhatsApp
  const handleWhatsappChange = (e) => {
    const formattedValue = formatWhatsapp(e.target.value);
    setWhatsapp(formattedValue);
  };

  // Capturar o parâmetro de email da URL quando o componente é montado
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const whatsappParam = params.get('whatsapp');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (whatsappParam) {
      // Formatar o WhatsApp recebido da URL
      setWhatsapp(formatWhatsapp(whatsappParam));
    }
  }, [location]);

  // Exibir mensagem de erro mais detalhada
  const displayError = (message) => {
    console.error('Erro no cadastro:', message);
    setError(message);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetar mensagens
    setError('');
    setSuccess('');
    
    // Validações básicas
    if (!email || !password || !confirmPassword || !nome || !whatsapp) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    // Validar formato do WhatsApp (deve ter pelo menos DDD + 8 dígitos)
    const whatsappNumerico = whatsapp.replace(/\D/g, '');
    if (whatsappNumerico.length < 10) {
      setError('Número de WhatsApp inválido. Informe DDD + número.');
      return;
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Enviar dados para o webhook do n8n para cadastro
      const response = await fetch(N8N_CADASTRO_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          senha: password, // Alterado para 'senha' conforme nova estrutura
          nome: nome,
          whatsapp: whatsappNumerico, // Enviar apenas os números, sem formatação
          tipo: 'user', // Tipo sempre será "user" para novos cadastros
          status_plano: 'teste' // Status inicial para novos usuários
        }),
      });
      
      // Verificar o status da resposta
      if (response.status === 402) {
        const errorData = await response.json();
        console.log('Resposta de erro 402:', errorData);
        
        // Verificar se é o erro de email existente
        if (errorData.status === 'emailexistente') {
          throw new Error('Este email já está cadastrado. Por favor, use outro email ou faça login.');
        }
        
        throw new Error('Email já cadastrado no sistema.');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Erro ao cadastrar usuário';
        
        console.log('Erro detalhado:', errorData);
        
        // Verificar se há detalhes específicos de validação
        if (errorData.details && Array.isArray(errorData.details)) {
          // Extrair mensagens de erro específicas dos detalhes
          const errorDetails = errorData.details.map(detail => {
            // Personalizar mensagens de erro para melhor compreensão
            if (detail.field === "senha" && detail.message.includes("pelo menos 6 caracteres")) {
              return "A senha deve ter pelo menos 6 caracteres";
            }
            if (detail.field === "email" && detail.message.includes("já está em uso")) {
              return "Este email já está cadastrado. Por favor, use outro email ou faça login.";
            }
            return detail.message;
          });
          
          errorMessage = errorDetails.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.status) {
          errorMessage = `Erro: ${errorData.status}`;
        }
        
        // Exibir o erro de forma mais amigável
        setError(errorMessage);
        setLoading(false);
        return; // Interromper o fluxo para não continuar com o processamento
      }
      
      const responseData = await response.json();
      console.log('Resposta do cadastro:', responseData);
      
      // A resposta pode ser um objeto direto ou um array com um objeto
      let data;
      
      if (Array.isArray(responseData)) {
        if (responseData.length === 0) {
          throw new Error('Resposta vazia do servidor');
        }
        data = responseData[0];
      } else {
        // Se for um objeto direto
        data = responseData;
      }
      
      console.log("Dados processados:", data);
      
      // Verificar se temos o uu_id na resposta
      if (!data.uu_id) {
        throw new Error('ID de usuário não encontrado na resposta');
      }
      
      // Preparar dados para armazenar no IndexedDB
      const userDataToStore = {
        uu_id: data.uu_id,
        email: email.toLowerCase(),
        tipo: 'user',
        nome: nome,
        whatsapp: whatsapp
      };
      
      await saveUserData(userDataToStore);
      
      // Também salvar no localStorage para compatibilidade com o código existente
      localStorage.setItem('dashboardAuthenticated', 'true');
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userId', data.uu_id);
      
      // Sucesso
      setSuccess('Usuário cadastrado com sucesso! Redirecionando para o dashboard...');
      
      // Limpar formulário
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNome('');
      setWhatsapp('');
      
      // Redirecionar para o dashboard após cadastro bem-sucedido
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      displayError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration-container">
      <div className="user-registration-header">
        <h2>Vamos começar</h2>
        <a href="/" className="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar para o Login
        </a>
      </div>
      
      <div className="user-registration-form-container">
        <form onSubmit={handleSubmit} className="user-registration-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
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
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              type="tel"
              id="whatsapp"
              value={whatsapp}
              onChange={handleWhatsappChange}
              placeholder="Digite seu número com DDD"
              maxLength={16} // (XX) XXXXX-XXXX tem 16 caracteres
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="button"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          
          <div className="login-link">
            Já tem uma conta? <a href="/">Faça login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
