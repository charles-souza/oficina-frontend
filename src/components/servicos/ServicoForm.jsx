import React, { useState } from 'react';

const ServicoForm = () => {
  const [formData, setFormData] = useState({
    descricao: '',
    preco: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário de serviço:', formData);
    // Aqui você pode adicionar a lógica para enviar os dados para um servidor
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Descrição:</label>
        <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required />
      </div>
      <div>
        <label>Preço:</label>
        <input type="number" name="preco" value={formData.preco} onChange={handleChange} required />
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
};

export default ServicoForm;
