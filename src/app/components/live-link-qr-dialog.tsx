import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { formatShortUrl, resolveShortUrl } from '../services/linkflow-api';

interface LiveLinkQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: {
    shortUrl: string;
    title: string;
  } | null;
}

export function LiveLinkQrDialog({ open, onOpenChange, link }: LiveLinkQrDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const absoluteUrl = link ? resolveShortUrl(link.shortUrl) : '';

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) {
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    canvas.width = 1024;
    canvas.height = 1024;

    image.onload = () => {
      if (!context) {
        return;
      }

      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = `qrcode-${Date.now()}.png`;
        anchor.click();
        URL.revokeObjectURL(objectUrl);
      });
    };

    image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>{link?.title ?? 'Live short link'}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-6">
          <div ref={qrRef} className="bg-white p-6 rounded-xl border-2 border-[#E5E7EB] shadow-sm">
            <QRCodeSVG value={absoluteUrl} size={256} level="H" includeMargin={false} />
          </div>

          <div className="w-full rounded-lg bg-[#F9FAFB] px-4 py-3 text-center">
            <code className="text-sm text-[#2563EB]">{link ? formatShortUrl(link.shortUrl) : ''}</code>
          </div>

          <Button onClick={handleDownload} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
