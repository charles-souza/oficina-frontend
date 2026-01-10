import React, { useState } from 'react';

const VeiculoForm = () => {
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    chassi: '',
    renavam: '',
    observacoes: '',
    clienteId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do veículo:', formData);
    // Adicione a lógica para enviar os dados para o endpoint de criação de veículo
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Placa:</label>
        <input type="text" name="placa" value={formData.placa} onChange={handleChange} required />
      </div>
      <div>
        <label>Marca:</label>
        <input type="text" name="marca" value={formData.marca} onChange={handleChange} required />
      </div>
      <div>
        <label>Modelo:</label>
        <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} required />
      </div>
      <div>
        <label>Ano:</label>
        <input type="number" name="ano" value={formData.ano} onChange={handleChange} required />
      </div>
      <div>
        <label>Cor:</label>
        <input type="text" name="cor" value={formData.cor} onChange={handleChange} required />
      </div>
      <div>
        <label>Chassi:</label>
        <input type="text" name="chassi" value={formData.chassi} onChange={handleChange} required />
      </div>
      <div>
        <label>Renavam:</label>
        <input type="text" name="renavam" value={formData.renavam} onChange={handleChange} required />
      </div>
      <div>
        <label>Observações:</label>
        <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} />
      </div>
      <div>
        <label>Cliente ID:</label>
        <input type="text" name="clienteId" value={formData.clienteId} onChange={handleChange} required />
      </div>
      <button type="submit">Salvar Veículo</button>
    </form>
  );
};

export default VeiculoForm;

