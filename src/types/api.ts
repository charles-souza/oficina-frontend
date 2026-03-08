export interface Cliente {
  id?: string;
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

export interface Veiculo {
  id?: string;
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  chassi?: string;
  renavam?: string;
  observacoes?: string;
  // Campos de exibição
  clienteNome?: string;
}

export interface OrcamentoItem {
  id?: string;
  tipo?: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
}

export interface Orcamento {
  id?: string;
  clienteId: string;
  veiculoId: string;
  dataOrcamento?: string; // Compatibilidade com backend antigo
  dataEmissao?: string;
  dataValidade?: string;
  descricaoProblema?: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';
  observacoes?: string;
  desconto?: number;
  valorTotal?: number;
  itens: OrcamentoItem[];
  // Campos de exibição retornados pelo backend
  clienteNome?: string;
  veiculoPlaca?: string;
  veiculoModelo?: string;
}

export interface Recibo {
  id?: string;
  orcamentoId?: string;
  ordemServicoId?: string;
  clienteId: string;
  veiculoId?: string;
  dataEmissao: string;
  valorPago: number;
  formaPagamento: string;
  descricao?: string;
  observacoes?: string;
  // Campos de exibição
  clienteNome?: string;
  veiculoPlaca?: string;
}

export interface Servico {
  id?: string;
  nome: string;
  descricao?: string;
  precoPadrao: number;
  tempoEstimado?: number;
  categoria?: string;
  ativo?: boolean;
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
  id?: string;
  tipo: ItemTipo;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
}

export interface OrdemServico {
  id?: string;
  clienteId: string;
  veiculoId: string;
  orcamentoId?: string;
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
  clienteId: string;
  veiculoId: string;
  orcamentoId?: string;
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
  id?: string;
  veiculoId: string;
  ordemServicoId?: string;
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
