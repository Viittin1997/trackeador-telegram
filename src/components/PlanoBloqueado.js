import React from 'react';
import '../styles/plano-bloqueado.css';

const PlanoBloqueado = ({ status = 'suspenso', onLogout }) => {
  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userPlanStatus');
    localStorage.removeItem('dashboardUser');
    localStorage.removeItem('userData');
    
    // Redirecionar para a URL base em vez de /login
    window.location.href = '/';
  };

  return (
    <div className="plano-bloqueado-overlay">
      <div className="plano-bloqueado-container">
        <div className="plano-bloqueado-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h2>Acesso Bloqueado</h2>
        
        {status === 'suspenso' ? (
          <p>Seu plano está <strong>suspenso</strong>. Entre em contato com o suporte para reativação ou atualize seu plano.</p>
        ) : (
          <p>Seu plano foi <strong>cancelado</strong>. Entre em contato com o suporte para reativação ou adquira um novo plano.</p>
        )}
        
        <div className="plano-bloqueado-buttons">
          <button className="button" onClick={handleLogout}>
            Sair
          </button>
          <a 
            href="https://wa.me/5511999999999" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="button button-success"
          >
            Contatar Suporte
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlanoBloqueado;
