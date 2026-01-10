import React, { useState } from 'react';

const OrcamentoForm = () => {
  const [formData] = useState({
    clienteId: '',
    veiculoId: '',
    dataEmissao: '',
    dataValidade: '',
    descricaoProblema: '',
    observacoes: '',
    desconto: 0,
    itens: [{ tipo: '', descricao: '', quantidade: 1, valorUnitario: 0 }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do orçamento:', formData);
    // Adicione a lógica para enviar os dados para o endpoint de criação de orçamento
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <button type="submit">Salvar Orçamento</button>
    </form>
  );
};

export default OrcamentoForm;
