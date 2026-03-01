import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * Configuração padrão do React Query
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Tempo de cache: 5 minutos
    staleTime: 1000 * 60 * 5,
    // Tempo para garbage collection: 10 minutos
    gcTime: 1000 * 60 * 10,
    // Retry em caso de erro
    retry: 1,
    // Retry delay
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus
    refetchOnWindowFocus: false,
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Refetch on mount
    refetchOnMount: true,
  },
  mutations: {
    // Retry para mutations
    retry: 0,
  },
};

/**
 * Cliente React Query
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

/**
 * Query keys para organização
 */
export const queryKeys = {
  // Clientes
  clientes: {
    all: ['clientes'] as const,
    lists: () => [...queryKeys.clientes.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.clientes.lists(), { filters }] as const,
    details: () => [...queryKeys.clientes.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.clientes.details(), id] as const,
  },

  // Veículos
  veiculos: {
    all: ['veiculos'] as const,
    lists: () => [...queryKeys.veiculos.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.veiculos.lists(), { filters }] as const,
    details: () => [...queryKeys.veiculos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.veiculos.details(), id] as const,
  },

  // Orçamentos
  orcamentos: {
    all: ['orcamentos'] as const,
    lists: () => [...queryKeys.orcamentos.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.orcamentos.lists(), { filters }] as const,
    details: () => [...queryKeys.orcamentos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.orcamentos.details(), id] as const,
  },

  // Ordens de Serviço
  ordensServico: {
    all: ['ordens-servico'] as const,
    lists: () => [...queryKeys.ordensServico.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.ordensServico.lists(), { filters }] as const,
    details: () => [...queryKeys.ordensServico.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.ordensServico.details(), id] as const,
  },

  // Recibos
  recibos: {
    all: ['recibos'] as const,
    lists: () => [...queryKeys.recibos.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.recibos.lists(), { filters }] as const,
    details: () => [...queryKeys.recibos.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.recibos.details(), id] as const,
  },

  // Histórico
  historico: {
    all: ['historico'] as const,
    byVeiculo: (veiculoId: number) => [...queryKeys.historico.all, 'veiculo', veiculoId] as const,
    byOrdem: (ordemId: number) => [...queryKeys.historico.all, 'ordem', ordemId] as const,
  },

  // Dashboard
  dashboard: {
    metrics: ['dashboard', 'metrics'] as const,
  },
} as const;

export default queryClient;
