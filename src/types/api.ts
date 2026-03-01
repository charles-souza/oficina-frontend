export interface Cliente {
  id?: number;
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

export interface Veiculo {
  id?: number;
  clienteId: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  clienteNome?: string;
}

export interface OrcamentoItem {
  id?: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Orcamento {
  id?: number;
  clienteId: number;
  veiculoId: number;
  dataOrcamento: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  observacoes?: string;
  valorTotal: number;
  itens: OrcamentoItem[];
  clienteNome?: string;
  veiculoPlaca?: string;
}

export interface Recibo {
  id?: number;
  clienteId: number;
  veiculoId: number;
  dataEmissao: string;
  valorTotal: number;
  formaPagamento: string;
  descricao: string;
  observacoes?: string;
  clienteNome?: string;
  veiculoPlaca?: string;
}

export interface Servico {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  tempoEstimado?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  message: string;
  error?: string;
  status?: number;
}
