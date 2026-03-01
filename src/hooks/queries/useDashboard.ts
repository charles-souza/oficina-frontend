import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { queryKeys } from '@/lib/react-query';

/**
 * Hook para métricas do dashboard
 */
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () => dashboardService.getMainMetrics(),
    // Refetch a cada 30 segundos
    refetchInterval: 30000,
    // Stale time menor para dados em tempo real
    staleTime: 1000 * 20, // 20 segundos
  });
};
