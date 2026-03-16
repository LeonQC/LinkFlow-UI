import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: {
    shortUrl: string;
    title: string;
  } | null;
}

export function QRCodeDialog({ open, onOpenChange, link }: QRCodeDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1024;
    canvas.height = 1024;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('二维码已下载');
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyImage = async () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = async () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              toast.success('二维码已复制到剪贴板');
            } catch (err) {
              toast.error('复制失败，请手动下载');
            }
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>二维码</DialogTitle>
          <DialogDescription>
            {link?.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* QR Code */}
          <div 
            ref={qrRef}
            className="bg-white p-6 rounded-xl border-2 border-[#E5E7EB] shadow-sm"
          >
            <QRCodeSVG
              value={`https://${link?.shortUrl}`}
              size={256}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: '',
                height: 0,
                width: 0,
                excavate: true,
              }}
            />
          </div>

          {/* URL Display */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 text-sm text-[#6B7280] bg-[#F9FAFB] px-4 py-3 rounded-lg">
              <code className="font-mono text-[#2563EB]">{link?.shortUrl}</code>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleCopyImage}
              variant="outline"
              className="flex-1"
            >
              复制图片
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <Download className="w-4 h-4 mr-2" />
              下载
            </Button>
          </div>

          {/* Tips */}
          <div className="text-xs text-[#9CA3AF] text-center space-y-1">
            <p>扫描二维码即可访问此短链</p>
            <p>下载的图片为 1024x1024 PNG 格式</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}