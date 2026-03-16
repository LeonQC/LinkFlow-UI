import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  MousePointerClick, 
  Link as LinkIcon, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { useDashboardStats } from '../hooks/use-dashboard';
import { useLinks } from '../hooks/use-links';

interface KPIData {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

const trendData = [
  { time: '00:00', clicks: 4200, visitors: 2800 },
  { time: '04:00', clicks: 2100, visitors: 1400 },
  { time: '08:00', clicks: 8900, visitors: 5600 },
  { time: '12:00', clicks: 12400, visitors: 8200 },
  { time: '16:00', clicks: 15800, visitors: 10100 },
  { time: '20:00', clicks: 11200, visitors: 7300 },
  { time: '24:00', clicks: 6500, visitors: 4200 },
];

export function DashboardPageEnhanced() {
  // 使用 React Query hooks
  const { 
    data: stats, 
    isLoading: statsLoading, 
    refetch: refetchStats,
    isFetching: statsFetching 
  } = useDashboardStats();
  
  const { 
    data: links, 
    isLoading: linksLoading 
  } = useLinks();

  // 计算 KPI 数据
  const kpiData: KPIData[] = stats ? [
    { 
      label: '总点击量', 
      value: stats.totalClicks.toLocaleString(), 
      change: stats.clicksGrowth, 
      trend: stats.clicksGrowth >= 0 ? 'up' : 'down',
      icon: MousePointerClick,
      color: '#2563EB'
    },
    { 
      label: '活跃短链', 
      value: stats.activeLinks.toLocaleString(), 
      change: stats.linksGrowth, 
      trend: stats.linksGrowth >= 0 ? 'up' : 'down',
      icon: LinkIcon,
      color: '#10B981'
    },
    { 
      label: '今日点击', 
      value: stats.clicksToday.toLocaleString(), 
      change: 15.3, 
      trend: 'up',
      icon: Users,
      color: '#F59E0B'
    },
    { 
      label: '总短链数', 
      value: stats.totalLinks.toLocaleString(), 
      change: stats.linksGrowth, 
      trend: stats.linksGrowth >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: '#8B5CF6'
    },
  ] : [];

  // 热门短链（前5个）
  const topLinks = links?.slice(0, 5).sort((a, b) => b.clicks - a.clicks) || [];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">数据看板</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              实时监控短链数据与性能指标
            </p>
          </div>
          <Button
            onClick={() => refetchStats()}
            variant="outline"
            size="sm"
            disabled={statsFetching}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${statsFetching ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </Card>
              ))}
            </>
          ) : (
            kpiData.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-[#6B7280] mb-1">{kpi.label}</p>
                      <h3 className="text-2xl font-semibold text-[#111827] mb-2">
                        {kpi.value}
                      </h3>
                      <div className="flex items-center gap-1">
                        {kpi.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            kpi.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                          }`}
                        >
                          {kpi.change > 0 ? '+' : ''}{kpi.change}%
                        </span>
                        <span className="text-xs text-[#9CA3AF]">vs 上周</span>
                      </div>
                    </div>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${kpi.color}15` }}
                    >
                      <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">
              24小时访问趋势
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fill="url(#colorClicks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Links */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">
              热门短链 Top 5
            </h3>
            {linksLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{
                        background: `linear-gradient(135deg, ${
                          ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index]
                        } 0%, ${
                          ['#1D4ED8', '#059669', '#D97706', '#7C3AED', '#DC2626'][index]
                        } 100%)`
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#111827] truncate">
                        {link.title}
                      </div>
                      <div className="text-xs text-[#9CA3AF] font-mono truncate">
                        {link.shortUrl}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#2563EB]">
                        {link.clicks.toLocaleString()}
                      </div>
                      <div className="text-xs text-[#6B7280]">点击</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Status Notice */}
        <Card className="p-4 bg-gradient-to-r from-[#DBEAFE] to-[#EFF6FF] border-[#93C5FD]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-sm text-[#1E40AF] font-medium">
              系统运行正常 · 数据实时更新中 · 
              {statsFetching ? ' 正在刷新...' : ' 最后更新: 刚刚'}
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
