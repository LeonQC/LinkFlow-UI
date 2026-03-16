import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../components/ui/sheet';
import { toast } from 'sonner';

interface Alert {
  id: string;
  linkId: string;
  shortUrl: string;
  title: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number;
  reason: string[];
  detectedAt: string;
  status: 'pending' | 'approved' | 'blocked' | 'blacklisted';
  clicks: number;
  reporter: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    linkId: 'link-001',
    shortUrl: 'lf.io/sus-deal',
    title: '超低价iPhone促销',
    riskLevel: 'high',
    riskScore: 87,
    reason: ['包含敏感词汇', '目标域名异常', '短时间高频创建'],
    detectedAt: '2026-02-15 14:28:00',
    status: 'pending',
    clicks: 2847,
    reporter: 'AI 风控系统',
  },
  {
    id: '2',
    linkId: 'link-002',
    shortUrl: 'lf.io/lottery',
    title: '免费抽奖赢大奖',
    riskLevel: 'high',
    riskScore: 92,
    reason: ['疑似钓鱼网站', 'SSL证书异常', '多次用户举报'],
    detectedAt: '2026-02-15 13:45:00',
    status: 'pending',
    clicks: 4892,
    reporter: 'AI 风控系统',
  },
  {
    id: '3',
    linkId: 'link-003',
    shortUrl: 'lf.io/promo-test',
    title: '测试促销链接',
    riskLevel: 'medium',
    riskScore: 58,
    reason: ['目标URL变更频繁', '点击来源异常'],
    detectedAt: '2026-02-15 12:15:00',
    status: 'approved',
    clicks: 892,
    reporter: 'AI 风控系统',
  },
  {
    id: '4',
    linkId: 'link-004',
    shortUrl: 'lf.io/game-hack',
    title: '游戏外挂下载',
    riskLevel: 'high',
    riskScore: 95,
    reason: ['违规内容', '恶意软件风险', '黑名单域名'],
    detectedAt: '2026-02-15 11:30:00',
    status: 'blacklisted',
    clicks: 1247,
    reporter: '用户举报',
  },
  {
    id: '5',
    linkId: 'link-005',
    shortUrl: 'lf.io/discount',
    title: '限时折扣优惠',
    riskLevel: 'low',
    riskScore: 32,
    reason: ['流量突增'],
    detectedAt: '2026-02-15 10:00:00',
    status: 'approved',
    clicks: 15847,
    reporter: 'AI 风控系统',
  },
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.shortUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || alert.riskLevel === levelFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'approved' as const } : alert
    ));
    toast.success('已通过审核');
    setDetailOpen(false);
  };

  const handleBlock = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'blocked' as const } : alert
    ));
    toast.warning('已拦截该短链');
    setDetailOpen(false);
  };

  const handleBlacklist = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'blacklisted' as const } : alert
    ));
    toast.error('已加入黑名单');
    setDetailOpen(false);
  };

  const handleViewDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setDetailOpen(true);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
      case 'medium': return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
      case 'low': return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
      default: return { bg: '#F3F4F6', text: '#4B5563', border: '#9CA3AF' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]">待审核</Badge>;
      case 'approved':
        return <Badge className="bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]">已通过</Badge>;
      case 'blocked':
        return <Badge className="bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]">已拦截</Badge>;
      case 'blacklisted':
        return <Badge className="bg-[#1F2937] text-white hover:bg-[#1F2937]">黑名单</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    high: alerts.filter(a => a.riskLevel === 'high').length,
    blocked: alerts.filter(a => a.status === 'blocked' || a.status === 'blacklisted').length,
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827] mb-1">风控告警</h1>
          <p className="text-sm text-[#6B7280]">管理和审核高风险短链</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#2563EB]" />
          <span className="text-sm font-medium text-[#111827]">AI 风控引擎已启用</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">总告警数</p>
              <p className="text-2xl font-semibold text-[#111827]">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">待审核</p>
              <p className="text-2xl font-semibold text-[#111827]">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">高风险</p>
              <p className="text-2xl font-semibold text-[#111827]">{stats.high}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#1F2937] flex items-center justify-center">
              <Ban className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">已拦截</p>
              <p className="text-2xl font-semibold text-[#111827]">{stats.blocked}</p>
            </div>
          </div>
        </Card>
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
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="风险级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部级别</SelectItem>
              <SelectItem value="high">高风险</SelectItem>
              <SelectItem value="medium">中风险</SelectItem>
              <SelectItem value="low">低风险</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="审核状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
              <SelectItem value="approved">已通过</SelectItem>
              <SelectItem value="blocked">已拦截</SelectItem>
              <SelectItem value="blacklisted">黑名单</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
              <TableHead>标题</TableHead>
              <TableHead>短链</TableHead>
              <TableHead>风险级别</TableHead>
              <TableHead>风险评分</TableHead>
              <TableHead>检测时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.map((alert, index) => {
              const levelColor = getRiskLevelColor(alert.riskLevel);
              
              return (
                <motion.tr
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-[#F9FAFB] ${
                    alert.riskLevel === 'high' ? 'bg-[#FEE2E2]/20' : ''
                  }`}
                >
                  <TableCell className="font-medium">{alert.title}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-[#F3F4F6] px-2 py-1 rounded font-mono">
                      {alert.shortUrl}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                      style={{
                        backgroundColor: levelColor.bg,
                        color: levelColor.text,
                        borderColor: `${levelColor.border}40`,
                      }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {alert.riskLevel === 'high' ? '高' : alert.riskLevel === 'medium' ? '中' : '低'}风险
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${alert.riskScore}%`,
                            backgroundColor: alert.riskScore >= 70 ? '#EF4444' : alert.riskScore >= 40 ? '#F59E0B' : '#10B981'
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#111827]">{alert.riskScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#6B7280] text-sm">{alert.detectedAt}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(alert)}
                    >
                      查看详情
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          {selectedAlert && (
            <>
              <SheetHeader>
                <SheetTitle>告警详情</SheetTitle>
                <SheetDescription>
                  检测时间：{selectedAlert.detectedAt}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-medium text-[#111827] mb-3">基本信息</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#6B7280]">标题</label>
                      <p className="text-sm text-[#111827] font-medium">{selectedAlert.title}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[#6B7280]">短链</label>
                      <p className="text-sm text-[#111827] font-mono bg-[#F3F4F6] px-2 py-1 rounded inline-block">
                        {selectedAlert.shortUrl}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-[#6B7280]">报告来源</label>
                      <p className="text-sm text-[#111827]">{selectedAlert.reporter}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Score */}
                <div>
                  <h4 className="text-sm font-medium text-[#111827] mb-3">风险评分</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${selectedAlert.riskScore}%`,
                            backgroundColor: selectedAlert.riskScore >= 70 ? '#EF4444' : selectedAlert.riskScore >= 40 ? '#F59E0B' : '#10B981'
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-[#111827]">{selectedAlert.riskScore}</span>
                  </div>
                </div>

                {/* Risk Reasons */}
                <div>
                  <h4 className="text-sm font-medium text-[#111827] mb-3">风险原因</h4>
                  <div className="space-y-2">
                    {selectedAlert.reason.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-[#FEE2E2] rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#991B1B]">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h4 className="text-sm font-medium text-[#111827] mb-3">访问数据</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#F9FAFB] rounded-lg">
                      <p className="text-xs text-[#6B7280] mb-1">累计点击</p>
                      <p className="text-xl font-semibold text-[#111827]">{selectedAlert.clicks.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-[#F9FAFB] rounded-lg">
                      <p className="text-xs text-[#6B7280] mb-1">当前状态</p>
                      <div className="mt-1">{getStatusBadge(selectedAlert.status)}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedAlert.status === 'pending' && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-[#111827]">审核操作</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        className="flex flex-col items-center gap-1 h-auto py-3 border-[#10B981] text-[#10B981] hover:bg-[#D1FAE5]"
                        onClick={() => handleApprove(selectedAlert.id)}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-xs">通过</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center gap-1 h-auto py-3 border-[#F59E0B] text-[#F59E0B] hover:bg-[#FEF3C7]"
                        onClick={() => handleBlock(selectedAlert.id)}
                      >
                        <XCircle className="w-5 h-5" />
                        <span className="text-xs">拦截</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center gap-1 h-auto py-3 border-[#EF4444] text-[#EF4444] hover:bg-[#FEE2E2]"
                        onClick={() => handleBlacklist(selectedAlert.id)}
                      >
                        <Ban className="w-5 h-5" />
                        <span className="text-xs">黑名单</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
