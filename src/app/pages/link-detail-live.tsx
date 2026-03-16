import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Copy, ExternalLink, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { LiveLinkQrDialog } from '../components/live-link-qr-dialog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { useLink } from '../hooks/use-links';
import { backendCapabilities, formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

export function LinkDetailPageLive() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { data: link, isLoading, isError } = useLink(id);
  const [qrOpen, setQrOpen] = useState(false);

  const handleCopy = async () => {
    if (!link) {
      return;
    }

    await navigator.clipboard.writeText(resolveShortUrl(link.shortUrl));
    toast.success('Short URL copied.');
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
          description="The current backend snapshot does not expose detail APIs. You can only inspect links created in this browser session."
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
        title="Current backend scope"
        description={`${backendCapabilities.linkDetail.summary} Analytics, click logs, risk scores, and edit/delete actions are intentionally hidden until the backend exposes them.`}
        tone="warning"
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Original URL</p>
            <p className="text-sm text-[#111827] break-all">{link.originalUrl}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Redirect URL</p>
            <p className="text-sm text-[#111827] break-all">{resolveShortUrl(link.shortUrl)}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Created at</p>
            <p className="text-sm text-[#111827]">{new Date(link.createdAt).toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-sm text-[#6B7280] mb-2">Known backend fields</p>
            <p className="text-sm text-[#111827]">Slug: {link.slug ?? 'N/A'}</p>
          </div>
        </div>
      </Card>

      <LiveLinkQrDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        link={{ shortUrl: link.shortUrl, title: link.title }}
      />
    </div>
  );
}
