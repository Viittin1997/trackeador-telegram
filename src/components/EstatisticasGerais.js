import React, { useState, useEffect } from 'react';
import StatsService from '../services/stats.service';
import PlanoBloqueado from './PlanoBloqueado';
import '../styles.css';

const EstatisticasGerais = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('experts');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await StatsService.getGeneralStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError('Não foi possível carregar as estatísticas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Verificar se o usuário tem plano ativo
  const userType = localStorage.getItem('userType');
  const planStatus = localStorage.getItem('userPlanStatus');
  const isAdmin = userType === 'admin';
  const hasActivePlan = isAdmin || planStatus === 'ativo';

  // Se não for admin e não tiver plano ativo, mostrar mensagem de plano bloqueado
  if (!isAdmin && !hasActivePlan) {
    return <PlanoBloqueado />;
  }

  // Função para calcular a taxa de conversão
  const calculateConversionRate = (entradas, entradasGrupo) => {
    if (!entradasGrupo || entradasGrupo === 0) return 0;
    return ((entradas / entradasGrupo) * 100).toFixed(2);
  };

  // Função para determinar cor com base no desempenho
  const getColorByPerformance = (value, higherIsBetter, reference = 50) => {
    const numValue = parseFloat(value);
    
    if (higherIsBetter) {
      // Quanto maior o valor, melhor o desempenho
      if (numValue >= reference * 1.5) return '#34a853'; // Verde escuro
      if (numValue >= reference) return '#4CAF50'; // Verde
      if (numValue >= reference * 0.5) return '#FFC107'; // Amarelo
      return '#F44336'; // Vermelho
    } else {
      // Quanto menor o valor, melhor o desempenho
      if (numValue <= reference * 0.5) return '#34a853'; // Verde escuro
      if (numValue <= reference) return '#4CAF50'; // Verde
      if (numValue <= reference * 1.5) return '#FFC107'; // Amarelo
      return '#F44336'; // Vermelho
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Estatísticas Gerais</h2>
        <button onClick={() => window.location.reload()} className="button button-update">
          <i className="fas fa-sync-alt"></i> Atualizar Dados
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando estatísticas...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : stats ? (
        <div className="estatisticas-gerais">
          {/* Resumo geral */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-card-content">
                <h3 className="stat-card-title">Total de Links</h3>
                <div className="stat-card-value">{stats.totalLinks}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <h3 className="stat-card-title">Total de Entradas</h3>
                <div className="stat-card-value" style={{ color: 'var(--success-color)' }}>{stats.totalEntradas}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <h3 className="stat-card-title">Total de Entradas nos Grupos</h3>
                <div className="stat-card-value" style={{ color: 'var(--primary-color)' }}>{stats.totalEntradasGrupo}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <h3 className="stat-card-title">Total de Leads</h3>
                <div className="stat-card-value" style={{ color: 'var(--success-color)' }}>{stats.totalLeads}</div>
              </div>
            </div>
          </div>

          {/* Taxas de conversão */}
          <div className="conversion-card">
            <h3 className="conversion-title">Taxa de Conversão de Entradas</h3>
            <p className="conversion-description">
              {calculateConversionRate(stats.totalEntradas, stats.totalEntradasGrupo)}% das entradas totais vieram através dos links
            </p>
            <div className="conversion-bar-container">
              <div 
                className="conversion-bar" 
                style={{ 
                  width: `${Math.min(calculateConversionRate(stats.totalEntradas, stats.totalEntradasGrupo), 100)}%`,
                  backgroundColor: getColorByPerformance(calculateConversionRate(stats.totalEntradas, stats.totalEntradasGrupo), true)
                }}
              >
                <span className="conversion-value">{calculateConversionRate(stats.totalEntradas, stats.totalEntradasGrupo)}%</span>
              </div>
            </div>
          </div>

          {/* Tabs para estatísticas por expert e por grupo */}
          <div className="stats-tabs-container">
            <div className="stats-tabs-header">
              <button 
                className={`stats-tab-button ${activeTab === 'experts' ? 'active' : ''}`}
                onClick={() => setActiveTab('experts')}
              >
                Estatísticas por Expert
              </button>
              <button 
                className={`stats-tab-button ${activeTab === 'groups' ? 'active' : ''}`}
                onClick={() => setActiveTab('groups')}
              >
                Estatísticas por Grupo
              </button>
            </div>
            <div className="stats-tabs-content">
              {activeTab === 'experts' && (
                <div className="stats-table-container">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>Expert</th>
                        <th>Links</th>
                        <th>Entradas</th>
                        <th>Entradas no Grupo</th>
                        <th>Taxa de Conversão</th>
                        <th>Leads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.expertStats.map((expert, index) => (
                        <tr key={index}>
                          <td className="expert-name">{expert.expert}</td>
                          <td>{expert.links}</td>
                          <td>{expert.entradas}</td>
                          <td>{expert.entradasGrupo}</td>
                          <td className="conversion-cell" style={{ color: getColorByPerformance(calculateConversionRate(expert.entradas, expert.entradasGrupo), true) }}>
                            {calculateConversionRate(expert.entradas, expert.entradasGrupo)}%
                          </td>
                          <td>{expert.leads}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'groups' && (
                <div className="stats-table-container">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>Grupo</th>
                        <th>Links</th>
                        <th>Entradas</th>
                        <th>Entradas no Grupo</th>
                        <th>Taxa de Conversão</th>
                        <th>Leads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.groupStats.map((group, index) => (
                        <tr key={index}>
                          <td className="group-name">{group.grupo}</td>
                          <td>{group.links}</td>
                          <td>{group.entradas}</td>
                          <td>{group.entradasGrupo}</td>
                          <td className="conversion-cell" style={{ color: getColorByPerformance(calculateConversionRate(group.entradas, group.entradasGrupo), true) }}>
                            {calculateConversionRate(group.entradas, group.entradasGrupo)}%
                          </td>
                          <td>{group.leads}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>Nenhuma estatística disponível.</p>
        </div>
      )}
    </div>
  );
};

export default EstatisticasGerais;
