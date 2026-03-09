import { useQuery } from '@tanstack/react-query';
import { api } from '../services/linkflow-api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: api.getDashboardStats,
    refetchInterval: 30000,
  });
}
