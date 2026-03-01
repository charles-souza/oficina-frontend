export const DRAWER_WIDTH = 240;

export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente.',
  SAVE_CLIENT: 'Erro ao salvar cliente.',
  DELETE_CLIENT: 'Erro ao excluir cliente.',
  LOAD_CLIENTS: 'Erro ao carregar clientes.',
  SAVE_VEHICLE: 'Erro ao salvar veículo.',
  DELETE_VEHICLE: 'Erro ao excluir veículo.',
  LOAD_VEHICLES: 'Erro ao carregar veículos.',
  SAVE_QUOTE: 'Erro ao salvar orçamento.',
  DELETE_QUOTE: 'Erro ao excluir orçamento.',
  LOAD_QUOTES: 'Erro ao carregar orçamentos.',
  UPDATE_STATUS: 'Erro ao atualizar status.',
  CEP_LOOKUP: 'Erro ao buscar CEP.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
} as const;

export const SUCCESS_MESSAGES = {
  SAVE_CLIENT: 'Cliente salvo com sucesso!',
  DELETE_CLIENT: 'Cliente excluído com sucesso!',
  SAVE_VEHICLE: 'Veículo salvo com sucesso!',
  DELETE_VEHICLE: 'Veículo excluído com sucesso!',
  SAVE_QUOTE: 'Orçamento salvo com sucesso!',
  DELETE_QUOTE: 'Orçamento excluído com sucesso!',
  UPDATE_STATUS: 'Status atualizado com sucesso!',
} as const;

export const QUOTE_STATUS = {
  PENDING: 'PENDENTE',
  APPROVED: 'APROVADO',
  REJECTED: 'REJEITADO',
  COMPLETED: 'CONCLUIDO',
} as const;

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  [QUOTE_STATUS.PENDING]: 'Pendente',
  [QUOTE_STATUS.APPROVED]: 'Aprovado',
  [QUOTE_STATUS.REJECTED]: 'Rejeitado',
  [QUOTE_STATUS.COMPLETED]: 'Concluído',
};

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  DASHBOARD: '/',
  CLIENTS: '/clientes',
  VEHICLES: '/veiculos',
  QUOTES: '/orcamentos',
  RECEIPTS: '/recibos',
  SERVICES: '/servicos',
  SERVICE_ORDERS: '/ordens-servico',
  HISTORY: '/historico',
  PROFILE: '/perfil',
  SETTINGS: '/configuracoes',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [5, 10, 25, 50],
} as const;
