import api from './api';

export interface DashboardMetrics {
  totalClientes: number;
  totalVeiculos: number;
  totalOrcamentos: number;
  totalOrdensServico: number;
  ordensAbertasHoje: number;
  ordensEmAndamento: number;
  ordensAguardandoPeca: number;
  ordensProntas: number;
  receitaOrcamentos: number;
  receitaOrdensServico: number;
  receitaMensal: number;
}

export interface OrdensPorStatus {
  status: string;
  quantidade: number;
}

export interface ReceitaMensal {
  mes: string;
  receita: number;
}

export interface DashboardData {
  metricas: DashboardMetrics;
  ordensPorStatus: OrdensPorStatus[];
  receitaMensal: ReceitaMensal[];
}

const BASE_URL = '/dashboard';

export const dashboardService = {
  /**
   * Buscar todas as métricas do dashboard
   */
  getMetrics: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>(BASE_URL);
    return response.data;
  },

  /**
   * Buscar apenas as métricas principais
   */
  getMainMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>(BASE_URL);
    return response.data;
  },

  /**
   * Buscar distribuição de ordens por status
   */
  getOrdensByStatus: async (): Promise<OrdensPorStatus[]> => {
    const response = await api.get<OrdensPorStatus[]>(`${BASE_URL}/ordens-status`);
    return response.data;
  },

  /**
   * Buscar receita mensal dos últimos meses
   */
  getMonthlyRevenue: async (months: number = 6): Promise<ReceitaMensal[]> => {
    const response = await api.get<ReceitaMensal[]>(`${BASE_URL}/receita-mensal`, {
      params: { months },
    });
    return response.data;
  },
};
