import { useQuery } from '@tanstack/react-query';
import { api } from '../services/linkflow-api';

export const backendHealthKeys = {
  all: ['backend-health'] as const,
  services: () => [...backendHealthKeys.all, 'services'] as const,
  dependency: (name: string) => [...backendHealthKeys.all, 'dependency', name] as const,
  metrics: (metric: string, window: string) => [...backendHealthKeys.all, 'metrics', metric, window] as const,
};

export function useBackendHealth() {
  return useQuery({
    queryKey: backendHealthKeys.all,
    queryFn: api.getMonitoringHealth,
    retry: 0,
    refetchInterval: 30000,
  });
}

export function useMonitoringServices() {
  return useQuery({
    queryKey: backendHealthKeys.services(),
    queryFn: api.getMonitoringServices,
    retry: 0,
    refetchInterval: 30000,
  });
}

export function useMonitoringDependency(name: 'redis' | 'kafka' | 'rabbitmq' | 'flink') {
  return useQuery({
    queryKey: backendHealthKeys.dependency(name),
    queryFn: () => {
      if (name === 'redis') return api.getMonitoringRedis();
      if (name === 'kafka') return api.getMonitoringKafka();
      if (name === 'rabbitmq') return api.getMonitoringRabbitmq();
      return api.getMonitoringFlinkJobs();
    },
    retry: 0,
    refetchInterval: 30000,
  });
}

export function useMonitoringMetricTimeseries(metric = 'qps', window = '1h') {
  return useQuery({
    queryKey: backendHealthKeys.metrics(metric, window),
    queryFn: () => api.getMonitoringMetricTimeseries(metric, window),
    retry: 0,
    refetchInterval: 30000,
  });
}
