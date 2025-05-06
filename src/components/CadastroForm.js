import React, { useState } from 'react';
import LinksService from '../services/links.service';
import LinkForm from './LinkForm';

const CadastroForm = ({ onCadastroSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      // Remover o campo selected_user_id do formData para evitar erro
      const { selected_user_id, ...dataToInsert } = formData;
      
      // Criar o link usando o serviço
      await LinksService.createLink(dataToInsert);
      
      alert('Link cadastrado com sucesso!');
      onCadastroSuccess();
    } catch (error) {
      setError('Erro ao cadastrar: ' + (error.message || 'Ocorreu um erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Cadastrar Novo Link</h2>
      
      <LinkForm onSubmit={handleSubmit} buttonText="Cadastrar" />
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Cadastrando...</div>}
    </div>
  );
};

export default CadastroForm;
