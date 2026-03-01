export interface ClienteFormValues {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface VeiculoFormValues {
  clienteId: number | string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number | string;
  cor: string;
}

export interface OrcamentoFormValues {
  clienteId: number | string;
  veiculoId: number | string;
  dataOrcamento: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  observacoes?: string;
  itens: {
    descricao: string;
    quantidade: number | string;
    valorUnitario: number | string;
  }[];
}

export interface ReciboFormValues {
  clienteId: number | string;
  veiculoId: number | string;
  dataEmissao: string;
  valorTotal: number | string;
  formaPagamento: string;
  descricao: string;
  observacoes?: string;
}

export interface ServicoFormValues {
  nome: string;
  descricao?: string;
  preco: number | string;
  tempoEstimado?: number | string;
}
