import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Zap, 
  Palette, 
  Boxes, 
  Database,
  CheckCircle2,
  Code,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { useLinks } from '../hooks/use-links';
import { useDashboardStats } from '../hooks/use-dashboard';

export function TechDemoPage() {
  const [progress, setProgress] = useState(75);
  
  // 演示 React Query
  const { data: links, isLoading, isFetching } = useLinks();
  const { data: stats } = useDashboardStats();

  const techStack = [
    {
      name: 'React + Vite',
      icon: Rocket,
      color: '#61DAFB',
      features: ['Fast HMR', 'Component-based', 'Virtual DOM'],
      status: 'active'
    },
    {
      name: 'Tailwind CSS v4',
      icon: Palette,
      color: '#06B6D4',
      features: ['Utility-first', 'Responsive', 'Customizable'],
      status: 'active'
    },
    {
      name: 'shadcn/ui',
      icon: Boxes,
      color: '#000000',
      features: ['Accessible', 'Customizable', '40+ Components'],
      status: 'active'
    },
    {
      name: 'TanStack Query',
      icon: Database,
      color: '#FF4154',
      features: ['Caching', 'Auto-sync', 'DevTools'],
      status: 'active'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#EFF6FF] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-2xl mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
            LinkFlow 技术栈演示
          </h1>
          
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            基于现代化技术栈构建的高性能 Web 应用
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Badge className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]">
              <Zap className="w-3 h-3 mr-1" />
              Production Ready
            </Badge>
            <Badge className="bg-[#10B981] text-white hover:bg-[#059669]">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Type Safe
            </Badge>
            <Badge className="bg-[#F59E0B] text-white hover:bg-[#D97706]">
              <Code className="w-3 h-3 mr-1" />
              Modern Stack
            </Badge>
          </div>
        </div>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="p-6 h-full border-2 hover:border-[#2563EB] transition-all hover:shadow-xl">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${tech.color}15` }}
                >
                  <tech.icon className="w-6 h-6" style={{ color: tech.color }} />
                </div>
                
                <h3 className="text-lg font-semibold text-[#111827] mb-2">
                  {tech.name}
                </h3>
                
                <ul className="space-y-2 mb-4">
                  {tech.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Badge variant="outline" className="text-[#10B981] border-[#10B981]">
                  {tech.status === 'active' ? '✓ Active' : 'Pending'}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo */}
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="query">React Query Demo</TabsTrigger>
            <TabsTrigger value="components">shadcn/ui Demo</TabsTrigger>
            <TabsTrigger value="tailwind">Tailwind Demo</TabsTrigger>
          </TabsList>

          {/* React Query Tab */}
          <TabsContent value="query" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#111827] mb-4">
                🔁 TanStack React Query in Action
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#DBEAFE] rounded-lg">
                  <div className="text-sm text-[#1E40AF] mb-1">Query Status</div>
                  <div className="text-2xl font-bold text-[#2563EB]">
                    {isLoading ? 'Loading...' : isFetching ? 'Fetching...' : 'Success'}
                  </div>
                </div>
                
                <div className="p-4 bg-[#D1FAE5] rounded-lg">
                  <div className="text-sm text-[#065F46] mb-1">Cached Links</div>
                  <div className="text-2xl font-bold text-[#10B981]">
                    {links?.length || 0}
                  </div>
                </div>
                
                <div className="p-4 bg-[#FEF3C7] rounded-lg">
                  <div className="text-sm text-[#78350F] mb-1">Total Clicks</div>
                  <div className="text-2xl font-bold text-[#F59E0B]">
                    {stats?.totalClicks.toLocaleString() || 0}
                  </div>
                </div>
              </div>

              <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                <pre className="text-xs text-[#6B7280] overflow-x-auto">
{`// 使用 React Query Hook
const { data, isLoading, refetch } = useLinks();

// 自动缓存 ✓
// 后台同步 ✓
// 错误重试 ✓
// 实时更新 ✓`}
                </pre>
              </div>
            </Card>
          </TabsContent>

          {/* shadcn/ui Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#111827] mb-4">
                🧩 shadcn/ui Components
              </h3>
              
              <div className="space-y-6">
                {/* Buttons */}
                <div>
                  <div className="text-sm font-medium text-[#6B7280] mb-3">Buttons</div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Default</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <div className="text-sm font-medium text-[#6B7280] mb-3">Badges</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="text-sm font-medium text-[#6B7280] mb-3">Progress</div>
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                        -10%
                      </Button>
                      <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                        +10%
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tailwind Tab */}
          <TabsContent value="tailwind" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#111827] mb-4">
                🎨 Tailwind CSS Utilities
              </h3>
              
              <div className="space-y-6">
                {/* Color Palette */}
                <div>
                  <div className="text-sm font-medium text-[#6B7280] mb-3">Color System</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#2563EB]" />
                      <div className="text-xs text-[#6B7280]">Primary</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#10B981]" />
                      <div className="text-xs text-[#6B7280]">Success</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#F59E0B]" />
                      <div className="text-xs text-[#6B7280]">Warning</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#EF4444]" />
                      <div className="text-xs text-[#6B7280]">Danger</div>
                    </div>
                  </div>
                </div>

                {/* Responsive Grid */}
                <div>
                  <div className="text-sm font-medium text-[#6B7280] mb-3">
                    Responsive Grid (调整窗口大小查看效果)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-20 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-semibold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spacing System */}
                <div>
                  <div className="text-sm font-medium text-[#6B7280] mb-3">
                    8pt Spacing System
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-[#6B7280]">gap-2 (8px)</div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-[#2563EB] rounded" />
                        <div className="w-8 h-8 bg-[#2563EB] rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-[#6B7280]">gap-4 (16px)</div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 bg-[#10B981] rounded" />
                        <div className="w-8 h-8 bg-[#10B981] rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 text-xs text-[#6B7280]">gap-6 (24px)</div>
                      <div className="flex gap-6">
                        <div className="w-8 h-8 bg-[#F59E0B] rounded" />
                        <div className="w-8 h-8 bg-[#F59E0B] rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        <Card className="p-6 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm opacity-90 mb-1">Components</div>
              <div className="text-3xl font-bold">40+</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">TypeScript</div>
              <div className="text-3xl font-bold">100%</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Bundle Size</div>
              <div className="text-3xl font-bold">~150KB</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Performance</div>
              <div className="text-3xl font-bold">A+</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
