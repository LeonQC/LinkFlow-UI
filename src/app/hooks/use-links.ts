import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  api,
  type CreateLinkPayload,
  type Link,
  type LinkListParams,
  type UpdateLinkPayload,
  type UpdateLinkStatusPayload,
} from '../services/linkflow-api';

export const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...linkKeys.lists(), filters] as const,
  details: () => [...linkKeys.all, 'detail'] as const,
  detail: (id: string) => [...linkKeys.details(), id] as const,
  analytics: (id: string) => [...linkKeys.detail(id), 'analytics'] as const,
  accessLogs: (id: string, page: number) => [...linkKeys.detail(id), 'access-logs', page] as const,
};

export function useLinks(params: LinkListParams = {}) {
  return useQuery({
    queryKey: linkKeys.list(params),
    queryFn: () => api.getLinks(params),
  });
}

export function useLink(id: string) {
  return useQuery({
    queryKey: linkKeys.detail(id),
    queryFn: () => api.getLink(id),
    enabled: Boolean(id),
  });
}

export function useLinkAnalytics(id: string) {
  return {
    summary: useQuery({
      queryKey: [...linkKeys.analytics(id), 'summary'],
      queryFn: () => api.getLinkAnalyticsSummary(id),
      enabled: Boolean(id),
    }),
    timeseries: useQuery({
      queryKey: [...linkKeys.analytics(id), 'timeseries'],
      queryFn: () => api.getLinkAnalyticsTimeseries(id, { granularity: '1h' }),
      enabled: Boolean(id),
    }),
    devices: useQuery({
      queryKey: [...linkKeys.analytics(id), 'devices'],
      queryFn: () => api.getLinkAnalyticsDevices(id),
      enabled: Boolean(id),
    }),
    browsers: useQuery({
      queryKey: [...linkKeys.analytics(id), 'browsers'],
      queryFn: () => api.getLinkAnalyticsBrowsers(id),
      enabled: Boolean(id),
    }),
    locations: useQuery({
      queryKey: [...linkKeys.analytics(id), 'locations'],
      queryFn: () => api.getLinkAnalyticsLocations(id),
      enabled: Boolean(id),
    }),
  };
}

export function useLinkAccessLogs(id: string, page = 1, size = 50) {
  return useQuery({
    queryKey: linkKeys.accessLogs(id, page),
    queryFn: () => api.getLinkAccessLogs(id, { page, size }),
    enabled: Boolean(id),
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLinkPayload) => api.createLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      toast.success('Short link created.');
    },
    onError: (error: Error) => {
      toast.error(`Create failed: ${error.message}`);
    },
  });
}

export function usePreviewLinkTitle() {
  return useMutation({
    mutationFn: (originalUrl: string) => api.previewLinkTitle(originalUrl),
    onError: (error: Error) => {
      toast.error(`Title preview failed: ${error.message}`);
    },
  });
}

export function useSlugRecommendations() {
  return useMutation({
    mutationFn: (payload: { originalUrl: string; title?: string; limit?: number }) => api.getSlugRecommendations(payload),
    onError: (error: Error) => {
      toast.error(`Back-half recommendations failed: ${error.message}`);
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLinkPayload }) => api.updateLink(id, data),
    onSuccess: (data: Link) => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: linkKeys.detail(data.id) });
      toast.success('Short link updated.');
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

export function useUpdateLinkStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLinkStatusPayload }) => api.updateLinkStatus(id, data),
    onSuccess: (data: Link) => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: linkKeys.detail(data.id) });
      toast.success('Short link status updated.');
    },
    onError: (error: Error) => {
      toast.error(`Status update failed: ${error.message}`);
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      toast.success('Short link deleted.');
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}
