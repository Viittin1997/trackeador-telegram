import React from 'react';

const LinkStats = ({ linkStats }) => {
  if (!linkStats) return <div className="loading-stats">Carregando estatísticas...</div>;

  // Calcular estatísticas adicionais
  const calculateStats = (link) => {
    // Calcular porcentagem de participação no grupo
    const entryPercentage = link.entrada_total_grupo > 0 
      ? ((link.quantidade_entrada / link.entrada_total_grupo) * 100).toFixed(2) 
      : 0;
    
    // Calcular média diária de entradas
    const createdAt = link.created_at ? new Date(link.created_at) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const entriesPerDay = (link.quantidade_entrada / diffDays).toFixed(2);
    
    // Calcular taxa de conversão (entradas pelo link / entradas totais)
    const conversionRate = link.entrada_total_grupo > 0 
      ? ((link.quantidade_entrada / link.entrada_total_grupo) * 100).toFixed(2)
      : 0;
    
    return {
      entryPercentage,
      entriesPerDay,
      conversionRate,
      diffDays
    };
  };

  const stats = calculateStats(linkStats);

  // Determinar cores com base no desempenho
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

  // Formatar data de criação
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="link-stats-container">
      <div className="stats-header">
        <div className="stats-header-info">
          <h2>{linkStats.nome_link}</h2>
          <p className="stats-link">{linkStats.link}</p>
          <p className="stats-created-at">
            Link criado em: {formatDate(linkStats.created_at)}
            {stats.diffDays > 0 && ` (${stats.diffDays} dias atrás)`}
          </p>
        </div>
      </div>

      <div className="stats-metrics">
        <div className="stats-metric-item">
          <div className="metric-value">{linkStats.quantidade_entrada || 0}</div>
          <div className="metric-label">Entradas pelo link</div>
        </div>
        <div className="stats-metric-item">
          <div className="metric-value">{linkStats.lead_count || 0}</div>
          <div className="metric-label">Leads gerados</div>
        </div>
        <div className="stats-metric-item">
          <div className="metric-value" style={{ color: getColorByPerformance(stats.conversionRate, true, 20) }}>
            {stats.conversionRate}%
          </div>
          <div className="metric-label">Taxa de conversão</div>
        </div>
        <div className="stats-metric-item">
          <div className="metric-value">{stats.entriesPerDay}</div>
          <div className="metric-label">Média de entradas/dia</div>
        </div>
      </div>

      <div className="stats-details">
        <div className="stats-detail-item">
          <h3>Participação no Grupo</h3>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${Math.min(stats.entryPercentage, 100)}%`,
                backgroundColor: getColorByPerformance(stats.entryPercentage, true, 30)
              }}
            ></div>
            <span className="progress-text">{stats.entryPercentage}%</span>
          </div>
          <p className="stats-detail-description">
            {stats.entryPercentage}% das entradas totais ({linkStats.entrada_total_grupo || 0}) vieram através deste link
          </p>
        </div>
      </div>

      <div className="stats-footer">
        <p>
          <strong>ID do Canal:</strong> {linkStats.id_channel_telegram || 'Não informado'}
        </p>
        <p>
          <strong>Expert:</strong> {linkStats.expert_apelido || 'Não informado'}
        </p>
        <p>
          <strong>Grupo:</strong> {linkStats.group_name || 'Não informado'}
        </p>
      </div>
    </div>
  );
};

export default LinkStats;
