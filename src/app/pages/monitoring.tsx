import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Database,
  Zap,
  Server,
  GitBranch,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Circle,
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
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  icon: React.ElementType;
  uptime: number;
  latency: number;
  errorRate: number;
  requests: number;
  color: string;
}

const services: ServiceStatus[] = [
  {
    name: 'API Gateway',
    status: 'healthy',
    icon: Server,
    uptime: 99.98,
    latency: 45,
    errorRate: 0.02,
    requests: 1284920,
    color: '#2563EB',
  },
  {
    name: 'Redis Cache',
    status: 'healthy',
    icon: Database,
    uptime: 99.99,
    latency: 12,
    errorRate: 0.01,
    requests: 8492847,
    color: '#10B981',
  },
  {
    name: 'Kafka Queue',
    status: 'warning',
    icon: GitBranch,
    uptime: 99.85,
    latency: 128,
    errorRate: 0.15,
    requests: 452847,
    color: '#F59E0B',
  },
  {
    name: 'RabbitMQ',
    status: 'healthy',
    icon: Zap,
    uptime: 99.95,
    latency: 38,
    errorRate: 0.03,
    requests: 384729,
    color: '#8B5CF6',
  },
  {
    name: 'Flink Stream',
    status: 'healthy',
    icon: Activity,
    uptime: 99.92,
    latency: 67,
    errorRate: 0.08,
    requests: 892847,
    color: '#EC4899',
  },
];

const latencyData = [
  { time: '10:00', api: 42, redis: 10, kafka: 120, rabbitmq: 35, flink: 65 },
  { time: '10:15', api: 48, redis: 12, kafka: 135, rabbitmq: 38, flink: 70 },
  { time: '10:30', api: 45, redis: 11, kafka: 128, rabbitmq: 36, flink: 68 },
  { time: '10:45', api: 52, redis: 13, kafka: 142, rabbitmq: 42, flink: 72 },
  { time: '11:00', api: 47, redis: 12, kafka: 130, rabbitmq: 39, flink: 69 },
  { time: '11:15', api: 43, redis: 11, kafka: 125, rabbitmq: 37, flink: 66 },
  { time: '11:30', api: 46, redis: 12, kafka: 132, rabbitmq: 40, flink: 71 },
  { time: '11:45', api: 44, redis: 11, kafka: 127, rabbitmq: 38, flink: 67 },
];

const throughputData = [
  { time: '10:00', requests: 8420 },
  { time: '10:15', requests: 9280 },
  { time: '10:30', requests: 12450 },
  { time: '10:45', requests: 15820 },
  { time: '11:00', requests: 18920 },
  { time: '11:15', requests: 16280 },
  { time: '11:30', requests: 14850 },
  { time: '11:45', requests: 13420 },
];

const errorRateData = [
  { time: '10:00', rate: 0.02 },
  { time: '10:15', rate: 0.03 },
  { time: '10:30', rate: 0.02 },
  { time: '10:45', rate: 0.04 },
  { time: '11:00', rate: 0.03 },
  { time: '11:15', rate: 0.02 },
  { time: '11:30', rate: 0.02 },
  { time: '11:45', rate: 0.01 },
];

export function MonitoringPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveMetrics, setLiveMetrics] = useState({
    qps: 12847,
    activeConnections: 8429,
    cpuUsage: 42,
    memoryUsage: 68,
  });

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate live metrics update
      setLiveMetrics(prev => ({
        qps: prev.qps + Math.floor(Math.random() * 200 - 100),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 100 - 50),
        cpuUsage: Math.min(100, Math.max(0, prev.cpuUsage + Math.random() * 4 - 2)),
        memoryUsage: Math.min(100, Math.max(0, prev.memoryUsage + Math.random() * 2 - 1)),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
      case 'warning': return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
      case 'error': return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' };
      default: return { bg: '#F3F4F6', text: '#4B5563', dot: '#9CA3AF' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Circle;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827] mb-1">系统监控</h1>
          <p className="text-sm text-[#6B7280]">实时监控系统健康状态与性能指标</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E5E7EB]">
          <Clock className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#111827] font-mono">
            {currentTime.toLocaleTimeString('zh-CN')}
          </span>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 opacity-80" />
            <motion.div
              key={liveMetrics.qps}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <TrendingUp className="w-5 h-5" />
            </motion.div>
          </div>
          <p className="text-sm opacity-90 mb-1">实时 QPS</p>
          <motion.p
            className="text-3xl font-bold"
            key={liveMetrics.qps}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
          >
            {liveMetrics.qps.toLocaleString()}
          </motion.p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
              <Server className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>
          <p className="text-sm text-[#6B7280] mb-1">活跃连接</p>
          <motion.p
            className="text-3xl font-semibold text-[#111827]"
            key={liveMetrics.activeConnections}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
          >
            {liveMetrics.activeConnections.toLocaleString()}
          </motion.p>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">CPU 使用率</span>
              <span className="text-lg font-semibold text-[#111827]">
                {liveMetrics.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <Progress value={liveMetrics.cpuUsage} className="h-2" />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Circle className={`w-2 h-2 fill-current ${
              liveMetrics.cpuUsage < 70 ? 'text-[#10B981]' : 'text-[#F59E0B]'
            }`} />
            {liveMetrics.cpuUsage < 70 ? '正常' : '负载较高'}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">内存使用率</span>
              <span className="text-lg font-semibold text-[#111827]">
                {liveMetrics.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <Progress value={liveMetrics.memoryUsage} className="h-2" />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Circle className={`w-2 h-2 fill-current ${
              liveMetrics.memoryUsage < 80 ? 'text-[#10B981]' : 'text-[#F59E0B]'
            }`} />
            {liveMetrics.memoryUsage < 80 ? '正常' : '内存紧张'}
          </div>
        </Card>
      </div>

      {/* Service Status */}
      <div>
        <h2 className="text-lg font-semibold text-[#111827] mb-4">服务健康状态</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const StatusIcon = getStatusIcon(service.status);
            const statusColor = getStatusColor(service.status);

            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${service.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: service.color }} />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#111827]">{service.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Circle 
                            className="w-2 h-2 fill-current" 
                            style={{ color: statusColor.dot }}
                          />
                          <span 
                            className="text-xs font-medium"
                            style={{ color: statusColor.text }}
                          >
                            {service.status === 'healthy' ? '运行正常' : service.status === 'warning' ? '警告' : '错误'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">可用性</p>
                      <p className="text-sm font-semibold text-[#111827]">{service.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">延迟</p>
                      <p className="text-sm font-semibold text-[#111827]">{service.latency}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">错误率</p>
                      <p className="text-sm font-semibold text-[#111827]">{service.errorRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">请求数</p>
                      <p className="text-sm font-semibold text-[#111827]">
                        {(service.requests / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">服务延迟监控</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: 12 }} />
              <YAxis stroke="#6B7280" style={{ fontSize: 12 }} label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="api" stroke="#2563EB" strokeWidth={2} dot={false} name="API" />
              <Line type="monotone" dataKey="redis" stroke="#10B981" strokeWidth={2} dot={false} name="Redis" />
              <Line type="monotone" dataKey="kafka" stroke="#F59E0B" strokeWidth={2} dot={false} name="Kafka" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Throughput Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-6">系统吞吐量</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={throughputData}>
              <defs>
                <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: 12 }} />
              <YAxis stroke="#6B7280" style={{ fontSize: 12 }} label={{ value: 'req/min', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="requests" 
                stroke="#2563EB" 
                fill="url(#colorThroughput)"
                strokeWidth={2}
                name="请求量"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Error Rate Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#111827] mb-6">系统错误率趋势</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={errorRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: 12 }} />
            <YAxis stroke="#6B7280" style={{ fontSize: 12 }} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, '错误率']}
            />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', r: 4 }}
              activeDot={{ r: 6 }}
              name="错误率"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
