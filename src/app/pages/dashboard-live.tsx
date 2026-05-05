import React, { useEffect, useState } from 'react';
import { Activity, BarChart3, Link2, MousePointerClick, Radio, Users } from 'lucide-react';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import {
  useDashboardChannels,
  useDashboardLocations,
  useDashboardStats,
  useDashboardTrends,
  useHotLinks,
  useRealtimeOverview,
} from '../hooks/use-dashboard';
import { api, backendCapabilities, formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

function RealtimeSocketStatus() {
  const [status, setStatus] = useState('connecting');
  const [message, setMessage] = useState('Requesting realtime token...');

  useEffect(() => {
    let socket: WebSocket | null = null;
    let disposed = false;

    api.getWsToken()
      .then((token) => {
        if (disposed) return;
        socket = new WebSocket(`${api.config.wsBaseUrl}/ws/realtime?token=${encodeURIComponent(token.token)}`);
        socket.onopen = () => {
          setStatus('connected');
          setMessage('Socket opened. Waiting for events...');
        };
        socket.onmessage = (event) => {
          setStatus('connected');
          setMessage(event.data);
        };
        socket.onerror = () => {
          setStatus('error');
          setMessage('Realtime socket reported an error.');
        };
        socket.onclose = () => {
          if (!disposed) {
            setStatus('closed');
            setMessage('Realtime socket closed.');
          }
        };
      })
      .catch((error: unknown) => {
        if (!disposed) {
          setStatus('error');
          setMessage(error instanceof Error ? error.message : 'Unable to request realtime token.');
        }
      });

    return () => {
      disposed = true;
      socket?.close();
    };
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#6B7280]">Realtime WebSocket</p>
          <p className="mt-2 text-lg font-semibold text-[#111827]">{status}</p>
          <p className="mt-2 break-all text-xs text-[#6B7280]">{message}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE]">
          <Radio className="h-6 w-6 text-[#2563EB]" />
        </div>
      </div>
    </Card>
  );
}

export function DashboardPageLive() {
  const { data: stats, isLoading: statsLoading, isError: statsError, error: statsErrorValue } = useDashboardStats();
  const { data: overview, isLoading: overviewLoading } = useRealtimeOverview('15m');
  const { data: hotLinks = [], isLoading: hotLinksLoading, isError: hotLinksError, error: hotLinksErrorValue } = useHotLinks('15m', 10);
  const { data: trends = [], isLoading: trendsLoading, isError: trendsError } = useDashboardTrends('1h');
  const { data: channels = [], isLoading: channelsLoading } = useDashboardChannels();
  const { data: locations = [], isLoading: locationsLoading } = useDashboardLocations();

  const cards = [
    { title: 'Total links', value: stats?.totalLinks ?? 0, icon: Link2, accent: '#2563EB' },
    { title: 'Active links', value: stats?.activeLinks ?? 0, icon: BarChart3, accent: '#10B981' },
    { title: 'Total clicks', value: stats?.totalClicks ?? 0, icon: MousePointerClick, accent: '#F59E0B' },
    { title: 'Unique visitors', value: stats?.uniqueVisitors ?? 0, icon: Users, accent: '#111827' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">Live summary, analytics, and realtime state from the backend.</p>
      </div>

      <BackendCapabilityAlert
        title="Backend integration"
        description={`${backendCapabilities.dashboard.summary} ${backendCapabilities.realtimeOverview.summary} ${backendCapabilities.websocket.summary}`}
        tone="success"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{card.title}</p>
                  {statsLoading ? <Skeleton className="mt-3 h-8 w-24" /> : statsError ? <p className="mt-2 text-sm text-[#B91C1C]">Unavailable</p> : <p className="mt-2 text-2xl font-semibold text-[#111827]">{card.value.toLocaleString()}</p>}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${card.accent}15` }}>
                  <Icon className="w-6 h-6" style={{ color: card.accent }} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {statsError ? (
        <Card className="p-6">
          <EmptyState title="Summary is unavailable" description={statsErrorValue instanceof Error ? statsErrorValue.message : 'The backend returned an error for /api/v1/dashboard/summary.'} icon={BarChart3} />
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Realtime overview</p>
              {overviewLoading ? (
                <Skeleton className="mt-3 h-16 w-full" />
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <span>{overview?.clicks ?? 0} clicks</span>
                  <span>{overview?.uniqueVisitors ?? 0} visitors</span>
                  <span>{overview?.eventsPerSecond ?? 0} eps</span>
                </div>
              )}
            </div>
            <Activity className="h-6 w-6 text-[#2563EB]" />
          </div>
        </Card>
        <RealtimeSocketStatus />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 space-y-3 lg:col-span-1">
          <h2 className="text-lg font-semibold text-[#111827]">Trends</h2>
          {trendsLoading ? <Skeleton className="h-32 w-full" /> : trendsError ? <p className="text-sm text-[#B91C1C]">Trends unavailable.</p> : trends.length === 0 ? <p className="text-sm text-[#6B7280]">No trend data yet.</p> : trends.slice(0, 8).map((point) => (
            <div key={point.bucketStart} className="flex justify-between text-sm text-[#6B7280]">
              <span>{point.bucketStart ? new Date(point.bucketStart).toLocaleString() : 'Unknown bucket'}</span>
              <span>{point.clicks} clicks</span>
            </div>
          ))}
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-lg font-semibold text-[#111827]">Channels</h2>
          {channelsLoading ? <Skeleton className="h-32 w-full" /> : channels.length === 0 ? <p className="text-sm text-[#6B7280]">No channel breakdown yet.</p> : channels.map((item) => (
            <div key={item.name} className="flex justify-between text-sm text-[#6B7280]"><span>{item.name}</span><span>{item.links} links · {item.clicks} clicks</span></div>
          ))}
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-lg font-semibold text-[#111827]">Locations</h2>
          {locationsLoading ? <Skeleton className="h-32 w-full" /> : locations.length === 0 ? <p className="text-sm text-[#6B7280]">No location breakdown yet.</p> : locations.map((item) => (
            <div key={item.name} className="flex justify-between text-sm text-[#6B7280]"><span>{item.name}</span><span>{item.links} links · {item.clicks} clicks</span></div>
          ))}
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Hot links</h2>
          <p className="text-sm text-[#6B7280] mt-1">Window: 15m · Limit: 10</p>
        </div>

        {hotLinksLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, index) => <div key={index} className="rounded-lg border border-[#E5E7EB] p-4 space-y-3"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-full" /></div>)}</div>
        ) : hotLinksError ? (
          <EmptyState title="Hot links are unavailable" description={hotLinksErrorValue instanceof Error ? hotLinksErrorValue.message : 'The backend returned an error for realtime hot links.'} icon={Link2} />
        ) : hotLinks.length === 0 ? (
          <EmptyState title="No hot links yet" description="The backend returned an empty hot-link list for the selected realtime window." icon={Link2} />
        ) : (
          <div className="space-y-3">
            {hotLinks.map((link) => (
              <div key={link.id} className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0"><h3 className="font-medium text-[#111827] truncate">{link.title}</h3><p className="mt-1 text-sm text-[#6B7280] break-all">{formatShortUrl(link.shortUrl)}</p></div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]"><span>{link.clicks.toLocaleString()} clicks</span><span>{link.uniqueVisitors.toLocaleString()} visitors</span><Button variant="outline" asChild><a href={resolveShortUrl(link.shortUrl)} target="_blank" rel="noreferrer">Open</a></Button></div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
