import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles.css';

// Inicialização do cliente Supabase
const supabase = createClient(
  'https://apidb.meumenu2023.uk',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzAzMzg2ODAwLAogICJleHAiOiAxODYxMjM5NjAwCn0.kU_d1xlxfuEgkYMC0mYoiZHQpUvRE2EnilTZ7S0bfIM'
);

// Componente de Login
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const correctPassword = 'Bravobet2025!';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      // Salvar no localStorage para manter o login entre sessões
      localStorage.setItem('dashboardAuthenticated', 'true');
      onLogin();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <h2 className="login-title">Trackeador Telegram - BravoBet</h2>
        <p className="login-subtitle">Digite a senha para acessar o sistema</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            className="login-input"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="login-button">
            Acessar
          </button>
          
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

// Componente Modal
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Formulário de Cadastro/Edição
const LinkForm = ({ initialData = {}, onSubmit, buttonText = "Cadastrar" }) => {
  const [formData, setFormData] = useState({
    link: '',
    nome_link: '',
    expert_apelido: '',
    group_name: '',
    token_api: '',
    pixel_id: '',
    id_channel_telegram: '',
    bio_ou_externo: false,
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Função para renderizar campos com instruções especiais
  const renderFieldWithInstructions = (field, label, instructions) => {
    return (
      <div className="form-group" key={field}>
        <label className="form-label">{label}</label>
        <input
          type="text"
          name={field}
          className="form-input"
          value={formData[field] || ''}
          onChange={handleChange}
          required
        />
        {instructions && <div className="form-instructions">{instructions}</div>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo ID do Canal Telegram */}
      {renderFieldWithInstructions(
        'id_channel_telegram',
        'ID do Canal Telegram',
        <div>
          <p>Este ID será fornecido manualmente.</p>
          <p>Formato exemplo: <code>-1002156853392</code> (inclua o sinal de menos se presente)</p>
        </div>
      )}
      
      {/* Campo Token API do Meta com instruções */}
      {renderFieldWithInstructions(
        'token_api',
        'Token API do Meta',
        <div>
          <p>Para obter o Token API do Meta associado ao Pixel:</p>
          <ol>
            <li>Acesse o <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">Gerenciador de Eventos do Facebook</a></li>
            <li>Selecione o Pixel ID desejado</li>
            <li>Clique em "Configurações" no menu lateral</li>
            <li>Role até a seção "Token de Acesso"</li>
            <li>Crie um novo token ou use um existente</li>
            <li>Copie o token gerado e cole neste campo</li>
          </ol>
          <p><strong>Importante:</strong> Este token é necessário para registrar as conversões no Meta Ads.</p>
        </div>
      )}
      
      {/* Campo Pixel ID com instruções */}
      {renderFieldWithInstructions(
        'pixel_id',
        'Pixel ID',
        <div>
          <p>Para encontrar seu Pixel ID:</p>
          <ol>
            <li>Acesse o <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">Gerenciador de Eventos do Facebook</a></li>
            <li>Selecione o pixel desejado</li>
            <li>O ID do pixel será exibido no topo da página ou em "Configurações"</li>
            <li>É um número de 16 dígitos (exemplo: <code>1234567890123456</code>)</li>
          </ol>
        </div>
      )}
      
      {/* Campo Nome do Link com instruções */}
      {renderFieldWithInstructions(
        'nome_link',
        'Nome do Link',
        <div>
          <p>Especificação para nome do link no Telegram:</p>
          <ol>
            <li>Ao criar um link de convite personalizado no Telegram, você precisa definir um nome único</li>
            <li>Recomendamos seguir o padrão: <code>bot_[apelido do expert]_[local onde está]</code></li>
            <li>Exemplo: <code>bot_llaviator_lpviittin</code></li>
          </ol>
          <p><strong>Importante:</strong> Este nome deve ser único no Telegram.</p>
        </div>
      )}
      
      {/* Campo Nome do Grupo com instruções */}
      {renderFieldWithInstructions(
        'group_name',
        'Nome do Grupo',
        <div>
          <p>Instruções para o nome do grupo:</p>
          <ul>
            <li>O ideal é utilizar o nome exato do grupo do Telegram</li>
            <li>Este campo não precisa ser único, pois podem existir vários links para o mesmo grupo</li>
            <li>Serve principalmente para identificação e organização dos links</li>
          </ul>
        </div>
      )}
      
      {/* Campo Apelido do Expert com instruções */}
      {renderFieldWithInstructions(
        'expert_apelido',
        'Apelido do Expert',
        <div>
          <p><strong>Importante: Mantenha a consistência do apelido!</strong></p>
          <ul>
            <li>Se já usou um apelido anteriormente (ex: "llaviator"), utilize sempre o mesmo</li>
            <li>Isso facilita a filtragem e organização dos links no dashboard</li>
            <li>Não use variações do mesmo apelido (ex: "llaviator", "llaviator1", "llaviator_oficial")</li>
            <li>Verifique os apelidos existentes antes de criar um novo</li>
          </ul>
        </div>
      )}
      
      {/* Campo Toggle para Bio ou Link Externo */}
      <div className="form-group">
        <label className="form-label">Link Externo (Bio Instagram ou similar)</label>
        <div className="toggle-container">
          <label className="toggle">
            <input
              type="checkbox"
              name="bio_ou_externo"
              checked={formData.bio_ou_externo || false}
              onChange={handleToggleChange}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            {formData.bio_ou_externo ? 'Ativado' : 'Desativado'}
          </span>
        </div>
        <div className="form-instructions">
          <p><strong>Importante:</strong> Ative esta opção apenas se o link for usado em uma bio do Instagram ou outro local externo.</p>
          <p>Quando ativado, o pixel não será marcado na automação do n8n para rastreamento do anúncio.</p>
        </div>
      </div>

      {/* Outros campos do formulário */}
      {Object.keys(formData)
        .filter(key => 
          key !== 'id' && 
          key !== 'quantidade_entrada' && 
          key !== 'id_channel_telegram' && 
          key !== 'token_api' &&
          key !== 'pixel_id' &&
          key !== 'entrada_total_grupo' && 
          key !== 'saidas_totais' && 
          key !== 'saidas_que_usaram_link' &&
          key !== 'nome_link' &&
          key !== 'group_name' &&
          key !== 'expert_apelido' &&
          key !== 'lead_count' &&
          key !== 'created_at' &&
          key !== 'bio_ou_externo'
        )
        .map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">
              {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            <input
              type="text"
              name={field}
              className="form-input"
              value={formData[field] || ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
      <button type="submit" className="button">
        {buttonText}
      </button>
    </form>
  );
};

// Componente de Cadastro
const CadastroForm = ({ onCadastroSuccess }) => {
  const handleSubmit = async (formData) => {
    try {
      const { error } = await supabase
        .from('bravobet_links_personalizados')
        .insert([{ 
          ...formData, 
          quantidade_entrada: 0,
          entrada_total_grupo: 0,
          saidas_totais: 0,
          saidas_que_usaram_link: 0,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      alert('Link cadastrado com sucesso!');
      if (onCadastroSuccess) onCadastroSuccess();
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Cadastro de Link Personalizado</h2>
      <LinkForm onSubmit={handleSubmit} />
    </div>
  );
};

// Componente de Dashboard
const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedLinkStats, setSelectedLinkStats] = useState(null);
  const linksPerPage = 10;

  // Filtrar links com base no termo de busca
  const filteredLinks = links.filter(link => 
    link.nome_link.toLowerCase().includes(searchTerm.toLowerCase()) || 
    link.expert_apelido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular links para a página atual
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);
  
  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);

  // Mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bravobet_links_personalizados')
        .select('*');

      if (error) throw error;
      
      // Buscar contagem de leads para cada link
      const linksWithLeadCount = await Promise.all(data.map(async (link) => {
        const { count, error: countError } = await supabase
          .from('bravobet_leads_telegram')
          .select('id', { count: 'exact', head: true })
          .eq('nome_invite_link_usado', link.nome_link);
          
        if (countError) {
          console.error('Erro ao buscar contagem de leads:', countError.message);
          return { ...link, lead_count: 0 };
        }
        
        return { ...link, lead_count: count || 0 };
      }));
      
      setLinks(linksWithLeadCount || []);
    } catch (error) {
      console.error('Erro ao buscar links:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleEdit = (link) => {
    setEditingLink(link);
  };

  const handleUpdate = async (formData) => {
    try {
      // Remover campos que não existem na tabela
      const { lead_count, ...dataToUpdate } = formData;
      
      const { error } = await supabase
        .from('bravobet_links_personalizados')
        .update(dataToUpdate)
        .eq('id', formData.id);

      if (error) throw error;
      alert('Link atualizado com sucesso!');
      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      alert('Erro ao atualizar: ' + error.message);
    }
  };

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;
    
    try {
      const { error } = await supabase
        .from('bravobet_links_personalizados')
        .delete()
        .eq('id', linkToDelete.id);

      if (error) throw error;
      alert('Link excluído com sucesso!');
      setIsDeleteModalOpen(false);
      setLinkToDelete(null);
      fetchLinks();
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  const handleStatsClick = (link) => {
    setSelectedLinkStats(link);
    setStatsModalOpen(true);
  };

  // Função para determinar cor com base no desempenho
  const getColorByPerformance = useCallback((value, higherIsBetter, reference = 50) => {
    const numValue = parseFloat(value);
    
    if (higherIsBetter) {
      // Quanto maior o valor, melhor o desempenho
      if (numValue >= reference * 0.8) return '#34a853'; // Verde - Excelente
      if (numValue >= reference * 0.6) return '#4285F4'; // Azul - Bom
      if (numValue >= reference * 0.4) return '#FBBC05'; // Amarelo - Médio
      return '#EA4335'; // Vermelho - Precisa melhorar
    } else {
      // Quanto menor o valor, melhor o desempenho
      if (numValue <= reference * 0.2) return '#34a853'; // Verde - Excelente
      if (numValue <= reference * 0.4) return '#4285F4'; // Azul - Bom
      if (numValue <= reference * 0.6) return '#FBBC05'; // Amarelo - Médio
      return '#EA4335'; // Vermelho - Precisa melhorar
    }
  }, []);

  // Calcular estatísticas para o link selecionado
  const calculateStats = useCallback((link) => {
    // Porcentagem de entradas pelo link em relação às entradas totais
    const entryPercentage = link.entrada_total_grupo > 0 
      ? ((link.quantidade_entrada / link.entrada_total_grupo) * 100).toFixed(2)
      : 0;
    
    // Relação de pessoas que saem que entraram pelo link vs saídas totais
    const exitRatio = link.saidas_totais > 0
      ? ((link.saidas_que_usaram_link / link.saidas_totais) * 100).toFixed(2)
      : 0;
    
    // Média de entradas por dia
    let entriesPerDay = 0;
    if (link.created_at) {
      const creationDate = new Date(link.created_at);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - creationDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      entriesPerDay = diffDays > 0 
        ? (link.quantidade_entrada / diffDays).toFixed(2)
        : link.quantidade_entrada;
    }
    
    // Determinar cores com base no desempenho
    // Para entradas: quanto maior a porcentagem, melhor (verde = bom)
    const entryColor = getColorByPerformance(entryPercentage, true);
    
    // Para saídas: quanto menor a porcentagem, melhor (verde = bom)
    const exitColor = getColorByPerformance(exitRatio, false);
    
    // Para média diária: valores mais altos são melhores
    const dailyColor = getColorByPerformance(entriesPerDay, true, 5); // 5 é um valor de referência
    
    return {
      entryPercentage,
      exitRatio,
      entriesPerDay,
      entryColor,
      exitColor,
      dailyColor
    };
  }, [getColorByPerformance]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard de Links</h2>
        <button onClick={fetchLinks} className="button button-update">
          Atualizar Dados
        </button>
      </div>

      {/* Barra de busca */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nome do link ou apelido do expert..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Resetar para a primeira página ao buscar
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Carregando...</div>
      ) : (
        <>
          <div className="cards-grid">
            {currentLinks.map((link) => (
              <div key={link.id} className="card">
                <div className="card-header">
                  <h3 className="card-title">{link.group_name}</h3>
                  <p className="card-subtitle">Expert: {link.expert_apelido}</p>
                </div>
                
                <div className="card-stats">
                  <div className="stats-row">
                    <span>Entradas pelo link:</span>
                    <span style={{ color: '#34a853', fontWeight: 'bold' }}>{link.quantidade_entrada || 0}</span>
                  </div>
                  <div className="stats-row">
                    <span>Entradas totais:</span>
                    <span style={{ color: '#4285F4', fontWeight: 'bold' }}>{link.entrada_total_grupo || 0}</span>
                  </div>
                  <div className="stats-row">
                    <span>Saídas totais:</span>
                    <span style={{ color: '#EA4335', fontWeight: 'bold' }}>{link.saidas_totais || 0}</span>
                  </div>
                  <div className="stats-row">
                    <span>Saídas de usuários que usaram o link:</span>
                    <span style={{ color: '#FBBC05', fontWeight: 'bold' }}>{link.saidas_que_usaram_link || 0}</span>
                  </div>
                  <div className="stats-row">
                    <span>Leads:</span>
                    <span style={{ color: '#34a853', fontWeight: 'bold' }}>{link.lead_count || 0}</span>
                  </div>
                </div>
                
                <div className="card-content">
                  <p><strong>Nome:</strong> {link.nome_link}</p>
                  <p><strong>Link:</strong> {link.link}</p>
                  <p><strong>ID do Canal:</strong> {link.id_channel_telegram || 'Não definido'}</p>
                  <p><strong>Pixel ID:</strong> {link.pixel_id}</p>
                  <p><strong>Data de Criação:</strong> {link.created_at ? new Date(link.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Não disponível'}</p>
                </div>

                <div className="card-actions">
                  <button 
                    className="button" 
                    onClick={() => handleEdit(link)}
                  >
                    Editar
                  </button>
                  <button 
                    className="button button-danger" 
                    onClick={() => handleDeleteClick(link)}
                  >
                    Excluir
                  </button>
                  <button 
                    className="button" 
                    onClick={() => handleStatsClick(link)}
                  >
                    Estatísticas
                  </button>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    Abrir Link →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                &laquo; Anterior
              </button>
              
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Próxima &raquo;
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Modal de Edição */}
      <Modal 
        isOpen={editingLink !== null} 
        onClose={() => setEditingLink(null)}
        title="Editar Link"
      >
        {editingLink && (
          <LinkForm 
            initialData={editingLink} 
            onSubmit={handleUpdate} 
            buttonText="Atualizar"
          />
        )}
      </Modal>

      {/* Modal de Estatísticas */}
      <Modal
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        title={`Estatísticas: ${selectedLinkStats?.nome_link || ''}`}
      >
        {selectedLinkStats && (
          <div className="stats-modal-content">
            <div className="stats-section">
              <h3>Entradas pelo Link vs. Entradas Totais</h3>
              <div className="stats-info">
                <p>{calculateStats(selectedLinkStats).entryPercentage}% das entradas totais vieram através deste link</p>
              </div>
              <div className="stats-bar-container">
                <div 
                  className="stats-bar" 
                  style={{ 
                    width: `${calculateStats(selectedLinkStats).entryPercentage}%`, 
                    backgroundColor: calculateStats(selectedLinkStats).entryColor 
                  }}
                >
                  {calculateStats(selectedLinkStats).entryPercentage > 10
                    ? `${calculateStats(selectedLinkStats).entryPercentage}%` 
                    : ''}
                </div>
              </div>
              <div className="stats-legend">
                <div className="stats-legend-item">
                  <span className="stats-dot entry-dot"></span>
                  <span>Entradas pelo link: {selectedLinkStats.quantidade_entrada}</span>
                </div>
                <div className="stats-legend-item">
                  <span className="stats-dot total-dot"></span>
                  <span>Entradas totais: {selectedLinkStats.entrada_total_grupo}</span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h3>Relação de Saídas</h3>
              <div className="stats-info">
                <p>{calculateStats(selectedLinkStats).exitRatio}% das saídas são de usuários que entraram por este link</p>
              </div>
              <div className="stats-bar-container">
                <div 
                  className="stats-bar exit-bar" 
                  style={{ 
                    width: `${calculateStats(selectedLinkStats).exitRatio}%`, 
                    backgroundColor: calculateStats(selectedLinkStats).exitColor 
                  }}
                >
                  {calculateStats(selectedLinkStats).exitRatio > 10
                    ? `${calculateStats(selectedLinkStats).exitRatio}%` 
                    : ''}
                </div>
              </div>
              <div className="stats-legend">
                <div className="stats-legend-item">
                  <span className="stats-dot exit-link-dot"></span>
                  <span>Saídas de usuários que usaram o link: {selectedLinkStats.saidas_que_usaram_link}</span>
                </div>
                <div className="stats-legend-item">
                  <span className="stats-dot exit-total-dot"></span>
                  <span>Saídas totais: {selectedLinkStats.saidas_totais}</span>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h3>Média de Entradas por Dia</h3>
              <div className="stats-info">
                <p>Em média, {calculateStats(selectedLinkStats).entriesPerDay} pessoas entram por dia através deste link</p>
              </div>
              <div className="stats-value">
                <span className="stats-number" style={{ color: calculateStats(selectedLinkStats).dailyColor }}>
                  {calculateStats(selectedLinkStats).entriesPerDay}
                </span>
                <span className="stats-unit">entradas/dia</span>
              </div>
              <div className="stats-date-info">
                <p>Link criado em: {selectedLinkStats.created_at ? new Date(selectedLinkStats.created_at).toLocaleDateString('pt-BR') : 'Data desconhecida'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <button 
              className="button" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </button>
            <button 
              className="button button-danger" 
              onClick={handleDelete}
            >
              Excluir
            </button>
          </>
        }
      >
        <p>Tem certeza que deseja excluir o link "{linkToDelete?.nome_link}"?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

// Componente de Estatísticas Gerais
const EstatisticasGerais = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalEntradas: 0,
    totalEntradasGrupo: 0,
    totalSaidas: 0,
    totalSaidasUsaramLink: 0,
    totalLeads: 0,
    expertStats: [],
    groupStats: []
  });

  // Função para determinar cor com base no desempenho
  const getColorByPerformance = useCallback((value, higherIsBetter, reference = 50) => {
    const numValue = parseFloat(value);
    
    if (higherIsBetter) {
      // Quanto maior o valor, melhor o desempenho
      if (numValue >= reference * 0.8) return '#34a853'; // Verde - Excelente
      if (numValue >= reference * 0.6) return '#4285F4'; // Azul - Bom
      if (numValue >= reference * 0.4) return '#FBBC05'; // Amarelo - Médio
      return '#EA4335'; // Vermelho - Precisa melhorar
    } else {
      // Quanto menor o valor, melhor o desempenho
      if (numValue <= reference * 0.2) return '#34a853'; // Verde - Excelente
      if (numValue <= reference * 0.4) return '#4285F4'; // Azul - Bom
      if (numValue <= reference * 0.6) return '#FBBC05'; // Amarelo - Médio
      return '#EA4335'; // Vermelho - Precisa melhorar
    }
  }, []);

  const calculateStats = useCallback((linksData) => {
    // Estatísticas totais
    const totalLinks = linksData.length;
    const totalEntradas = linksData.reduce((sum, link) => sum + (link.quantidade_entrada || 0), 0);
    const totalEntradasGrupo = linksData.reduce((sum, link) => sum + (link.entrada_total_grupo || 0), 0);
    const totalSaidas = linksData.reduce((sum, link) => sum + (link.saidas_totais || 0), 0);
    const totalSaidasUsaramLink = linksData.reduce((sum, link) => sum + (link.saidas_que_usaram_link || 0), 0);
    const totalLeads = linksData.reduce((sum, link) => sum + (link.lead_count || 0), 0);

    // Estatísticas por expert
    const expertMap = new Map();
    linksData.forEach(link => {
      if (!link.expert_apelido) return;
      
      if (!expertMap.has(link.expert_apelido)) {
        expertMap.set(link.expert_apelido, {
          expert: link.expert_apelido,
          links: 0,
          entradas: 0,
          entradasGrupo: 0,
          saidas: 0,
          saidasUsaramLink: 0,
          leads: 0
        });
      }
      
      const expertStats = expertMap.get(link.expert_apelido);
      expertStats.links += 1;
      expertStats.entradas += (link.quantidade_entrada || 0);
      expertStats.entradasGrupo += (link.entrada_total_grupo || 0);
      expertStats.saidas += (link.saidas_totais || 0);
      expertStats.saidasUsaramLink += (link.saidas_que_usaram_link || 0);
      expertStats.leads += (link.lead_count || 0);
    });
    
    // Estatísticas por grupo
    const groupMap = new Map();
    linksData.forEach(link => {
      if (!link.group_name) return;
      
      if (!groupMap.has(link.group_name)) {
        groupMap.set(link.group_name, {
          grupo: link.group_name,
          links: 0,
          entradas: 0,
          entradasGrupo: 0,
          saidas: 0,
          saidasUsaramLink: 0,
          leads: 0
        });
      }
      
      const groupStats = groupMap.get(link.group_name);
      groupStats.links += 1;
      groupStats.entradas += (link.quantidade_entrada || 0);
      groupStats.entradasGrupo += (link.entrada_total_grupo || 0);
      groupStats.saidas += (link.saidas_totais || 0);
      groupStats.saidasUsaramLink += (link.saidas_que_usaram_link || 0);
      groupStats.leads += (link.lead_count || 0);
    });

    // Ordenar por número de entradas (decrescente)
    const expertStats = Array.from(expertMap.values()).sort((a, b) => b.entradas - a.entradas);
    const groupStats = Array.from(groupMap.values()).sort((a, b) => b.entradas - a.entradas);

    setStats({
      totalLinks,
      totalEntradas,
      totalEntradasGrupo,
      totalSaidas,
      totalSaidasUsaramLink,
      totalLeads,
      expertStats,
      groupStats
    });
  }, []);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bravobet_links_personalizados')
        .select('*');

      if (error) throw error;
      
      // Buscar contagem de leads para cada link
      const linksWithLeadCount = await Promise.all(data.map(async (link) => {
        const { count, error: countError } = await supabase
          .from('bravobet_leads_telegram')
          .select('id', { count: 'exact', head: true })
          .eq('nome_invite_link_usado', link.nome_link);
          
        if (countError) {
          console.error('Erro ao buscar contagem de leads:', countError.message);
          return { ...link, lead_count: 0 };
        }
        
        return { ...link, lead_count: count || 0 };
      }));
      
      calculateStats(linksWithLeadCount || []);
    } catch (error) {
      console.error('Erro ao buscar links:', error.message);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Calcular porcentagens e taxas
  const calcularTaxaConversao = useCallback(() => {
    return stats.totalEntradasGrupo > 0 
      ? ((stats.totalEntradas / stats.totalEntradasGrupo) * 100).toFixed(2)
      : 0;
  }, [stats.totalEntradas, stats.totalEntradasGrupo]);

  const calcularTaxaSaida = useCallback(() => {
    return stats.totalSaidas > 0 
      ? ((stats.totalSaidasUsaramLink / stats.totalSaidas) * 100).toFixed(2)
      : 0;
  }, [stats.totalSaidas, stats.totalSaidasUsaramLink]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Estatísticas Gerais</h2>
        <button onClick={fetchLinks} className="button button-update">
          Atualizar Dados
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Carregando...</div>
      ) : (
        <div className="estatisticas-gerais">
          {/* Resumo geral */}
          <div className="stats-overview">
            <div className="stats-card">
              <h3>Total de Links</h3>
              <div className="stats-value">{stats.totalLinks}</div>
            </div>
            <div className="stats-card">
              <h3>Total de Entradas</h3>
              <div className="stats-value" style={{ color: '#34a853' }}>{stats.totalEntradas}</div>
            </div>
            <div className="stats-card">
              <h3>Total de Entradas nos Grupos</h3>
              <div className="stats-value" style={{ color: '#4285F4' }}>{stats.totalEntradasGrupo}</div>
            </div>
            <div className="stats-card">
              <h3>Total de Saídas</h3>
              <div className="stats-value" style={{ color: '#EA4335' }}>{stats.totalSaidas}</div>
            </div>
            <div className="stats-card">
              <h3>Saídas de Usuários que Usaram Links</h3>
              <div className="stats-value" style={{ color: '#FBBC05' }}>{stats.totalSaidasUsaramLink}</div>
            </div>
            <div className="stats-card">
              <h3>Total de Leads</h3>
              <div className="stats-value" style={{ color: '#34a853' }}>{stats.totalLeads}</div>
            </div>
          </div>

          {/* Gráficos de conversão */}
          <div className="stats-graphs">
            <div className="stats-section">
              <h3>Taxa de Conversão de Entradas</h3>
              <div className="stats-info">
                <p>{calcularTaxaConversao()}% das entradas totais vieram através dos links</p>
              </div>
              <div className="stats-bar-container">
                <div 
                  className="stats-bar" 
                  style={{ 
                    width: `${calcularTaxaConversao()}%`, 
                    backgroundColor: getColorByPerformance(calcularTaxaConversao(), true) 
                  }}
                >
                  {calcularTaxaConversao() > 10
                    ? `${calcularTaxaConversao()}%` 
                    : ''}
                </div>
              </div>
            </div>

            <div className="stats-section">
              <h3>Taxa de Saídas</h3>
              <div className="stats-info">
                <p>{calcularTaxaSaida()}% das saídas são de usuários que entraram pelos links</p>
              </div>
              <div className="stats-bar-container">
                <div 
                  className="stats-bar exit-bar" 
                  style={{ 
                    width: `${calcularTaxaSaida()}%`, 
                    backgroundColor: getColorByPerformance(calcularTaxaSaida(), false) 
                  }}
                >
                  {calcularTaxaSaida() > 10
                    ? `${calcularTaxaSaida()}%` 
                    : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas por expert */}
          <div className="stats-table-section">
            <h3>Estatísticas por Expert</h3>
            <div className="table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Expert</th>
                    <th>Links</th>
                    <th>Entradas</th>
                    <th>Entradas no Grupo</th>
                    <th>Taxa de Conversão</th>
                    <th>Saídas</th>
                    <th>Saídas (Usaram Link)</th>
                    <th>Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.expertStats.map((expert, index) => {
                    const taxaConversao = expert.entradasGrupo > 0 
                      ? ((expert.entradas / expert.entradasGrupo) * 100).toFixed(2)
                      : 0;
                    
                    return (
                      <tr key={index}>
                        <td>{expert.expert}</td>
                        <td>{expert.links}</td>
                        <td>{expert.entradas}</td>
                        <td>{expert.entradasGrupo}</td>
                        <td style={{ color: getColorByPerformance(taxaConversao, true) }}>
                          {taxaConversao > 10
                            ? `${taxaConversao}%` 
                            : '0%'}
                        </td>
                        <td>{expert.saidas}</td>
                        <td>{expert.saidasUsaramLink}</td>
                        <td>{expert.leads}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Estatísticas por grupo */}
          <div className="stats-table-section">
            <h3>Estatísticas por Grupo</h3>
            <div className="table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Links</th>
                    <th>Entradas</th>
                    <th>Entradas no Grupo</th>
                    <th>Taxa de Conversão</th>
                    <th>Saídas</th>
                    <th>Saídas (Usaram Link)</th>
                    <th>Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.groupStats.map((grupo, index) => {
                    const taxaConversao = grupo.entradasGrupo > 0 
                      ? ((grupo.entradas / grupo.entradasGrupo) * 100).toFixed(2)
                      : 0;
                    
                    return (
                      <tr key={index}>
                        <td>{grupo.grupo}</td>
                        <td>{grupo.links}</td>
                        <td>{grupo.entradas}</td>
                        <td>{grupo.entradasGrupo}</td>
                        <td style={{ color: getColorByPerformance(taxaConversao, true) }}>
                          {taxaConversao > 10
                            ? `${taxaConversao}%` 
                            : '0%'}
                        </td>
                        <td>{grupo.saidas}</td>
                        <td>{grupo.saidasUsaramLink}</td>
                        <td>{grupo.leads}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Relatórios Diários
const RelatoriosDiarios = () => {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [relatorio, setRelatorio] = useState(null);
  const [error, setError] = useState('');
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [valorInvestido, setValorInvestido] = useState('');
  const [cpa, setCpa] = useState(null);

  const getColorByPerformance = (value) => {
    if (value >= 80) return '#34a853'; // Verde - Excelente
    if (value >= 50) return '#4285F4'; // Azul - Bom
    if (value >= 30) return '#FBBC05'; // Amarelo - Regular
    return '#EA4335'; // Vermelho - Ruim
  };

  const getColorByCPA = (cpa) => {
    if (cpa <= 10) return '#34A853'; // Verde - Bom (CPA baixo é bom)
    if (cpa <= 20) return '#FBBC05'; // Amarelo - Médio
    return '#EA4335'; // Vermelho - Ruim (CPA alto é ruim)
  };

  // Formatar valor em reais
  const formatarValorReais = (valor) => {
    if (!valor) return 'R$ 0,00';
    
    // Se o valor já começar com R$, retorna ele mesmo
    if (typeof valor === 'string' && valor.startsWith('R$')) {
      return valor;
    }
    
    // Tenta converter para número
    const numero = typeof valor === 'string' ? 
      parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')) : 
      parseFloat(valor);
    
    if (isNaN(numero)) return 'R$ 0,00';
    
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  };

  const formatarEntradaValor = (e) => {
    // Pega o valor digitado pelo usuário
    let valor = e.target.value;
    
    // Remove o prefixo R$ se existir
    if (valor.startsWith('R$ ')) {
      valor = valor.substring(3);
    }
    
    // Permite apenas números e vírgula
    valor = valor.replace(/[^\d,]/g, '');
    
    // Atualiza o estado com o valor formatado
    setValorInvestido(valor ? `R$ ${valor}` : '');
  };

  useEffect(() => {
    if (relatorio && valorInvestido) {
      console.log("Calculando CPA:");
      console.log("Valor investido:", valorInvestido);
      console.log("Entradas pelo link:", relatorio.entradas_link);
      
      // Limpar o valor investido (remover R$ e converter vírgula para ponto)
      const valorLimpo = valorInvestido.replace(/[R$\s]/g, '').replace(',', '.');
      const valorNumerico = parseFloat(valorLimpo);
      
      console.log("Valor limpo:", valorLimpo);
      console.log("Valor numérico:", valorNumerico);
      
      if (!isNaN(valorNumerico) && relatorio.entradas_link > 0) {
        // Fórmula do CPA: valor investido / entradas pelo link
        const cpaCalculado = valorNumerico / relatorio.entradas_link;
        console.log("CPA calculado:", cpaCalculado);
        setCpa(cpaCalculado);
      } else {
        console.log("Não foi possível calcular o CPA. Valor numérico válido:", !isNaN(valorNumerico), "Entradas > 0:", relatorio.entradas_link > 0);
        setCpa(null);
      }
    } else {
      console.log("Não há relatório ou valor investido para calcular CPA");
      setCpa(null);
    }
  }, [valorInvestido, relatorio]);

  const buscarRelatorio = async () => {
    if (!selectedLink || !selectedDate) {
      setError('Por favor, selecione um link e uma data.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setBuscaRealizada(true);
      
      console.log('Buscando relatório para:', {
        link: selectedLink,
        data: selectedDate
      });
      
      // Buscar todos os relatórios e filtrar no lado do cliente
      const { data, error } = await supabase
        .from('bravobet_metricas_diarias')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      console.log('Todos os relatórios:', data);
      
      // Filtrar no lado do cliente para garantir que encontramos o relatório
      let relatorioEncontrado = null;
      
      if (data && data.length > 0) {
        console.log("Estrutura completa do primeiro relatório:", JSON.stringify(data[0]));
        
        // Primeiro tentamos uma correspondência exata
        relatorioEncontrado = data.find(item => 
          item.nome_link === selectedLink && 
          item.data_formatada === selectedDate
        );
        
        // Se não encontrar, tentamos uma correspondência parcial case-insensitive
        if (!relatorioEncontrado) {
          relatorioEncontrado = data.find(item => 
            item.nome_link && selectedLink &&
            item.nome_link.toLowerCase().includes(selectedLink.toLowerCase()) && 
            item.data_formatada === selectedDate
          );
        }
        
        // Se ainda não encontrar, tentamos apenas pela data
        if (!relatorioEncontrado) {
          relatorioEncontrado = data.find(item => 
            item.data_formatada === selectedDate
          );
        }
      }
      
      console.log('Relatório encontrado:', relatorioEncontrado);
      setRelatorio(relatorioEncontrado);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error.message);
      setError(`Erro ao buscar relatório: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Buscar lista de links para o dropdown
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bravobet_links_personalizados')
          .select('id, nome_link, expert_apelido');

        if (error) throw error;
        setLinks(data || []);
      } catch (error) {
        console.error('Erro ao buscar links:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Relatórios Diários</h2>
      </div>

      <div className="filtros-container">
        <div className="filtro-grupo">
          <label className="filtro-label">Link:</label>
          <select 
            className="filtro-select"
            value={selectedLink}
            onChange={(e) => setSelectedLink(e.target.value)}
          >
            <option value="">Selecione um link</option>
            {links.map((link) => (
              <option key={link.id} value={link.nome_link}>
                {link.nome_link} - {link.expert_apelido}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label className="filtro-label">Data:</label>
          <input
            type="date"
            className="filtro-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="filtro-grupo">
          <label className="filtro-label">Valor Investido:</label>
          <input
            type="text"
            className="filtro-input"
            value={valorInvestido}
            onChange={formatarEntradaValor}
            placeholder="R$ 0,00"
          />
        </div>

        <button 
          className="button"
          onClick={buscarRelatorio}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar Relatório'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {buscaRealizada && !loading && (
        <div className="relatorio-container">
          {relatorio ? (
            <div className="relatorio-card">
              <h3>Relatório de {selectedDate}</h3>
              <h4>Link: {selectedLink}</h4>
              
              <div className="relatorio-stats">
                <div className="relatorio-stat-grupo">
                  <div className="relatorio-stat">
                    <span className="stat-label">Entradas pelo Link:</span>
                    <span className="stat-value" style={{ color: '#34a853' }}>{relatorio.entradas_link}</span>
                  </div>
                  <div className="relatorio-stat">
                    <span className="stat-label">Entradas Totais:</span>
                    <span className="stat-value" style={{ color: '#4285F4' }}>{relatorio.entradas_totais}</span>
                  </div>
                </div>

                <div className="relatorio-stat-grupo">
                  <div className="relatorio-stat">
                    <span className="stat-label">Saídas de Usuários do Link:</span>
                    <span className="stat-value" style={{ color: '#FBBC05' }}>{relatorio.saidas_link}</span>
                  </div>
                  <div className="relatorio-stat">
                    <span className="stat-label">Saídas Totais:</span>
                    <span className="stat-value" style={{ color: '#EA4335' }}>{relatorio.saidas_totais}</span>
                  </div>
                </div>
                
                <div className="relatorio-stat-grupo">
                  <div className="relatorio-stat">
                    <span className="stat-label">Data de Registro:</span>
                    <span className="stat-value">
                      {new Date(relatorio.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                {/* Taxa de Conversão */}
                <div className="relatorio-stat-grupo">
                  <div className="relatorio-stat">
                    <span className="stat-label">Taxa de Conversão:</span>
                    <span className="stat-value" style={{ 
                      color: relatorio.entradas_totais > 0 
                        ? '#4285F4' 
                        : '#757575' 
                    }}>
                      {relatorio.entradas_totais > 0 
                        ? `${((relatorio.entradas_link / relatorio.entradas_totais) * 100).toFixed(2)}%` 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                
                {/* Contribuição para o Grupo */}
                <div className="relatorio-stat-grupo">
                  <div className="relatorio-stat">
                    <span className="stat-label">Contribuição para o Grupo:</span>
                    <span className="stat-value" style={{ 
                      color: getColorByPerformance(
                        relatorio.entradas_totais > 0 
                          ? ((relatorio.entradas_link / relatorio.entradas_totais) * 100) 
                          : 0
                      ) 
                    }}>
                      {relatorio.entradas_link > 0 && relatorio.entradas_totais > 0
                        ? `${((relatorio.entradas_link / relatorio.entradas_totais) * 100).toFixed(2)}%`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                
                {/* Valor Investido */}
                <div className="relatorio-stat-grupo">
                  <div className="relatorio-stat">
                    <span className="stat-label">Valor Investido:</span>
                    <span className="stat-value">{valorInvestido || 'R$ 0,00'}</span>
                  </div>
                </div>
                
                {/* CPA */}
                <div className="relatorio-stat-grupo">
                  <div className="relatorio-stat">
                    <span className="stat-label">CPA:</span>
                    <span className="stat-value" style={{ color: cpa !== null ? getColorByCPA(cpa) : '#757575' }}>
                      {cpa !== null ? formatarValorReais(cpa) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Gráficos */}
              <div className="relatorio-graficos">
                <div className="grafico-section">
                  <h4>Distribuição de Entradas</h4>
                  <div className="stats-bar-label">Link: {relatorio.entradas_link}</div>
                  <div className="stats-bar-container">
                    <div 
                      className="stats-bar" 
                      style={{ 
                        width: `${relatorio.entradas_totais > 0 
                          ? (relatorio.entradas_link / relatorio.entradas_totais) * 100 
                          : 0}%`,
                        backgroundColor: '#34a853'
                      }}
                    >
                      {relatorio.entradas_totais > 0 && ((relatorio.entradas_link / relatorio.entradas_totais) * 100) > 10
                        ? `${((relatorio.entradas_link / relatorio.entradas_totais) * 100).toFixed(2)}%` 
                        : ''}
                    </div>
                  </div>
                  
                  <div className="stats-bar-label">Outras Entradas: {relatorio.entradas_totais - relatorio.entradas_link}</div>
                  <div className="stats-bar-container">
                    <div 
                      className="stats-bar" 
                      style={{ 
                        width: `${relatorio.entradas_totais > 0 
                          ? ((relatorio.entradas_totais - relatorio.entradas_link) / relatorio.entradas_totais) * 100 
                          : 0}%`,
                        backgroundColor: '#4285F4'
                      }}
                    >
                      {relatorio.entradas_totais > 0 && (((relatorio.entradas_totais - relatorio.entradas_link) / relatorio.entradas_totais) * 100) > 10
                        ? `${(((relatorio.entradas_totais - relatorio.entradas_link) / relatorio.entradas_totais) * 100).toFixed(2)}%` 
                        : ''}
                    </div>
                  </div>
                  
                  <div className="stats-percentages">
                    <div className="stats-percentage-item">
                      <span className="percentage-dot" style={{ backgroundColor: '#34a853' }}></span>
                      <span>Link: {relatorio.entradas_totais > 0 
                        ? `${((relatorio.entradas_link / relatorio.entradas_totais) * 100).toFixed(2)}%` 
                        : '0%'}</span>
                    </div>
                    <div className="stats-percentage-item">
                      <span className="percentage-dot" style={{ backgroundColor: '#4285F4' }}></span>
                      <span>Outras: {relatorio.entradas_totais > 0 
                        ? `${(((relatorio.entradas_totais - relatorio.entradas_link) / relatorio.entradas_totais) * 100).toFixed(2)}%` 
                        : '0%'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grafico-section">
                  <h4>Comparação de Saídas</h4>
                  <div className="stats-bar-label">Saídas do Link: {relatorio.saidas_link}</div>
                  <div className="stats-bar-container">
                    <div 
                      className="stats-bar" 
                      style={{ 
                        width: `${relatorio.saidas_totais > 0 
                          ? (relatorio.saidas_link / relatorio.saidas_totais) * 100 
                          : 0}%`,
                        backgroundColor: '#FBBC05'
                      }}
                    >
                      {relatorio.saidas_totais > 0 && ((relatorio.saidas_link / relatorio.saidas_totais) * 100) > 10
                        ? `${((relatorio.saidas_link / relatorio.saidas_totais) * 100).toFixed(2)}%` 
                        : ''}
                    </div>
                  </div>
                  
                  <div className="stats-bar-label">Outras Saídas: {relatorio.saidas_totais - relatorio.saidas_link}</div>
                  <div className="stats-bar-container">
                    <div 
                      className="stats-bar" 
                      style={{ 
                        width: `${relatorio.saidas_totais > 0 
                          ? ((relatorio.saidas_totais - relatorio.saidas_link) / relatorio.saidas_totais) * 100 
                          : 0}%`,
                        backgroundColor: '#EA4335'
                      }}
                    >
                      {relatorio.saidas_totais > 0 && (((relatorio.saidas_totais - relatorio.saidas_link) / relatorio.saidas_totais) * 100) > 10
                        ? `${(((relatorio.saidas_totais - relatorio.saidas_link) / relatorio.saidas_totais) * 100).toFixed(2)}%` 
                        : ''}
                    </div>
                  </div>
                  
                  <div className="stats-percentages">
                    <div className="stats-percentage-item">
                      <span className="percentage-dot" style={{ backgroundColor: '#FBBC05' }}></span>
                      <span>Link: {relatorio.saidas_totais > 0 
                        ? `${((relatorio.saidas_link / relatorio.saidas_totais) * 100).toFixed(2)}%` 
                        : '0%'}</span>
                    </div>
                    <div className="stats-percentage-item">
                      <span className="percentage-dot" style={{ backgroundColor: '#EA4335' }}></span>
                      <span>Outras: {relatorio.saidas_totais > 0 
                        ? `${(((relatorio.saidas_totais - relatorio.saidas_link) / relatorio.saidas_totais) * 100).toFixed(2)}%` 
                        : '0%'}</span>
                    </div>
                  </div>
                </div>
                
                {/* CPA Visualization */}
                {cpa !== null && (
                  <div className="grafico-section">
                    <h4>Custo por Aquisição (CPA)</h4>
                    <div className="cpa-container">
                      <div className="cpa-bar-container">
                        <div 
                          className="cpa-bar" 
                          style={{ 
                            width: `${Math.min(100, (cpa / 30) * 100)}%`,
                            backgroundColor: getColorByCPA(cpa)
                          }}
                        >
                          {formatarValorReais(cpa)}
                        </div>
                      </div>
                      
                      <div className="cpa-scale">
                        <span>R$ 0</span>
                        <span>R$ 10</span>
                        <span>R$ 20</span>
                        <span>R$ 30+</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-data-message">
              <p>Não há relatório disponível para o link <strong>{selectedLink}</strong> na data <strong>{selectedDate}</strong>.</p>
              <p>Os relatórios são gerados automaticamente ao final de cada dia.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente Principal
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const authenticated = localStorage.getItem('dashboardAuthenticated') === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboardAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div>
      <nav className="nav">
        <div className="nav-container">
          <button
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${activeTab === 'estatisticas' ? 'active' : ''}`}
            onClick={() => setActiveTab('estatisticas')}
          >
            Estatísticas Gerais
          </button>
          <button
            className={`nav-button ${activeTab === 'relatorios' ? 'active' : ''}`}
            onClick={() => setActiveTab('relatorios')}
          >
            Relatórios Diários
          </button>
          <button
            className={`nav-button ${activeTab === 'cadastro' ? 'active' : ''}`}
            onClick={() => setActiveTab('cadastro')}
          >
            Novo Cadastro
          </button>
          <button
            className="nav-button"
            onClick={handleLogout}
            style={{ marginLeft: 'auto' }}
          >
            Sair
          </button>
        </div>
      </nav>

      <main style={{ padding: '20px 0' }}>
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'estatisticas' ? (
          <EstatisticasGerais />
        ) : activeTab === 'relatorios' ? (
          <RelatoriosDiarios />
        ) : (
          <CadastroForm onCadastroSuccess={() => setActiveTab('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default App;
