import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Search, 
  Filter,
  Download,
  Copy,
  ExternalLink,
  Grid3x3,
  List,
  Share2,
  Trash2,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { StatusTag } from '../components/status-tag';
import { EmptyState } from '../components/empty-state';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';
import { useLinks } from '../hooks/use-links';
import { Skeleton } from '../components/ui/skeleton';
import { Link } from '../services/linkflow-api';

type ViewMode = 'grid' | 'list';

export function QRCodesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // 使用 React Query 获取数据
  const { data: qrCodes, isLoading, isError, refetch, isFetching } = useLinks();

  const filteredQRCodes = qrCodes?.filter(qr => {
    const matchesSearch = 
      qr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.shortUrl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || qr.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDownloadQR = (qrCode: Link, svgElement: SVGSVGElement) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
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
            link.download = `qrcode-${qrCode.shortUrl.replace('/', '-')}.png`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('二维码已下载');
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyQRImage = async (svgElement: SVGSVGElement) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
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

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast.success('链接已复制');
  };

  const handleDownloadAll = () => {
    toast.success(`正在准备下载 ${filteredQRCodes.length} 个二维码...`);
    // In a real app, this would create a zip file with all QR codes
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">二维码管理</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              管理和下载所有短链的二维码
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadAll}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              批量下载
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                placeholder="搜索标题或短链..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">正常</SelectItem>
                <SelectItem value="paused">暂停</SelectItem>
                <SelectItem value="expired">已过期</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 border border-[#E5E7EB] rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'gap-2',
                  viewMode === 'grid' && 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                )}
              >
                <Grid3x3 className="w-4 h-4" />
                网格
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  'gap-2',
                  viewMode === 'list' && 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                )}
              >
                <List className="w-4 h-4" />
                列表
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-[#6B7280]">总二维码数</div>
            <div className="text-2xl font-semibold text-[#111827] mt-1">
              {qrCodes?.length || 0}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-[#6B7280]">正常使用</div>
            <div className="text-2xl font-semibold text-[#10B981] mt-1">
              {qrCodes?.filter(q => q.status === 'active').length || 0}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-[#6B7280]">总扫描次数</div>
            <div className="text-2xl font-semibold text-[#2563EB] mt-1">
              {qrCodes?.reduce((sum, q) => sum + q.clicks, 0).toLocaleString() || 0}
            </div>
          </Card>
        </div>

        {/* QR Codes Grid/List */}
        {filteredQRCodes.length === 0 ? (
          <EmptyState
            title="没有找到二维码"
            description="请尝试调整搜索条件"
            icon={Search}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qrCode) => (
              <QRCodeCard
                key={qrCode.id}
                qrCode={qrCode}
                onDownload={handleDownloadQR}
                onCopyImage={handleCopyQRImage}
                onCopyUrl={handleCopyUrl}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQRCodes.map((qrCode) => (
              <QRCodeListItem
                key={qrCode.id}
                qrCode={qrCode}
                onDownload={handleDownloadQR}
                onCopyImage={handleCopyQRImage}
                onCopyUrl={handleCopyUrl}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface QRCodeCardProps {
  qrCode: Link;
  onDownload: (qrCode: Link, svg: SVGSVGElement) => void;
  onCopyImage: (svg: SVGSVGElement) => void;
  onCopyUrl: (url: string) => void;
}

function QRCodeCard({ qrCode, onDownload, onCopyImage, onCopyUrl }: QRCodeCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) onDownload(qrCode, svg);
  };

  const handleCopyImage = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) onCopyImage(svg);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
        {/* QR Code */}
        <div 
          ref={qrRef}
          className="flex items-center justify-center bg-white p-4 rounded-lg border-2 border-[#E5E7EB]"
        >
          <QRCodeSVG
            value={`https://${qrCode.shortUrl}`}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-[#111827] line-clamp-1">
              {qrCode.title}
            </h3>
            <StatusTag status={qrCode.status} />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <code className="flex-1 font-mono text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded truncate">
              {qrCode.shortUrl}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyUrl(qrCode.shortUrl)}
              className="h-7 w-7 p-0"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>{qrCode.clicks.toLocaleString()} 次扫描</span>
            <span>{qrCode.createdAt}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyImage}
            className="flex-1 gap-2"
          >
            <Copy className="w-4 h-4" />
            复制
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            className="flex-1 gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]"
          >
            <Download className="w-4 h-4" />
            下载
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-9 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`https://${qrCode.shortUrl}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                打开链接
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}

function QRCodeListItem({ qrCode, onDownload, onCopyImage, onCopyUrl }: QRCodeCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) onDownload(qrCode, svg);
  };

  const handleCopyImage = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) onCopyImage(svg);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="p-4">
        <div className="flex items-center gap-6">
          {/* QR Code */}
          <div 
            ref={qrRef}
            className="flex-shrink-0 bg-white p-3 rounded-lg border-2 border-[#E5E7EB]"
          >
            <QRCodeSVG
              value={`https://${qrCode.shortUrl}`}
              size={100}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-[#111827]">
                {qrCode.title}
              </h3>
              <StatusTag status={qrCode.status} />
            </div>
            
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded">
                {qrCode.shortUrl}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopyUrl(qrCode.shortUrl)}
                className="h-7 w-7 p-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
              <span>{qrCode.clicks.toLocaleString()} 次扫描</span>
              <span>创建于 {qrCode.createdAt}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyImage}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              复制
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <Download className="w-4 h-4" />
              下载
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-9 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open(`https://${qrCode.shortUrl}`, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  打开链接
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
