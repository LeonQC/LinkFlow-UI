import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, BarChart3, Copy, ExternalLink, QrCode, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { LiveLinkQrDialog } from '../components/live-link-qr-dialog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { useDeleteLink, useLink, useLinkAccessLogs, useLinkAnalytics, useUpdateLink, useUpdateLinkStatus } from '../hooks/use-links';
import { backendCapabilities, formatShortUrl, resolveShortUrl, type LinkStatus } from '../services/linkflow-api';

function toDateTimeInput(value?: string) {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 16);
}

export function LinkDetailPageLive() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { data: link, isLoading, isError, error } = useLink(id);
  const updateLink = useUpdateLink();
  const updateStatus = useUpdateLinkStatus();
  const deleteLink = useDeleteLink();
  const analytics = useLinkAnalytics(id);
  const accessLogs = useLinkAccessLogs(id, 1, 50);
  const [qrOpen, setQrOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    originalUrl: '',
    customSlug: '',
    channel: '',
    expiresAt: '',
    status: 'active' as LinkStatus,
  });

  useEffect(() => {
    if (!link) {
      return;
    }

    setForm({
      title: link.title,
      originalUrl: link.originalUrl,
      customSlug: link.backHalf ?? link.slug ?? '',
      channel: link.channel ?? '',
      expiresAt: toDateTimeInput(link.expiresAt),
      status: link.status,
    });
  }, [link]);

  const handleCopy = async () => {
    if (!link) {
      return;
    }

    await navigator.clipboard.writeText(resolveShortUrl(link.shortUrl));
    toast.success('Short URL copied.');
  };

  const handleSave = async () => {
    if (!link) {
      return;
    }

    await updateLink.mutateAsync({
      id: link.id,
      data: {
        title: form.title,
        originalUrl: form.originalUrl,
        customSlug: form.customSlug || undefined,
        channel: form.channel || undefined,
        expiresAt: form.expiresAt || null,
      },
    });
  };

  const handleStatusChange = async () => {
    if (!link) {
      return;
    }

    await updateStatus.mutateAsync({
      id: link.id,
      data: { status: form.status },
    });
  };

  const handleDelete = async () => {
    if (!link) {
      return;
    }

    const confirmed = window.confirm(`Delete ${link.title}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    await deleteLink.mutateAsync(link.id);
    navigate('/links');
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !link) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <EmptyState
          title="Link details are not available"
          description={error instanceof Error ? error.message : 'The backend could not return this link.'}
          action={
            <Button onClick={() => navigate('/links')} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              Back to links
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/links')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-[#111827]">{link.title}</h1>
          <p className="text-sm text-[#6B7280] mt-1">{formatShortUrl(link.shortUrl)}</p>
        </div>
      </div>

      <BackendCapabilityAlert
        title="Backend integration"
        description={`${backendCapabilities.linkDetail.summary} ${backendCapabilities.linkUpdate.summary} ${backendCapabilities.linkAnalytics.summary}`}
        tone="success"
      />

      <Card className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handleCopy()}>
            <Copy className="w-4 h-4 mr-2" />
            Copy short URL
          </Button>
          <Button variant="outline" asChild>
            <a href={resolveShortUrl(link.shortUrl)} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open redirect URL
            </a>
          </Button>
          <Button onClick={() => setQrOpen(true)} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <QrCode className="w-4 h-4 mr-2" />
            Show QR code
          </Button>
          <Button variant="outline" className="border-[#FCA5A5] text-[#B91C1C] hover:text-[#991B1B]" onClick={() => void handleDelete()} disabled={deleteLink.isPending}>
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteLink.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Redirect URL</p>
            <p className="text-sm text-[#111827] break-all">{resolveShortUrl(link.shortUrl)}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Current status</p>
            <p className="text-sm text-[#111827]">{link.status}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Created at</p>
            <p className="text-sm text-[#111827]">{new Date(link.createdAt).toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Counters</p>
            <p className="text-sm text-[#111827]">Clicks {link.clicks.toLocaleString()} · Unique visitors {link.uniqueVisitors.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Edit link</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Changes are saved through PATCH /api/v1/links/{'{link_id}'}.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="detail-title">Title</Label>
            <Input id="detail-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detail-slug">Custom back-half</Label>
            <Input id="detail-slug" value={form.customSlug} onChange={(event) => setForm((current) => ({ ...current, customSlug: event.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="detail-url">Original URL</Label>
            <Input id="detail-url" type="url" value={form.originalUrl} onChange={(event) => setForm((current) => ({ ...current, originalUrl: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detail-channel">Channel</Label>
            <Input id="detail-channel" value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detail-expires">Expires at</Label>
            <Input id="detail-expires" type="datetime-local" value={form.expiresAt} onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))} />
          </div>
        </div>

        <Button onClick={() => void handleSave()} className="bg-[#2563EB] hover:bg-[#1D4ED8]" disabled={updateLink.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateLink.isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Status</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Status changes use PATCH /api/v1/links/{'{link_id}'}/status.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as LinkStatus }))}
            className="h-10 rounded-md border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] sm:w-52"
          >
            {(['active', 'paused', 'expired', 'blocked'] as LinkStatus[]).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <Button variant="outline" onClick={() => void handleStatusChange()} disabled={updateStatus.isPending || form.status === link.status}>
            {updateStatus.isPending ? 'Updating...' : 'Update status'}
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Analytics</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Live link analytics from /api/v1/links/{'{link_id}'}/analytics.</p>
        </div>

        {analytics.summary.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : analytics.summary.isError ? (
          <EmptyState
            title="Analytics summary is unavailable"
            description={analytics.summary.error instanceof Error ? analytics.summary.error.message : 'The backend returned an analytics error.'}
            icon={BarChart3}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[#E5E7EB] p-4">
              <p className="text-sm text-[#6B7280]">Clicks</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{(analytics.summary.data?.clicks ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] p-4">
              <p className="text-sm text-[#6B7280]">Unique visitors</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{(analytics.summary.data?.uniqueVisitors ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-[#E5E7EB] p-4">
              <p className="text-sm text-[#6B7280]">Bot clicks</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{(analytics.summary.data?.botClicks ?? 0).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <h3 className="font-medium text-[#111827]">Timeseries</h3>
            {(analytics.timeseries.data ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-[#6B7280]">No timeseries data yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {(analytics.timeseries.data ?? []).slice(0, 6).map((point) => (
                  <div key={point.bucketStart} className="flex justify-between text-sm text-[#6B7280]">
                    <span>{point.bucketStart ? new Date(point.bucketStart).toLocaleString() : 'Unknown bucket'}</span>
                    <span>{point.clicks} clicks · {point.uniqueVisitors} visitors</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <h3 className="font-medium text-[#111827]">Breakdowns</h3>
            {[
              ['Devices', analytics.devices.data ?? []],
              ['Browsers', analytics.browsers.data ?? []],
              ['Locations', analytics.locations.data ?? []],
            ].map(([label, items]) => (
              <div key={String(label)} className="mt-3">
                <p className="text-sm font-medium text-[#111827]">{String(label)}</p>
                {(items as Array<{ name: string; clicks: number; percentage: number }>).length === 0 ? (
                  <p className="text-sm text-[#6B7280]">No data.</p>
                ) : (
                  <div className="mt-1 space-y-1">
                    {(items as Array<{ name: string; clicks: number; percentage: number }>).slice(0, 4).map((item) => (
                      <div key={`${label}-${item.name}`} className="flex justify-between text-sm text-[#6B7280]">
                        <span>{item.name}</span>
                        <span>{item.clicks} · {item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Access logs</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Empty logs are expected until redirect events are recorded.</p>
        </div>
        {accessLogs.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : accessLogs.isError ? (
          <EmptyState
            title="Access logs are unavailable"
            description={accessLogs.error instanceof Error ? accessLogs.error.message : 'The backend returned an access log error.'}
            icon={BarChart3}
          />
        ) : (accessLogs.data?.items ?? []).length === 0 ? (
          <p className="rounded-lg bg-[#F9FAFB] p-4 text-sm text-[#6B7280]">No access logs yet.</p>
        ) : (
          <div className="space-y-2">
            {(accessLogs.data?.items ?? []).slice(0, 8).map((log) => (
              <div key={log.eventId} className="rounded-lg border border-[#E5E7EB] p-3 text-sm text-[#6B7280]">
                {log.occurredAt ? new Date(log.occurredAt).toLocaleString() : 'Unknown time'} · {log.ip ?? 'unknown IP'} · {log.browser ?? 'unknown browser'}
              </div>
            ))}
          </div>
        )}
      </Card>

      <LiveLinkQrDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        link={{ id: link.id, shortUrl: link.shortUrl, title: link.title }}
      />
    </div>
  );
}
