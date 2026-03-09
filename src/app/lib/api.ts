// API 服务层 - 模拟后端 API 调用

export interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  clicks: number;
  status: 'active' | 'paused' | 'expired';
  createdAt: string;
  expiresAt?: string;
}

export interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  clicksToday: number;
  clicksGrowth: number;
  linksGrowth: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  linkUrl: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟数据
const mockLinks: Link[] = [
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
    clicks: 15621,
    status: 'paused',
    createdAt: '2026-01-20',
  },
  {
    id: '5',
    shortUrl: 'lf.io/event',
    originalUrl: 'https://example.com/company-annual-event',
    title: '公司年会',
    clicks: 8945,
    status: 'active',
    createdAt: '2026-02-05',
  },
  {
    id: '6',
    shortUrl: 'lf.io/docs',
    originalUrl: 'https://example.com/product-documentation',
    title: '产品文档',
    clicks: 6234,
    status: 'active',
    createdAt: '2026-02-12',
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: '恶意流量检测',
    description: '检测到来自 203.0.113.0/24 的异常高频访问',
    linkUrl: 'lf.io/promo2026',
    timestamp: '2026-02-18 14:23:11',
    status: 'pending',
  },
  {
    id: '2',
    type: 'warning',
    title: '疑似机器人访问',
    description: '短时间内出现大量相同 User-Agent 的请求',
    linkUrl: 'lf.io/newprod',
    timestamp: '2026-02-18 13:45:22',
    status: 'pending',
  },
  {
    id: '3',
    type: 'info',
    title: '访问量异常',
    description: '该链接访问量突增 300%，请确认是否正常',
    linkUrl: 'lf.io/survey',
    timestamp: '2026-02-18 12:10:33',
    status: 'resolved',
  },
];

// API 方法
export const api = {
  // 获取所有短链
  getLinks: async (): Promise<Link[]> => {
    await delay(800);
    return [...mockLinks];
  },

  // 获取单个短链
  getLink: async (id: string): Promise<Link> => {
    await delay(500);
    const link = mockLinks.find(l => l.id === id);
    if (!link) throw new Error('Link not found');
    return { ...link };
  },

  // 创建短链
  createLink: async (data: Omit<Link, 'id' | 'clicks' | 'createdAt' | 'status'>): Promise<Link> => {
    await delay(1000);
    const newLink: Link = {
      ...data,
      id: String(mockLinks.length + 1),
      clicks: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockLinks.push(newLink);
    return newLink;
  },

  // 更新短链
  updateLink: async (id: string, data: Partial<Link>): Promise<Link> => {
    await delay(800);
    const index = mockLinks.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Link not found');
    mockLinks[index] = { ...mockLinks[index], ...data };
    return mockLinks[index];
  },

  // 删除短链
  deleteLink: async (id: string): Promise<void> => {
    await delay(600);
    const index = mockLinks.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Link not found');
    mockLinks.splice(index, 1);
  },

  // 获取看板统计
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(1000);
    const totalLinks = mockLinks.length;
    const totalClicks = mockLinks.reduce((sum, link) => sum + link.clicks, 0);
    const activeLinks = mockLinks.filter(l => l.status === 'active').length;
    
    return {
      totalLinks,
      totalClicks,
      activeLinks,
      clicksToday: Math.floor(totalClicks * 0.15),
      clicksGrowth: 12.5,
      linksGrowth: 8.3,
    };
  },

  // 获取告警列表
  getAlerts: async (): Promise<Alert[]> => {
    await delay(600);
    return [...mockAlerts];
  },

  // 更新告警状态
  updateAlert: async (id: string, status: 'pending' | 'resolved'): Promise<Alert> => {
    await delay(400);
    const alert = mockAlerts.find(a => a.id === id);
    if (!alert) throw new Error('Alert not found');
    alert.status = status;
    return alert;
  },
};
