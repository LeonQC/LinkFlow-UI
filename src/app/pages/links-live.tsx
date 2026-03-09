import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Copy, Link2, Plus, QrCode, Search } from 'lucide-react';
import { toast } from 'sonner';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { LiveLinkQrDialog } from '../components/live-link-qr-dialog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { useCreateLink, useLinks } from '../hooks/use-links';
import { backendCapabilities, formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

export function LinksPageLive() {
  const navigate = useNavigate();
  const { data: links = [], isLoading } = useLinks();
  const createLink = useCreateLink();
  const [searchQuery, setSearchQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [form, setForm] = useState({
    originalUrl: '',
    title: '',
  });

  const selectedLink = links.find((link) => link.id === selectedLinkId) ?? null;

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

  const handleCreate = async () => {
    if (!form.originalUrl.trim()) {
      toast.error('Original URL is required.');
      return;
    }

    await createLink.mutateAsync({
      originalUrl: form.originalUrl.trim(),
      title: form.title.trim(),
    });

    setForm({ originalUrl: '', title: '' });
    setCreateOpen(false);
  };

  const handleCopy = async (shortUrl: string) => {
    await navigator.clipboard.writeText(resolveShortUrl(shortUrl));
    toast.success('Short URL copied.');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Short Links</h1>
          <p className="text-sm text-[#6B7280] mt-1">Create real short URLs through the current backend.</p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
          <Plus className="w-4 h-4 mr-2" />
          New Short URL
        </Button>
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
            placeholder="Search current-session links"
            className="pl-10"
          />
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-lg border border-[#E5E7EB] p-4 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-36" />
              </div>
            ))}
          </div>
        ) : filteredLinks.length === 0 ? (
          <EmptyState
            title="No live short links yet"
            description="Create one with the real backend. This page only shows links created from this browser session because list APIs are not ready."
            icon={Link2}
            action={
              <Button onClick={() => setCreateOpen(true)} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                <Plus className="w-4 h-4 mr-2" />
                Create first link
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredLinks.map((link) => (
              <div key={link.id} className="rounded-xl border border-[#E5E7EB] p-4 md:p-5 bg-white">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/links/${link.id}`)}
                      className="text-left text-base font-semibold text-[#111827] hover:text-[#2563EB]"
                    >
                      {link.title}
                    </button>
                    <p className="mt-1 text-sm text-[#6B7280] break-all">{link.originalUrl}</p>
                    <code className="inline-flex mt-3 rounded-md bg-[#F3F4F6] px-3 py-1.5 text-sm text-[#2563EB]">
                      {formatShortUrl(link.shortUrl)}
                    </code>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => void handleCopy(link.shortUrl)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedLinkId(link.id);
                        setQrOpen(true);
                      }}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                    <Button onClick={() => navigate(`/links/${link.id}`)} className="bg-[#111827] hover:bg-[#0F172A]">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-[#6B7280]">
                  <span>Created at {new Date(link.createdAt).toLocaleString()}</span>
                  <span>Clicks unavailable until analytics endpoints are implemented.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create short URL</DialogTitle>
            <DialogDescription>
              This form calls the real backend `POST /api/short-urls`. Title is stored in the frontend session until list APIs exist.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="link-title">Title</Label>
              <Input
                id="link-title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Optional display title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original-url">Original URL</Label>
              <Input
                id="original-url"
                type="url"
                value={form.originalUrl}
                onChange={(event) => setForm((current) => ({ ...current, originalUrl: event.target.value }))}
                placeholder="https://example.com/page"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} className="bg-[#2563EB] hover:bg-[#1D4ED8]" disabled={createLink.isPending}>
              {createLink.isPending ? 'Creating...' : 'Create with Backend'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LiveLinkQrDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        link={selectedLink ? { shortUrl: selectedLink.shortUrl, title: selectedLink.title } : null}
      />
    </div>
  );
}
