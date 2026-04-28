import React, { useEffect, useState } from 'react';
import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { api, formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

interface LiveLinkQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: {
    id: string;
    shortUrl: string;
    title: string;
  } | null;
}

export function LiveLinkQrDialog({ open, onOpenChange, link }: LiveLinkQrDialogProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const absoluteUrl = link ? resolveShortUrl(link.shortUrl) : '';

  useEffect(() => {
    if (!open || !link) {
      setObjectUrl(null);
      setError(null);
      return undefined;
    }

    let disposed = false;
    let nextObjectUrl: string | null = null;

    setIsLoading(true);
    setError(null);

    api.getLinkQrCodeBlob(link.id, 512)
      .then((blob) => {
        if (disposed) {
          return;
        }

        nextObjectUrl = URL.createObjectURL(blob);
        setObjectUrl(nextObjectUrl);
      })
      .catch((caught: unknown) => {
        if (disposed) {
          return;
        }

        setError(caught instanceof Error ? caught.message : 'Unable to load QR code.');
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
  }, [open, link]);

  const handleDownload = () => {
    if (!objectUrl) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `qrcode-${link?.id ?? Date.now()}.png`;
    anchor.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>{link?.title ?? 'Live short link'}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="flex h-[306px] w-[306px] items-center justify-center rounded-xl border-2 border-[#E5E7EB] bg-white p-6 shadow-sm">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 text-sm text-[#6B7280]">
                <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
                Loading QR PNG from backend...
              </div>
            ) : error ? (
              <p className="px-4 text-center text-sm text-[#B91C1C]">{error}</p>
            ) : objectUrl ? (
              <img src={objectUrl} alt={`QR code for ${link?.title ?? 'short link'}`} className="h-64 w-64" />
            ) : null}
          </div>

          <div className="w-full rounded-lg bg-[#F9FAFB] px-4 py-3 text-center">
            <code className="text-sm text-[#2563EB] break-all">{link ? formatShortUrl(link.shortUrl) : ''}</code>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2">
            <Button variant="outline" asChild>
              <a href={absoluteUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open short link
              </a>
            </Button>
            <Button onClick={handleDownload} className="bg-[#2563EB] hover:bg-[#1D4ED8]" disabled={!objectUrl}>
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

