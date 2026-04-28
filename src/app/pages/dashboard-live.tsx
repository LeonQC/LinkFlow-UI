import React from 'react';
import { BarChart3, Link2, MousePointerClick, Users } from 'lucide-react';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { useDashboardStats, useHotLinks } from '../hooks/use-dashboard';
import { backendCapabilities, formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

export function DashboardPageLive() {
  const { data: stats, isLoading: statsLoading, isError: statsError, error: statsErrorValue } = useDashboardStats();
  const { data: hotLinks = [], isLoading: hotLinksLoading, isError: hotLinksError, error: hotLinksErrorValue } = useHotLinks('15m', 10);

  const cards = [
    {
      title: 'Total links',
      value: stats?.totalLinks ?? 0,
      icon: Link2,
      accent: '#2563EB',
    },
    {
      title: 'Active links',
      value: stats?.activeLinks ?? 0,
      icon: BarChart3,
      accent: '#10B981',
    },
    {
      title: 'Total clicks',
      value: stats?.totalClicks ?? 0,
      icon: MousePointerClick,
      accent: '#F59E0B',
    },
    {
      title: 'Unique visitors',
      value: stats?.uniqueVisitors ?? 0,
      icon: Users,
      accent: '#111827',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">Live summary and hot-link data from the backend.</p>
      </div>

      <BackendCapabilityAlert
        title="Backend integration"
        description={`${backendCapabilities.dashboard.summary} ${backendCapabilities.hotLinks.summary}`}
        tone="success"
      />

      <BackendCapabilityAlert
        title="Not shown yet"
        description="Risk analytics, monitoring charts, detail analytics, and WebSocket realtime streams are hidden until those backend interfaces are complete."
        tone="warning"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{card.title}</p>
                  {statsLoading ? (
                    <Skeleton className="mt-3 h-8 w-24" />
                  ) : statsError ? (
                    <p className="mt-2 text-sm text-[#B91C1C]">Unavailable</p>
                  ) : (
                    <p className="mt-2 text-2xl font-semibold text-[#111827]">{card.value.toLocaleString()}</p>
                  )}
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${card.accent}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.accent }} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {statsError ? (
        <Card className="p-6">
          <EmptyState
            title="Summary is unavailable"
            description={statsErrorValue instanceof Error ? statsErrorValue.message : 'The backend returned an error for /api/v1/dashboard/summary.'}
            icon={BarChart3}
          />
        </Card>
      ) : null}

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Hot links</h2>
            <p className="text-sm text-[#6B7280] mt-1">Window: 15m · Limit: 10</p>
          </div>
        </div>

        {hotLinksLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-lg border border-[#E5E7EB] p-4 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : hotLinksError ? (
          <EmptyState
            title="Hot links are unavailable"
            description={hotLinksErrorValue instanceof Error ? hotLinksErrorValue.message : 'The backend returned an error for realtime hot links.'}
            icon={Link2}
          />
        ) : hotLinks.length === 0 ? (
          <EmptyState
            title="No hot links yet"
            description="The backend returned an empty hot-link list for the selected realtime window."
            icon={Link2}
          />
        ) : (
          <div className="space-y-3">
            {hotLinks.map((link) => (
              <div key={link.id} className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <h3 className="font-medium text-[#111827] truncate">{link.title}</h3>
                  <p className="mt-1 text-sm text-[#6B7280] break-all">{formatShortUrl(link.shortUrl)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
                  <span>{link.clicks.toLocaleString()} clicks</span>
                  <span>{link.uniqueVisitors.toLocaleString()} visitors</span>
                  <Button variant="outline" asChild>
                    <a href={resolveShortUrl(link.shortUrl)} target="_blank" rel="noreferrer">Open</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
