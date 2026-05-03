import { useQuery } from '@tanstack/react-query';
import { api } from '../services/linkflow-api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  trends: (granularity: string) => [...dashboardKeys.all, 'trends', granularity] as const,
  channels: () => [...dashboardKeys.all, 'channels'] as const,
  locations: () => [...dashboardKeys.all, 'locations'] as const,
  realtimeOverview: (window: string) => [...dashboardKeys.all, 'realtime-overview', window] as const,
  hotLinks: (window: string, limit: number) => [...dashboardKeys.all, 'hot-links', window, limit] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => api.getDashboardStats(),
    refetchInterval: 30000,
  });
}

export function useDashboardTrends(granularity = '1h') {
  return useQuery({
    queryKey: dashboardKeys.trends(granularity),
    queryFn: () => api.getDashboardTrends({ granularity }),
    refetchInterval: 30000,
  });
}

export function useDashboardChannels() {
  return useQuery({
    queryKey: dashboardKeys.channels(),
    queryFn: () => api.getDashboardChannels(),
    refetchInterval: 30000,
  });
}

export function useDashboardLocations() {
  return useQuery({
    queryKey: dashboardKeys.locations(),
    queryFn: () => api.getDashboardLocations(),
    refetchInterval: 30000,
  });
}

export function useRealtimeOverview(window = '15m') {
  return useQuery({
    queryKey: dashboardKeys.realtimeOverview(window),
    queryFn: () => api.getRealtimeOverview(window),
    refetchInterval: 15000,
  });
}

export function useHotLinks(window = '15m', limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.hotLinks(window, limit),
    queryFn: () => api.getHotLinks(window, limit),
    refetchInterval: 30000,
  });
}
