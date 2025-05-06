// Copie este código e substitua a função handleSubmit no App.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    // Converter o email para minúsculas para evitar problemas de case sensitivity
    const emailLowerCase = email.toLowerCase();
    
    console.log("Tentando fazer login com:", emailLowerCase);
    
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
    
    handleLogin({
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
