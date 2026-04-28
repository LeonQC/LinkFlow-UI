import { useQuery } from '@tanstack/react-query';
import { api } from '../services/linkflow-api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  hotLinks: (window: string, limit: number) => [...dashboardKeys.all, 'hot-links', window, limit] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: api.getDashboardStats,
    refetchInterval: 30000,
  });
}

export function useHotLinks(window = '15m', limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.hotLinks(window, limit),
    queryFn: () => api.getHotLinks(window, limit),
    refetchInterval: 30000,
  });
}
