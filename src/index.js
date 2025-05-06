import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import './styles/landing-page.css';
import App from './App';
import UserRegistration from './components/UserRegistration';
import LandingPage from './components/LandingPage';
import LoginDemo from './components/LoginDemo';

// Adicionar evento para armazenar o token no sessionStorage quando a página for carregada
window.addEventListener('load', () => {
  // Verificar se há token no localStorage e copiá-lo para o sessionStorage
  const token = localStorage.getItem('authToken');
  if (token) {
    console.log('Token encontrado no localStorage, copiando para sessionStorage');
    sessionStorage.setItem('authToken', token);
  }
});

// Adicionar evento para verificar o token antes de recarregar a página
window.addEventListener('beforeunload', () => {
  // Verificar se há token no sessionStorage e copiá-lo para o localStorage
  const token = sessionStorage.getItem('authToken');
  if (token) {
    console.log('Token encontrado no sessionStorage, copiando para localStorage');
    localStorage.setItem('authToken', token);
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cadastro-usuarios" element={<UserRegistration />} />
        <Route path="/lp" element={<LandingPage />} />
        <Route path="/login-api" element={<LoginDemo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
