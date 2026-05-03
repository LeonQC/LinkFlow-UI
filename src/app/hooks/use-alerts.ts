import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, type RiskAlertListParams } from '../services/linkflow-api';

export const alertKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: (params?: RiskAlertListParams) => [...alertKeys.lists(), params] as const,
};

export function useAlerts(params: RiskAlertListParams = {}) {
  return useQuery({
    queryKey: alertKeys.list(params),
    queryFn: () => api.getAlerts(params),
    refetchInterval: 60000,
  });
}

export function useReviewAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: 'approved' | 'blocked' | 'blacklisted';
      comment?: string;
    }) => api.updateAlert(id, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
      toast.success('Alert review submitted.');
    },
    onError: (error: Error) => {
      toast.error(`Review failed: ${error.message}`);
    },
  });
}

export function useCreateRiskScanTask() {
  return useMutation({
    mutationFn: (payload: { linkId?: string; longUrl?: string }) => api.createRiskScanTask(payload),
    onSuccess: () => {
      toast.success('Risk scan task created.');
    },
    onError: (error: Error) => {
      toast.error(`Scan task failed: ${error.message}`);
    },
  });
}
