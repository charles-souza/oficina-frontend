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

// Tipos para Ordem de Serviço
export enum OrdemServicoStatus {
  ABERTA = 'ABERTA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  AGUARDANDO_PECA = 'AGUARDANDO_PECA',
  PRONTA = 'PRONTA',
  ENTREGUE = 'ENTREGUE',
  CANCELADA = 'CANCELADA'
}

export enum ItemTipo {
  SERVICO = 'SERVICO',
  PECA = 'PECA'
}

export interface ItemOrdemServico {
  id?: number;
  tipo: ItemTipo;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
}

export interface OrdemServico {
  id?: number;
  clienteId: number;
  veiculoId: number;
  orcamentoId?: number;
  dataAbertura: string;
  dataConclusao?: string;
  dataEntrega?: string;
  descricao: string;
  observacoes?: string;
  valorTotal: number;
  desconto: number;
  status: OrdemServicoStatus;
  itens: ItemOrdemServico[];
  // Campos de exibição
  clienteNome?: string;
  veiculoPlaca?: string;
  veiculoModelo?: string;
}

export interface OrdemServicoRequest {
  clienteId: number;
  veiculoId: number;
  orcamentoId?: number;
  dataAbertura: string;
  dataConclusao?: string;
  dataEntrega?: string;
  descricao: string;
  observacoes?: string;
  desconto: number;
  itens: ItemOrdemServico[];
}

// Tipos para Histórico de Serviços
export enum TipoEvento {
  CRIACAO = 'CRIACAO',
  ALTERACAO_STATUS = 'ALTERACAO_STATUS',
  ADICAO_ITEM = 'ADICAO_ITEM',
  REMOCAO_ITEM = 'REMOCAO_ITEM',
  CONCLUSAO = 'CONCLUSAO',
  ENTREGA = 'ENTREGA',
  CANCELAMENTO = 'CANCELAMENTO'
}

export interface HistoricoServico {
  id?: number;
  veiculoId: number;
  ordemServicoId?: number;
  tipoEvento: TipoEvento;
  statusAnterior?: OrdemServicoStatus;
  statusNovo?: OrdemServicoStatus;
  dataEvento: string;
  descricao: string;
  usuarioResponsavel: string;
  // Campos de exibição
  veiculoPlaca?: string;
  veiculoModelo?: string;
  ordemServicoNumero?: string;
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
