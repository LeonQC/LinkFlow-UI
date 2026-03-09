import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Copy,
  Edit,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { StatusTag, StatusType } from '../components/status-tag';
import { EmptyState } from '../components/empty-state';
import { LinkCard } from '../components/link-card';
import { QRCodeDialog } from '../components/qr-code-dialog';
import { toast } from 'sonner';

interface LinkData {
  id: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  clicks: number;
  status: StatusType;
  createdAt: string;
  expiresAt?: string;
}

const mockLinks: LinkData[] = [
  {
    id: '1',
    shortUrl: 'lf.io/promo2026',
    originalUrl: 'https://example.com/spring-festival-promotion-2026',
    title: '春节促销活动',
    clicks: 45892,
    status: 'active',
    createdAt: '2026-01-15',
    expiresAt: '2026-02-28',
  },
  {
    id: '2',
    shortUrl: 'lf.io/newprod',
    originalUrl: 'https://example.com/new-product-launch',
    title: '新品发布会',
    clicks: 38471,
    status: 'active',
    createdAt: '2026-02-01',
  },
  {
    id: '3',
    shortUrl: 'lf.io/survey',
    originalUrl: 'https://example.com/user-survey-q1',
    title: '用户调研问卷',
    clicks: 29384,
    status: 'active',
    createdAt: '2026-02-10',
  },
  {
    id: '4',
    shortUrl: 'lf.io/blog2026',
    originalUrl: 'https://example.com/tech-blog-2026',
    title: '技术博客文章',
    clicks: 21847,
    status: 'paused',
    createdAt: '2026-01-20',
  },
  {
    id: '5',
    shortUrl: 'lf.io/event',
    originalUrl: 'https://example.com/offline-event-registration',
    title: '线下活动报名',
    clicks: 18392,
    status: 'active',
    createdAt: '2026-02-05',
    expiresAt: '2026-03-15',
  },
];

export function LinksPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkData[]>(mockLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [newLink, setNewLink] = useState({
    originalUrl: '',
    customSlug: '',
    title: '',
    expiresAt: '',
  });

  const filteredLinks = links.filter(link => {
    const matchesSearch = 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLink = () => {
    if (!newLink.originalUrl || !newLink.title) {
      toast.error('请填写必填字段');
      return;
    }

    const slug = newLink.customSlug || Math.random().toString(36).substring(7);
    const newLinkData: LinkData = {
      id: Date.now().toString(),
      shortUrl: `lf.io/${slug}`,
      originalUrl: newLink.originalUrl,
      title: newLink.title,
      clicks: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: newLink.expiresAt || undefined,
    };

    setLinks([newLinkData, ...links]);
    setCreateDialogOpen(false);
    setNewLink({ originalUrl: '', customSlug: '', title: '', expiresAt: '' });
    toast.success('短链创建成功！');
  };

  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    toast.success('短链已复制到剪贴板');
  };

  const handleToggleStatus = (id: string) => {
    setLinks(links.map(link => 
      link.id === id 
        ? { ...link, status: link.status === 'active' ? 'paused' : 'active' as StatusType }
        : link
    ));
    toast.success('状态已更新');
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success('短链已删除');
  };

  const handleShowQR = (link: LinkData) => {
    setSelectedLink(link);
    setQrDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#111827] mb-1">短链管理</h1>
          <p className="text-sm text-[#6B7280]">创建、管理和监控您的短链</p>
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          创建短链
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <Input
              placeholder="搜索短链或标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">活跃</SelectItem>
              <SelectItem value="paused">暂停</SelectItem>
              <SelectItem value="blocked">已拦截</SelectItem>
              <SelectItem value="expired">已过期</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {filteredLinks.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
                    <TableHead>标题</TableHead>
                    <TableHead>短链</TableHead>
                    <TableHead>原始链接</TableHead>
                    <TableHead>点击量</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link, index) => (
                    <motion.tr
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-[#F9FAFB] cursor-pointer"
                      onClick={() => navigate(`/links/${link.id}`)}
                    >
                      <TableCell className="font-medium">{link.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-[#F3F4F6] px-2 py-1 rounded font-mono">
                            {link.shortUrl}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(link.shortUrl);
                            }}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-[#6B7280] text-sm">
                          {link.originalUrl}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{link.clicks.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusTag status={link.status} />
                      </TableCell>
                      <TableCell className="text-[#6B7280]">{link.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/links/${link.id}`)}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyLink(link.shortUrl)}>
                              <Copy className="w-4 h-4 mr-2" />
                              复制链接
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(link.id)}>
                              {link.status === 'active' ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  暂停
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  启用
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[#EF4444]" onClick={() => handleDeleteLink(link.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShowQR(link)}>
                              <QrCode className="w-4 h-4 mr-2" />
                              显示二维码
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-3">
              {filteredLinks.map((link, index) => (
                <LinkCard
                  key={link.id}
                  id={link.id}
                  shortUrl={link.shortUrl}
                  title={link.title}
                  clicks={link.clicks}
                  status={link.status}
                  createdAt={link.createdAt}
                  onClick={() => navigate(`/links/${link.id}`)}
                  onCopy={() => handleCopyLink(link.shortUrl)}
                  onToggleStatus={() => handleToggleStatus(link.id)}
                  onDelete={() => handleDeleteLink(link.id)}
                  onShowQR={() => handleShowQR(link)}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="暂无短链"
            description="创建您的第一个短链开始使用"
            icon="link"
            action={
              <Button onClick={() => setCreateDialogOpen(true)} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                <Plus className="w-4 h-4 mr-2" />
                创建短链
              </Button>
            }
          />
        )}
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>创建短链</DialogTitle>
            <DialogDescription>
              填写下方信息创建一个新的短链
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input
                id="title"
                placeholder="例如：春节促销活动"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalUrl">原始链接 *</Label>
              <Input
                id="originalUrl"
                placeholder="https://example.com/your-long-url"
                value={newLink.originalUrl}
                onChange={(e) => setNewLink({ ...newLink, originalUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customSlug">自定义短链（可选）</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280] whitespace-nowrap">lf.io/</span>
                <Input
                  id="customSlug"
                  placeholder="custom-name"
                  value={newLink.customSlug}
                  onChange={(e) => setNewLink({ ...newLink, customSlug: e.target.value })}
                />
              </div>
              <p className="text-xs text-[#6B7280]">留空则自动生成</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">过期时间（可选）</Label>
              <Input
                id="expiresAt"
                type="date"
                value={newLink.expiresAt}
                onChange={(e) => setNewLink({ ...newLink, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateLink} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <QRCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        link={selectedLink}
      />
    </div>
  );
}