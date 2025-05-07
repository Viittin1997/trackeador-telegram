import React, { useState } from 'react';

const LinkForm = ({ initialData = {}, onSubmit, buttonText = "Cadastrar" }) => {
  const [formData, setFormData] = useState({
    link: '',
    nome_link: '',
    expert_apelido: '',
    group_name: '',
    id_channel_telegram: '',
    token_api: '',
    pixel_id: '',
    is_external: false,
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label className="form-label">Link do Telegram:</label>
        <input
          type="text"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className="form-input"
          placeholder="https://t.me/..."
          required={!initialData.id}
        />
        <div className="form-help">
          <p>Cole o link completo do grupo/canal do Telegram.</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Nome do Link:</label>
        <input
          type="text"
          name="nome_link"
          value={formData.nome_link}
          onChange={handleChange}
          className="form-input"
          placeholder="Nome para identificar o link"
          required={!initialData.id}
        />
        <div className="form-help">
          <p>Especificação para nome do link no Telegram:</p>
          <p>1. Ao criar um link de convite personalizado no Telegram, você precisa definir um nome único</p>
          <p>2. Recomendamos seguir o padrão: bot_[apelido do expert]_[local onde está]</p>
          <p>3. Exemplo: bot_llaviator_lpviittin</p>
          <p><strong>Importante:</strong> Este nome deve ser único no Telegram.</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Apelido do Expert:</label>
        <input
          type="text"
          name="expert_apelido"
          value={formData.expert_apelido}
          onChange={handleChange}
          className="form-input"
          placeholder="Nome do expert"
        />
        <div className="form-help">
          <p><strong>Importante:</strong> Mantenha a consistência do apelido!</p>
          <p>Se já usou um apelido anteriormente (ex: "llaviator"), utilize sempre o mesmo</p>
          <p>Isso facilita a filtragem e organização dos links no dashboard</p>
          <p>Não use variações do mesmo apelido (ex: "llaviator", "llaviator1", "llaviator_oficial")</p>
          <p>Verifique os apelidos existentes antes de criar um novo</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Nome do Grupo:</label>
        <input
          type="text"
          name="group_name"
          value={formData.group_name}
          onChange={handleChange}
          className="form-input"
          placeholder="Nome do grupo"
        />
        <div className="form-help">
          <p>Instruções para o nome do grupo:</p>
          <p>O ideal é utilizar o nome exato do grupo do Telegram</p>
          <p>Este campo não precisa ser único, pois podem existir vários links para o mesmo grupo</p>
          <p>Serve principalmente para identificação e organização dos links</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">ID do Canal Telegram:</label>
        <input
          type="text"
          name="id_channel_telegram"
          value={formData.id_channel_telegram}
          onChange={handleChange}
          className="form-input"
          placeholder="Ex: -1001234567890"
        />
        <div className="form-help">
          <p>Este ID será fornecido manualmente.</p>
          <p>Formato exemplo: -1002156853392 (inclua o sinal de menos se presente)</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Token API do Meta:</label>
        <input
          type="text"
          name="token_api"
          value={formData.token_api}
          onChange={handleChange}
          className="form-input"
          placeholder="Token de API do Meta"
        />
        <div className="form-help">
          <p>Para obter o Token API do Meta associado ao Pixel:</p>
          <p>1. Acesse o <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">Gerenciador de Eventos do Facebook</a></p>
          <p>2. Selecione o Pixel ID desejado</p>
          <p>3. Clique em "Configurações" no menu lateral</p>
          <p>4. Role até a seção "Token de Acesso"</p>
          <p>5. Crie um novo token ou use um existente</p>
          <p>6. Copie o token gerado e cole neste campo</p>
          <p><strong>Importante:</strong> Este token é necessário para registrar as conversões no Meta Ads.</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Pixel ID:</label>
        <input
          type="text"
          name="pixel_id"
          value={formData.pixel_id}
          onChange={handleChange}
          className="form-input"
          placeholder="ID do pixel de rastreamento"
        />
        <div className="form-help">
          <p>Para encontrar seu Pixel ID:</p>
          <p>1. Acesse o <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">Gerenciador de Eventos do Facebook</a></p>
          <p>2. Selecione o pixel desejado</p>
          <p>3. O ID do pixel será exibido no topo da página ou em "Configurações"</p>
          <p>4. É um número de 16 dígitos (exemplo: 1234567890123456)</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Link Externo (Bio Instagram ou similar):</label>
        <div className="form-checkbox">
          <input
            type="checkbox"
            name="is_external"
            checked={formData.is_external}
            onChange={handleChange}
            className="form-checkbox-input"
          />
          <span className="form-checkbox-label">Este é um link externo</span>
        </div>
        <div className="form-help">
          <p><strong>Importante:</strong> Ative esta opção apenas se o link for usado em uma bio do Instagram ou outro local externo.</p>
          <p>Quando ativado, o pixel não será marcado na automação do n8n para rastreamento do anúncio.</p>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="button">
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default LinkForm;
