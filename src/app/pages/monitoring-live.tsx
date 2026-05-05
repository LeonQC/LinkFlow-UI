import React from 'react';
import { Activity, Database, Server } from 'lucide-react';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import {
  useBackendHealth,
  useMonitoringDependency,
  useMonitoringMetricTimeseries,
  useMonitoringServices,
} from '../hooks/use-backend-health';
import { api, backendCapabilities, type MonitoringServiceStatus } from '../services/linkflow-api';

function StatusValue({ value }: { value?: string }) {
  const normalized = value ?? 'unknown';
  const label = normalized === 'not_configured' ? 'Not configured' : normalized;
  const color = normalized === 'UP' || normalized === 'PONG' ? 'text-[#047857]' : normalized === 'not_configured' ? 'text-[#92400E]' : normalized === 'DOWN' ? 'text-[#B91C1C]' : 'text-[#374151]';
  return <span className={color}>{label}</span>;
}

function DependencyCard({ name, status }: { name: string; status?: MonitoringServiceStatus }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#6B7280]">{name}</p>
          <p className="mt-2 text-2xl font-semibold"><StatusValue value={status?.status} /></p>
          {status?.reason ? <p className="mt-2 text-sm text-[#6B7280]">{status.reason}</p> : null}
          {status?.error ? <p className="mt-2 text-sm text-[#B91C1C]">{status.error}</p> : null}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE]"><Database className="h-6 w-6 text-[#2563EB]" /></div>
      </div>
    </Card>
  );
}

export function MonitoringPageLive() {
  const { data: health, isLoading, isError, refetch, isFetching, error } = useBackendHealth();
  const { data: services } = useMonitoringServices();
  const redis = useMonitoringDependency('redis');
  const kafka = useMonitoringDependency('kafka');
  const rabbitmq = useMonitoringDependency('rabbitmq');
  const flink = useMonitoringDependency('flink');
  const metrics = useMonitoringMetricTimeseries('qps', '1h');

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">System Monitoring</h1>
          <p className="text-sm text-[#6B7280] mt-1">Live monitoring endpoints with not-configured states handled explicitly.</p>
        </div>
        <button type="button" onClick={() => void refetch()} className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#111827]">{isFetching ? 'Refreshing...' : 'Refresh health'}</button>
      </div>

      <BackendCapabilityAlert title="Monitoring integration" description={backendCapabilities.monitoring.summary} tone="success" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Monitoring health</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{isLoading ? 'Checking...' : isError ? 'Unavailable' : <StatusValue value={health?.status} />}</p>
              {health?.checkedAt ? <p className="mt-2 text-sm text-[#6B7280]">Checked {new Date(health.checkedAt).toLocaleString()}</p> : null}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE]"><Activity className="w-6 h-6 text-[#2563EB]" /></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Backend base URL</p>
              <p className="mt-2 text-sm font-medium text-[#111827] break-all">{api.config.baseUrl}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E5E7EB]"><Server className="w-6 h-6 text-[#111827]" /></div>
          </div>
        </Card>
      </div>

      {isError ? <Card className="p-6"><EmptyState title="Monitoring health is unavailable" description={error instanceof Error ? error.message : 'The backend returned a monitoring error.'} icon={Activity} /></Card> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DependencyCard name="Redis" status={redis.data} />
        <DependencyCard name="Kafka" status={kafka.data} />
        <DependencyCard name="RabbitMQ" status={rabbitmq.data} />
        <DependencyCard name="Flink jobs" status={flink.data} />
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#111827]">Service map</h2>
        {!services ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(services).map(([name, service]) => (
              <div key={name} className="rounded-lg border border-[#E5E7EB] p-4 text-sm">
                <p className="font-medium text-[#111827]">{name}</p>
                <p className="mt-1"><StatusValue value={String(service?.status ?? 'unknown')} /></p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#111827]">QPS timeseries</h2>
        {metrics.isLoading ? <Skeleton className="h-20 w-full" /> : (metrics.data ?? []).length === 0 ? <p className="text-sm text-[#6B7280]">No metrics data yet.</p> : <pre className="overflow-auto rounded-lg bg-[#111827] p-4 text-xs text-white">{JSON.stringify(metrics.data, null, 2)}</pre>}
      </Card>
    </div>
  );
}
