import React, { useState } from 'react';

const ReciboForm = () => {
  const [formData] = useState({
    orcamentoId: '',
    clienteId: '',
    dataEmissao: '',
    valorPago: 0,
    formaPagamento: '',
    descricao: '',
    observacoes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do recibo:', formData);
    // Adicione a lógica para enviar os dados para o endpoint de criação de recibo
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <button type="submit">Salvar Recibo</button>
    </form>
  );
};

export default ReciboForm;
