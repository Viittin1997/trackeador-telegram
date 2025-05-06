import React, { useState, useEffect } from 'react';
import StatsService from '../services/stats.service';
import PlanoBloqueado from './PlanoBloqueado';
import '../styles.css';

const RelatoriosDiarios = () => {
  // eslint-disable-next-line no-unused-vars
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedLink, setSelectedLink] = useState('');
  const [links, setLinks] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [loadingEntradas, setLoadingEntradas] = useState(false);
  const [entradasDetalhadas, setEntradasDetalhadas] = useState({
    porCampanha: [],
    porAnuncio: [],
    porPlataforma: [],
    porConjunto: [],
    porUrlLp: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await StatsService.getLinks();
        
        // Verificar se a resposta foi bem-sucedida
        if (response.success === false) {
          console.error('Erro ao buscar links:', response.message);
          setLinks([]);
          return;
        }
        
        // Se a resposta contém a propriedade links, use-a, caso contrário, use a resposta diretamente
        const linksData = response.links || (Array.isArray(response) ? response : []);
        setLinks(linksData);
      } catch (err) {
        console.error('Erro ao buscar links:', err);
        setLinks([]);
      }
    };

    fetchLinks();
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

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para buscar relatório
  const fetchRelatorio = async () => {
    if (!selectedLink) {
      setError('Selecione um link para gerar o relatório');
      return;
    }

    setLoading(true);
    setError(null);
    setBuscaRealizada(true);

    try {
      const response = await StatsService.getLinkDailyStats(
        selectedLink,
        dateRange.startDate,
        dateRange.endDate
      );

      // Verificar se a resposta foi bem-sucedida
      if (response.success === false) {
        setError(response.message || 'Erro ao buscar relatório. Tente novamente mais tarde.');
        setRelatorio(null);
        return;
      }

      setRelatorio(response);
      
      // Buscar entradas detalhadas após obter o relatório com sucesso
      fetchEntradasDetalhadas();
    } catch (err) {
      console.error('Erro ao buscar relatório:', err);
      setError('Erro ao buscar relatório. Tente novamente mais tarde.');
      setRelatorio(null);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar entradas detalhadas
  const fetchEntradasDetalhadas = async () => {
    if (!selectedLink) {
      return;
    }

    setLoadingEntradas(true);

    try {
      const response = await StatsService.getLinkDetailedEntries(
        selectedLink,
        dateRange.startDate,
        dateRange.endDate
      );

      // Verificar se a resposta foi bem-sucedida
      if (response.success === false) {
        console.error('Erro ao buscar entradas detalhadas:', response.message);
        setEntradasDetalhadas({
          porCampanha: [],
          porAnuncio: [],
          porPlataforma: [],
          porConjunto: [],
          porUrlLp: []
        });
        return;
      }

      setEntradasDetalhadas(response);
    } catch (err) {
      console.error('Erro ao buscar entradas detalhadas:', err);
      setEntradasDetalhadas({
        porCampanha: [],
        porAnuncio: [],
        porPlataforma: [],
        porConjunto: [],
        porUrlLp: []
      });
    } finally {
      setLoadingEntradas(false);
    }
  };

  // Função para calcular a porcentagem para barras de progresso
  const calcularPorcentagem = (valor, total) => {
    if (!total) return 0;
    return (valor / total * 100).toFixed(2);
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
        <h2>Relatórios Diários</h2>
      </div>

      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Link:</label>
          <div className="search-select-container">
            <input
              type="text"
              placeholder="Buscar por nome do link ou expert..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filtro-input search-input"
            />
            <select 
              value={selectedLink} 
              onChange={(e) => setSelectedLink(e.target.value)}
              className="filtro-select"
            >
              <option value="">Selecione um link</option>
              {links
                .filter(link => 
                  searchTerm === '' || 
                  link.nome_link.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  link.expert_apelido.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(link => (
                  <option key={link.id} value={link.id}>
                    {link.nome_link} ({link.expert_apelido})
                  </option>
                ))
              }
            </select>
          </div>
        </div>
        
        <div className="filtro-grupo">
          <label>Data Inicial:</label>
          <input 
            type="date" 
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            className="filtro-input"
          />
        </div>
        
        <div className="filtro-grupo">
          <label>Data Final:</label>
          <input 
            type="date" 
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            className="filtro-input"
          />
        </div>
        
        <button 
          onClick={fetchRelatorio}
          className="button button-primary"
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Buscar Relatório'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {buscaRealizada && !loading && (
        <div className="relatorio-container">
          {relatorio ? (
            <div className="relatorio-card">
              <h3>Relatório de {formatDate(dateRange.startDate)} a {formatDate(dateRange.endDate)}</h3>
              <h4>Link: {links.find(l => l.id === selectedLink)?.nome_link}</h4>
              
              <div className="relatorio-stats">
                <div className="stat-item">
                  <h5>Entradas pelo Link</h5>
                  <p className="stat-value">{relatorio.entradas_link}</p>
                </div>
                <div className="stat-item">
                  <h5>Entradas Totais no Grupo</h5>
                  <p className="stat-value">{relatorio.entradas_grupo}</p>
                </div>
                <div className="stat-item">
                  <h5>Leads Gerados</h5>
                  <p className="stat-value">{relatorio.leads}</p>
                </div>
                <div className="stat-item">
                  <h5>Taxa de Conversão</h5>
                  <p className="stat-value" style={{ color: getColorByPerformance(calcularPorcentagem(relatorio.entradas_link, relatorio.entradas_grupo), true) }}>
                    {calcularPorcentagem(relatorio.entradas_link, relatorio.entradas_grupo)}%
                  </p>
                </div>
              </div>
              
              <div className="relatorio-graficos">
                <div className="grafico-section">
                  <h4>Distribuição de Entradas</h4>
                  <div className="stats-bar-label">Link: {relatorio.entradas_link}</div>
                  <div className="stats-bar-container">
                    <div 
                      className="stats-bar"
                      style={{ 
                        width: `${calcularPorcentagem(relatorio.entradas_link, relatorio.entradas_grupo)}%`,
                        backgroundColor: '#4CAF50'
                      }}
                    >
                      {calcularPorcentagem(relatorio.entradas_link, relatorio.entradas_grupo)}%
                    </div>
                  </div>
                  
                  <div className="stats-bar-label">Outras Entradas: {relatorio.entradas_grupo - relatorio.entradas_link}</div>
                  <div className="stats-bar-container">
                    <div 
                      className="stats-bar"
                      style={{ 
                        width: `${calcularPorcentagem(relatorio.entradas_grupo - relatorio.entradas_link, relatorio.entradas_grupo)}%`,
                        backgroundColor: '#2196F3'
                      }}
                    >
                      {calcularPorcentagem(relatorio.entradas_grupo - relatorio.entradas_link, relatorio.entradas_grupo)}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nova seção: Entradas Detalhadas */}
              <div className="entradas-detalhadas-section">
                <h3>Entradas Detalhadas por Campanha <span className="total-entries">({entradasDetalhadas.porCampanha.reduce((total, item) => total + parseInt(item.entradas), 0)} entradas)</span></h3>
                {loadingEntradas ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>Carregando dados detalhados...</div>
                ) : entradasDetalhadas.porCampanha.length > 0 ? (
                  <div className="table-container">
                    <table className="stats-table">
                      <thead>
                        <tr>
                          <th>Campanha</th>
                          <th>Entradas</th>
                          <th>Porcentagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entradasDetalhadas.porCampanha.map((item, index) => (
                          <tr key={index}>
                            <td>{item.campanha || 'Não definido'}</td>
                            <td>{item.entradas}</td>
                            <td>
                              <div className="mini-bar-container">
                                <div 
                                  className="mini-bar" 
                                  style={{ 
                                    width: `${calcularPorcentagem(item.entradas, relatorio.entradas_link)}%`,
                                    backgroundColor: '#4CAF50'
                                  }}
                                ></div>
                                <span>{calcularPorcentagem(item.entradas, relatorio.entradas_link)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Não há dados detalhados de campanhas disponíveis.</p>
                )}
              </div>
              
              <div className="entradas-detalhadas-section">
                <h3>Entradas Detalhadas por Anúncio <span className="total-entries">({entradasDetalhadas.porAnuncio.reduce((total, item) => total + parseInt(item.entradas), 0)} entradas)</span></h3>
                {loadingEntradas ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>Carregando dados detalhados...</div>
                ) : entradasDetalhadas.porAnuncio.length > 0 ? (
                  <div className="table-container">
                    <table className="stats-table">
                      <thead>
                        <tr>
                          <th>Anúncio</th>
                          <th>Entradas</th>
                          <th>Porcentagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entradasDetalhadas.porAnuncio.map((item, index) => (
                          <tr key={index}>
                            <td>{item.anuncio || 'Não definido'}</td>
                            <td>{item.entradas}</td>
                            <td>
                              <div className="mini-bar-container">
                                <div 
                                  className="mini-bar" 
                                  style={{ 
                                    width: `${calcularPorcentagem(item.entradas, relatorio.entradas_link)}%`,
                                    backgroundColor: '#2196F3'
                                  }}
                                ></div>
                                <span>{calcularPorcentagem(item.entradas, relatorio.entradas_link)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Não há dados detalhados de anúncios disponíveis.</p>
                )}
              </div>
              
              <div className="entradas-detalhadas-section">
                <h3>Entradas Detalhadas por Plataforma <span className="total-entries">({entradasDetalhadas.porPlataforma.reduce((total, item) => total + parseInt(item.entradas), 0)} entradas)</span></h3>
                {loadingEntradas ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>Carregando dados detalhados...</div>
                ) : entradasDetalhadas.porPlataforma.length > 0 ? (
                  <div className="table-container">
                    <table className="stats-table">
                      <thead>
                        <tr>
                          <th>Plataforma</th>
                          <th>Entradas</th>
                          <th>Porcentagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entradasDetalhadas.porPlataforma.map((item, index) => (
                          <tr key={index}>
                            <td>{item.plataforma || 'Não definido'}</td>
                            <td>{item.entradas}</td>
                            <td>
                              <div className="mini-bar-container">
                                <div 
                                  className="mini-bar" 
                                  style={{ 
                                    width: `${calcularPorcentagem(item.entradas, relatorio.entradas_link)}%`,
                                    backgroundColor: '#FF9800'
                                  }}
                                ></div>
                                <span>{calcularPorcentagem(item.entradas, relatorio.entradas_link)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Não há dados detalhados de plataformas disponíveis.</p>
                )}
              </div>
              
              <div className="entradas-detalhadas-section">
                <h3>Entradas Detalhadas por Conjunto <span className="total-entries">({entradasDetalhadas.porConjunto.reduce((total, item) => total + parseInt(item.entradas), 0)} entradas)</span></h3>
                {loadingEntradas ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>Carregando dados detalhados...</div>
                ) : entradasDetalhadas.porConjunto.length > 0 ? (
                  <div className="table-container">
                    <table className="stats-table">
                      <thead>
                        <tr>
                          <th>Conjunto</th>
                          <th>Entradas</th>
                          <th>Porcentagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entradasDetalhadas.porConjunto.map((item, index) => (
                          <tr key={index}>
                            <td>{item.conjunto || 'Não definido'}</td>
                            <td>{item.entradas}</td>
                            <td>
                              <div className="mini-bar-container">
                                <div 
                                  className="mini-bar" 
                                  style={{ 
                                    width: `${calcularPorcentagem(item.entradas, relatorio.entradas_link)}%`,
                                    backgroundColor: '#9C27B0'
                                  }}
                                ></div>
                                <span>{calcularPorcentagem(item.entradas, relatorio.entradas_link)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Não há dados detalhados de conjuntos disponíveis.</p>
                )}
              </div>
              
              <div className="entradas-detalhadas-section">
                <h3>Entradas Detalhadas por URL de Landing Page <span className="total-entries">({entradasDetalhadas.porUrlLp.reduce((total, item) => total + parseInt(item.entradas), 0)} entradas)</span></h3>
                {loadingEntradas ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>Carregando dados detalhados...</div>
                ) : entradasDetalhadas.porUrlLp.length > 0 ? (
                  <div className="table-container">
                    <table className="stats-table">
                      <thead>
                        <tr>
                          <th>URL da Landing Page</th>
                          <th>Entradas</th>
                          <th>Porcentagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entradasDetalhadas.porUrlLp.map((item, index) => (
                          <tr key={index}>
                            <td>{item.url_lp || 'Não definido'}</td>
                            <td>{item.entradas}</td>
                            <td>
                              <div className="mini-bar-container">
                                <div 
                                  className="mini-bar" 
                                  style={{ 
                                    width: `${calcularPorcentagem(item.entradas, relatorio.entradas_link)}%`,
                                    backgroundColor: '#9C27B0'
                                  }}
                                ></div>
                                <span>{calcularPorcentagem(item.entradas, relatorio.entradas_link)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Não há dados detalhados de URLs de landing page disponíveis.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="no-data-message">
              <p>Não há relatório disponível para o link <strong>{links.find(l => l.id === selectedLink)?.nome_link}</strong> na data <strong>{formatDate(dateRange.startDate)}</strong> a <strong>{formatDate(dateRange.endDate)}</strong>.</p>
              <p>Os relatórios são gerados automaticamente ao final de cada dia.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RelatoriosDiarios;
