export interface ClienteFormValues {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes?: string;
}

export interface VeiculoFormValues {
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  chassi?: string;
  renavam?: string;
  observacoes?: string;
}

export interface OrcamentoFormValues {
  clienteId: string;
  veiculoId: string;
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
  clienteId: string;
  veiculoId: string;
  dataEmissao: string;
  valorTotal: number | string;
  formaPagamento: string;
  descricao: string;
  observacoes?: string;
}

export interface ServicoFormValues {
  nome: string;
  descricao?: string;
  precoPadrao: number | string;
  tempoEstimado?: number | string;
  categoria?: string;
  ativo?: boolean;
}
