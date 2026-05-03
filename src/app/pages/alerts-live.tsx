import React, { useState } from 'react';
import { ShieldAlert, Search } from 'lucide-react';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { useAlerts, useReviewAlert } from '../hooks/use-alerts';
import { backendCapabilities } from '../services/linkflow-api';

export function AlertsPageLive() {
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState<'all' | 'unknown' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [status, setStatus] = useState<'all' | 'pending' | 'approved' | 'blocked' | 'blacklisted'>('all');
  const { data, isLoading, isError, error } = useAlerts({ page: 1, size: 20, riskLevel, status, search });
  const reviewAlert = useReviewAlert();
  const alerts = data?.items ?? [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Risk Alerts</h1>
        <p className="text-sm text-[#6B7280] mt-1">Live risk alert queue from the backend.</p>
      </div>

      <BackendCapabilityAlert title="Backend integration" description={backendCapabilities.alerts.summary} tone="success" />

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search alerts" className="pl-10" />
          </div>
          <select value={riskLevel} onChange={(event) => setRiskLevel(event.target.value as typeof riskLevel)} className="h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827]">
            {['all', 'unknown', 'low', 'medium', 'high', 'critical'].map((option) => <option key={option} value={option}>{option === 'all' ? 'All risk levels' : option}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827]">
            {['all', 'pending', 'approved', 'blocked', 'blacklisted'].map((option) => <option key={option} value={option}>{option === 'all' ? 'All statuses' : option}</option>)}
          </select>
        </div>
      </Card>

      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, index) => <Skeleton key={index} className="h-24 w-full" />)}</div>
        ) : isError ? (
          <EmptyState title="Risk alerts are unavailable" description={error instanceof Error ? error.message : 'The backend returned a risk alert error.'} icon={ShieldAlert} />
        ) : alerts.length === 0 ? (
          <EmptyState title="No risk alerts" description="The backend returned an empty alert queue. That is a valid state." icon={ShieldAlert} />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="font-semibold text-[#111827]">{alert.title}</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">{alert.riskLevel} · score {alert.riskScore} · {alert.status}</p>
                    <p className="mt-2 text-sm text-[#6B7280]">{alert.reason.length > 0 ? alert.reason.join(', ') : 'No reasons reported.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['approved', 'blocked', 'blacklisted'] as const).map((action) => (
                      <Button key={action} variant="outline" onClick={() => reviewAlert.mutate({ id: alert.id, status: action })} disabled={reviewAlert.isPending}>{action}</Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
