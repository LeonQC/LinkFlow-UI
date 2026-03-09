import React from 'react';
import { Activity, Server } from 'lucide-react';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { Card } from '../components/ui/card';
import { useBackendHealth } from '../hooks/use-backend-health';
import { api, backendCapabilities } from '../services/linkflow-api';

export function MonitoringPageLive() {
  const { data: health, isLoading, isError, refetch, isFetching } = useBackendHealth();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">System Monitoring</h1>
          <p className="text-sm text-[#6B7280] mt-1">This page now shows only real backend health information.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#111827]"
        >
          {isFetching ? 'Refreshing...' : 'Refresh health'}
        </button>
      </div>

      <BackendCapabilityAlert
        title="Monitoring scope"
        description={backendCapabilities.monitoring.summary}
        tone="warning"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Actuator health</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">
                {isLoading ? 'Checking...' : isError ? 'Unavailable' : health?.status ?? 'Unknown'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE]">
              <Activity className="w-6 h-6 text-[#2563EB]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Backend base URL</p>
              <p className="mt-2 text-sm font-medium text-[#111827] break-all">{api.config.baseUrl}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E5E7EB]">
              <Server className="w-6 h-6 text-[#111827]" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-3">Raw health payload</h2>
        <pre className="overflow-auto rounded-lg bg-[#111827] p-4 text-xs text-white">
          {JSON.stringify(health ?? { status: isError ? 'UNAVAILABLE' : 'PENDING' }, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
