import { useQuery } from '@tanstack/react-query';
import { api } from '../services/linkflow-api';

export const backendHealthKeys = {
  all: ['backend-health'] as const,
};

export function useBackendHealth() {
  return useQuery({
    queryKey: backendHealthKeys.all,
    queryFn: api.getBackendHealth,
    retry: 0,
    refetchInterval: 30000,
  });
}
