import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Calendar,
  MousePointerClick,
  Users,
  TrendingUp,
  MapPin,
  Smartphone,
  Chrome,
  Shield,
  AlertTriangle,
  CheckCircle,
  QrCode,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { StatusTag } from '../components/status-tag';
import { Badge } from '../components/ui/badge';
import { QRCodeDialog } from '../components/qr-code-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { toast } from 'sonner';

const hourlyData = [
  { hour: '00', clicks: 120 },
  { hour: '03', clicks: 45 },
  { hour: '06', clicks: 89 },
  { hour: '09', clicks: 342 },
  { hour: '12', clicks: 567 },
  { hour: '15', clicks: 489 },
  { hour: '18', clicks: 623 },
  { hour: '21', clicks: 378 },
];

const deviceData = [
  { name: '移动端', value: 68, color: '#2563EB' },
  { name: '桌面端', value: 28, color: '#10B981' },
  { name: '平板', value: 4, color: '#F59E0B' },
];

const browserData = [
  { name: 'Chrome', clicks: 18240 },
  { name: 'Safari', clicks: 12890 },
  { name: 'Edge', clicks: 8450 },
  { name: 'Firefox', clicks: 4320 },
  { name: '其他', clicks: 1992 },
];

const geoDistribution = [
  { region: '北京', clicks: 12847, percentage: 28 },
  { region: '上海', clicks: 10124, percentage: 22 },
  { region: '广东', clicks: 8293, percentage: 18 },
  { region: '浙江', percentage: 15, clicks: 6901 },
  { region: '江苏', clicks: 4582, percentage: 10 },
  { region: '其他', clicks: 3145, percentage: 7 },
];

const accessLogs = [
  { 
    id: 1, 
    time: '2026-02-15 14:32:18', 
    ip: '120.241.***.**', 
    location: '北京', 
    device: 'iPhone 15 Pro',
    browser: 'Safari 17.2',
    referer: '微信',
  },
  { 
    id: 2, 
    time: '2026-02-15 14:31:45', 
    ip: '183.62.***.**', 
    location: '上海', 
    device: 'MacBook Pro',
    browser: 'Chrome 121',
    referer: '直接访问',
  },
  { 
    id: 3, 
    time: '2026-02-15 14:30:22', 
    ip: '114.242.***.**', 
    location: '深圳', 
    device: 'Xiaomi 14',
    browser: 'Chrome Mobile',
    referer: '微博',
  },
  { 
    id: 4, 
    time: '2026-02-15 14:29:08', 
    ip: '61.148.***.**', 
    location: '杭州', 
    device: 'iPad Pro',
    browser: 'Safari 17.1',
    referer: '抖音',
  },
];

export function LinkDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [riskScore] = useState(15); // AI 风险评分
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const linkData = {
    id: id || '1',
    shortUrl: 'lf.io/promo2026',
    originalUrl: 'https://example.com/spring-festival-promotion-2026-special-offer',
    title: '春节促销活动',
    clicks: 45892,
    uniqueVisitors: 32847,
    status: 'active' as const,
    createdAt: '2026-01-15 10:30:00',
    expiresAt: '2026-02-28 23:59:59',
    category: '营销推广',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${linkData.shortUrl}`);
    toast.success('短链已复制到剪贴板');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/links')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#111827] mb-1">{linkData.title}</h1>
          <div className="flex items-center gap-3 text-sm text-[#6B7280]">
            <code className="bg-[#F3F4F6] px-2 py-1 rounded font-mono">{linkData.shortUrl}</code>
            <Button variant="ghost" size="sm" className="h-7" onClick={handleCopy}>
              <Copy className="w-3.5 h-3.5 mr-1" />
              复制
            </Button>
            <Button variant="ghost" size="sm" className="h-7" onClick={() => setQrDialogOpen(true)}>
              <QrCode className="w-3.5 h-3.5 mr-1" />
              二维码
            </Button>
          </div>
        </div>
        <StatusTag status={linkData.status} />
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">基础信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-[#6B7280] mb-1 block">原始链接</label>
            <div className="flex items-center gap-2">
              <p className="text-sm text-[#111827] break-all">{linkData.originalUrl}</p>
              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" asChild>
                <a href={linkData.originalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#6B7280] mb-1 block flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                创建时间
              </label>
              <p className="text-sm text-[#111827]">{linkData.createdAt}</p>
            </div>
            <div>
              <label className="text-sm text-[#6B7280] mb-1 block flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                过期时间
              </label>
              <p className="text-sm text-[#111827]">{linkData.expiresAt}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
              <MousePointerClick className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">总点击量</p>
              <p className="text-2xl font-semibold text-[#111827]">{linkData.clicks.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">独立访客</p>
              <p className="text-2xl font-semibold text-[#111827]">{linkData.uniqueVisitors.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">点击率</p>
              <p className="text-2xl font-semibold text-[#111827]">71.5%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Time Series Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#111827] mb-6">时序分析</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="hour" stroke="#6B7280" style={{ fontSize: 12 }} />
            <YAxis stroke="#6B7280" style={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#2563EB" 
              strokeWidth={2}
              name="点击量"
              dot={{ fill: '#2563EB', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Device & Browser Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">设备分布</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">浏览器分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={browserData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: 12 }} />
              <YAxis stroke="#6B7280" style={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="clicks" fill="#2563EB" radius={[8, 8, 0, 0]} name="点击量" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#111827] mb-6">地域分布</h3>
        <div className="space-y-3">
          {geoDistribution.map((geo, index) => (
            <motion.div
              key={geo.region}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="w-24 text-sm font-medium text-[#111827]">{geo.region}</div>
              <div className="flex-1">
                <div className="h-8 bg-[#F3F4F6] rounded-lg overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
                    initial={{ width: 0 }}
                    animate={{ width: `${geo.percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
              </div>
              <div className="w-24 text-right">
                <span className="text-sm font-semibold text-[#111827]">{geo.clicks.toLocaleString()}</span>
                <span className="text-sm text-[#6B7280] ml-2">({geo.percentage}%)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI Classification & Risk Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#111827]">AI 分类与风险评分</h3>
          <Badge className="bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]">
            <Shield className="w-3.5 h-3.5 mr-1" />
            安全
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-3">内容分类</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{linkData.category}</Badge>
              <Badge variant="outline">电商促销</Badge>
              <Badge variant="outline">限时活动</Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-3">风险评分</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#10B981] rounded-full"
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-[#10B981]">{riskScore}</span>
                <span className="text-sm text-[#6B7280]">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mt-2">评分越低，风险越小</p>
          </div>
        </div>
      </Card>

      {/* Access Logs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#111827] mb-6">访问日志</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
                <TableHead>访问时间</TableHead>
                <TableHead>IP 地址</TableHead>
                <TableHead>位置</TableHead>
                <TableHead>设备</TableHead>
                <TableHead>浏览器</TableHead>
                <TableHead>来源</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#F9FAFB]"
                >
                  <TableCell className="font-mono text-sm">{log.time}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#6B7280]" />
                      {log.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-4 h-4 text-[#6B7280]" />
                      {log.device}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Chrome className="w-4 h-4 text-[#6B7280]" />
                      {log.browser}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#6B7280]">{log.referer}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      <QRCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        link={{
          shortUrl: linkData.shortUrl,
          title: linkData.title,
        }}
      />
    </div>
  );
}