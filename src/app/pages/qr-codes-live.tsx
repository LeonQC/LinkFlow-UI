import React, { useEffect, useState } from 'react';
import { Copy, ExternalLink, Loader2, QrCode, Search } from 'lucide-react';
import { toast } from 'sonner';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useLinks } from '../hooks/use-links';
import { api, backendCapabilities, formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

function QrCodeImage({ linkId, title }: { linkId: string; title: string }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let nextObjectUrl: string | null = null;

    setIsLoading(true);
    setError(null);

    api.getLinkQrCodeBlob(linkId, 256)
      .then((blob) => {
        if (disposed) {
          return;
        }

        nextObjectUrl = URL.createObjectURL(blob);
        setObjectUrl(nextObjectUrl);
      })
      .catch((caught: unknown) => {
        if (!disposed) {
          setError(caught instanceof Error ? caught.message : 'Unable to load QR code.');
        }
      })
      .finally(() => {
        if (!disposed) {
          setIsLoading(false);
        }
      });

    return () => {
      disposed = true;
      if (nextObjectUrl) {
        URL.revokeObjectURL(nextObjectUrl);
      }
    };
  }, [linkId]);

  return (
    <div className="flex h-[230px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white p-6">
      {isLoading ? (
        <div className="flex flex-col items-center gap-3 text-sm text-[#6B7280]">
          <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
          Loading PNG...
        </div>
      ) : error ? (
        <p className="text-center text-sm text-[#B91C1C]">{error}</p>
      ) : objectUrl ? (
        <img src={objectUrl} alt={`QR code for ${title}`} className="h-44 w-44" />
      ) : null}
    </div>
  );
}

export function QRCodesPageLive() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: linkResult, isLoading, isError, error } = useLinks({ page: 1, size: 20, search: searchQuery, sort: 'created_at,desc' });
  const links = linkResult?.items ?? [];

  const handleCopy = async (shortUrl: string) => {
    await navigator.clipboard.writeText(resolveShortUrl(shortUrl));
    toast.success('Short URL copied.');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">QR Codes</h1>
        <p className="text-sm text-[#6B7280] mt-1">QR PNG files are loaded from protected backend endpoints.</p>
      </div>

      <BackendCapabilityAlert
        title="Backend integration"
        description={backendCapabilities.linkQrCode.summary}
        tone="success"
      />

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search QR code entries"
            className="pl-10"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-6 space-y-4">
              <div className="h-[230px] rounded-xl bg-[#F3F4F6]" />
              <div className="h-5 w-40 rounded bg-[#F3F4F6]" />
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="p-6">
          <EmptyState
            title="QR code entries are unavailable"
            description={error instanceof Error ? error.message : 'The backend returned an error while loading links.'}
            icon={QrCode}
          />
        </Card>
      ) : links.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title="No QR codes yet"
            description="Create a short link first, then the backend QR endpoint can return a protected PNG."
            icon={QrCode}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {links.map((link) => (
            <Card key={link.id} className="p-6 space-y-4">
              <QrCodeImage linkId={link.id} title={link.title} />

              <div>
                <h2 className="font-semibold text-[#111827] truncate">{link.title}</h2>
                <p className="text-sm text-[#6B7280] mt-1 break-all">{formatShortUrl(link.shortUrl)}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => void handleCopy(link.shortUrl)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
                  <a href={resolveShortUrl(link.shortUrl)} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
