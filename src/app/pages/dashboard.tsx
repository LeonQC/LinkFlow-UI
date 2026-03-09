import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  MousePointerClick, 
  Link as LinkIcon, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Circle
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../components/ui/card';
import { StatusTag } from '../components/status-tag';

interface KPIData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

const kpiData: KPIData[] = [
  { 
    label: '总点击量', 
    value: '2,847,392', 
    change: 12.5, 
    trend: 'up',
    icon: MousePointerClick,
    color: '#2563EB'
  },
  { 
    label: '活跃短链', 
    value: '1,248', 
    change: 8.2, 
    trend: 'up',
    icon: LinkIcon,
    color: '#10B981'
  },
  { 
    label: '独立访客', 
    value: '847,203', 
    change: -3.1, 
    trend: 'down',
    icon: Users,
    color: '#F59E0B'
  },
  { 
    label: '转化率', 
    value: '3.24%', 
    change: 5.7, 
    trend: 'up',
    icon: TrendingUp,
    color: '#8B5CF6'
  },
];

const trendData = [
  { time: '00:00', clicks: 4200, visitors: 2800 },
  { time: '04:00', clicks: 2100, visitors: 1400 },
  { time: '08:00', clicks: 8900, visitors: 5600 },
  { time: '12:00', clicks: 12400, visitors: 8200 },
  { time: '16:00', clicks: 15800, visitors: 10200 },
  { time: '20:00', clicks: 11200, visitors: 7400 },
  { time: '23:59', clicks: 6800, visitors: 4200 },
];

const geoData = [
  { name: '北京', value: 28, color: '#2563EB' },
  { name: '上海', value: 22, color: '#10B981' },
  { name: '广东', value: 18, color: '#F59E0B' },
  { name: '浙江', value: 15, color: '#8B5CF6' },
  { name: '其他', value: 17, color: '#6B7280' },
];

const channelData = [
  { name: '微信', clicks: 45620 },
  { name: '微博', clicks: 38240 },
  { name: '抖音', clicks: 32180 },
  { name: '直接访问', clicks: 28490 },
  { name: '其他', clicks: 15230 },
];

const topLinks = [
  { id: 1, shortUrl: 'lf.io/promo2026', title: '春节促销活动', clicks: 45892, status: 'active' as const },
  { id: 2, shortUrl: 'lf.io/newprod', title: '新品发布会', clicks: 38471, status: 'active' as const },
  { id: 3, shortUrl: 'lf.io/survey', title: '用户调研问卷', clicks: 29384, status: 'active' as const },
  { id: 4, shortUrl: 'lf.io/blog2026', title: '技术博客文章', clicks: 21847, status: 'paused' as const },
  { id: 5, shortUrl: 'lf.io/event', title: '线下活动报名', clicks: 18392, status: 'active' as const },
];

export function DashboardPage() {
  const [wsConnected, setWsConnected] = useState(true);
  const [realTimeClicks, setRealTimeClicks] = useState(0);

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeClicks(prev => prev + Math.floor(Math.random() * 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#111827] mb-1">数据看板</h1>
          <p className="text-sm text-[#6B7280]">实时监控您的短链数据表现</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E5E7EB]">
          <Circle 
            className={`w-2 h-2 ${wsConnected ? 'fill-[#10B981] text-[#10B981]' : 'fill-[#EF4444] text-[#EF4444]'}`} 
          />
          <span className="text-sm text-[#6B7280]">
            {wsConnected ? 'WebSocket 已连接' : 'WebSocket 未连接'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${kpi.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-[#6B7280]">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-[#111827]">{kpi.value}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Trend Chart */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-1">点击量趋势</h3>
          <p className="text-sm text-[#6B7280]">最近 24 小时数据</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: 12 }} />
            <YAxis stroke="#6B7280" style={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="clicks" 
              stroke="#2563EB" 
              fill="url(#colorClicks)"
              name="点击量"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="visitors" 
              stroke="#10B981" 
              fill="url(#colorVisitors)"
              name="访客数"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Geo & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">地域分布</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={geoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {geoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">渠道分布</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={channelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" style={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" stroke="#6B7280" style={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="clicks" fill="#2563EB" radius={[0, 8, 8, 0]} name="点击量" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Links */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#111827]">热门短链</h3>
          <span className="text-sm text-[#6B7280]">Top 5</span>
        </div>
        <div className="space-y-3">
          {topLinks.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827] mb-1">{link.title}</p>
                  <p className="text-sm text-[#6B7280] font-mono">{link.shortUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#6B7280]">点击量</p>
                  <p className="font-semibold text-[#111827]">{link.clicks.toLocaleString()}</p>
                </div>
                <StatusTag status={link.status} />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Real-time Counter */}
      <Card className="p-6 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">实时点击量（今日）</p>
            <motion.p 
              className="text-3xl font-bold"
              key={realTimeClicks}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {realTimeClicks.toLocaleString()}
            </motion.p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </Card>
    </div>
  );
}