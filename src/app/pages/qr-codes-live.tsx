import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink, QrCode, Search } from 'lucide-react';
import { toast } from 'sonner';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useLinks } from '../hooks/use-links';
import { backendCapabilities, formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

export function QRCodesPageLive() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: links = [] } = useLinks();

  const filteredLinks = useMemo(
    () =>
      links.filter((link) => {
        const query = searchQuery.toLowerCase();
        return (
          link.title.toLowerCase().includes(query) ||
          link.originalUrl.toLowerCase().includes(query) ||
          formatShortUrl(link.shortUrl).toLowerCase().includes(query)
        );
      }),
    [links, searchQuery],
  );

  const handleCopy = async (shortUrl: string) => {
    await navigator.clipboard.writeText(resolveShortUrl(shortUrl));
    toast.success('Short URL copied.');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">QR Codes</h1>
        <p className="text-sm text-[#6B7280] mt-1">Generate QR codes only from live links created through the backend.</p>
      </div>

      <BackendCapabilityAlert
        title="Current backend behavior"
        description={backendCapabilities.linksList.summary}
        tone="warning"
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

      {filteredLinks.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title="No live QR codes yet"
            description="Create a short link first. QR codes are generated from the real redirect URLs returned by the backend."
            icon={QrCode}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="p-6 space-y-4">
              <div className="flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white p-6">
                <QRCodeSVG value={resolveShortUrl(link.shortUrl)} size={180} level="H" includeMargin={false} />
              </div>

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
