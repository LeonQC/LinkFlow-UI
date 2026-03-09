# LinkFlow 技术栈文档

## 🎯 核心技术栈

### ⚛️ React + Vite
- **React 18.3.1** - 现代化的 UI 库
- **Vite 6.3.5** - 极速的开发服务器和构建工具
- **Hot Module Replacement (HMR)** - 即时热重载，无需刷新页面

### 🎨 Tailwind CSS v4.1.12
- **Utility-first** CSS 框架
- **响应式设计** - 支持桌面端（1440px）和移动端（390px）
- **自定义主题** - 配置在 `/src/styles/theme.css`
- **8pt 间距系统** - 统一的设计规范

### 🧩 shadcn/ui
- **预构建组件库** - 基于 Radix UI
- **完全可定制** - 所有组件源码在 `/src/app/components/ui/`
- **无障碍访问** - ARIA 标准支持
- **包含组件**:
  - Button, Input, Card, Dialog, Dropdown, Select
  - Table, Tabs, Tooltip, Sheet, Skeleton
  - Alert, Badge, Progress, Switch, Checkbox
  - 等 40+ 个组件

### 🔁 TanStack React Query v5.90
- **强大的异步状态管理**
- **自动缓存和重新验证**
- **后台数据同步**
- **开发者工具** - 内置 DevTools

---

## 📁 项目结构

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # shadcn/ui 组件
│   │   ├── app-sidebar.tsx  # 应用侧边栏
│   │   ├── top-bar.tsx      # 顶部导航栏
│   │   └── ...              # 其他业务组件
│   ├── hooks/
│   │   ├── use-links.ts     # 短链相关 hooks
│   │   ├── use-dashboard.ts # 看板数据 hooks
│   │   └── use-alerts.ts    # 告警数据 hooks
│   ├── lib/
│   │   └── api.ts           # API 服务层
│   ├── pages/
│   │   ├── dashboard.tsx    # 数据看板
│   │   ├── links.tsx        # 短链管理
│   │   ├── qr-codes.tsx     # 二维码管理
│   │   └── ...              # 其他页面
│   ├── layouts/
│   │   ├── root-layout.tsx  # 主布局
│   │   └── auth-layout.tsx  # 认证布局
│   ├── routes.tsx           # 路由配置
│   └── App.tsx              # 应用入口
├── styles/
│   ├── fonts.css            # 字体导入
│   ├── theme.css            # 主题配置
│   ├── tailwind.css         # Tailwind 配置
│   └── index.css            # 全局样式
└── ...
```

---

## 🚀 使用 TanStack React Query

### 1. 基本配置

在 `App.tsx` 中已经配置好了 QueryClient:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 分钟
      gcTime: 1000 * 60 * 10,     // 10 分钟缓存
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 2. 创建 API 服务

在 `/src/app/lib/api.ts` 中定义 API 方法:

```typescript
export const api = {
  getLinks: async (): Promise<Link[]> => {
    await delay(800);
    return mockLinks;
  },
  
  createLink: async (data: Omit<Link, 'id' | 'clicks'>): Promise<Link> => {
    await delay(1000);
    const newLink = { ...data, id: generateId(), clicks: 0 };
    return newLink;
  },
  
  // ... 其他 API 方法
};
```

### 3. 创建自定义 Hooks

在 `/src/app/hooks/use-links.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query Keys - 用于缓存管理
export const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  detail: (id: string) => [...linkKeys.all, 'detail', id] as const,
};

// 查询 - 获取列表
export function useLinks() {
  return useQuery({
    queryKey: linkKeys.lists(),
    queryFn: api.getLinks,
  });
}

// 查询 - 获取详情
export function useLink(id: string) {
  return useQuery({
    queryKey: linkKeys.detail(id),
    queryFn: () => api.getLink(id),
    enabled: !!id,  // 只有在 id 存在时才执行
  });
}

// 变更 - 创建短链
export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createLink,
    onSuccess: () => {
      // 刷新列表缓存
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      toast.success('创建成功');
    },
  });
}

// 变更 - 更新短链
export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.updateLink(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: linkKeys.detail(data.id) });
      toast.success('更新成功');
    },
  });
}
```

### 4. 在组件中使用

```tsx
import { useLinks, useCreateLink } from '../hooks/use-links';

function LinksPage() {
  // 查询数据
  const { data: links, isLoading, isError, refetch } = useLinks();
  
  // 创建变更
  const createLink = useCreateLink();

  const handleCreate = async (formData) => {
    await createLink.mutateAsync(formData);
  };

  if (isLoading) return <Skeleton />;
  if (isError) return <Error />;

  return (
    <div>
      {links?.map(link => (
        <LinkCard key={link.id} link={link} />
      ))}
      <Button onClick={() => handleCreate(newData)}>
        创建短链
      </Button>
    </div>
  );
}
```

---

## 🎨 使用 shadcn/ui 组件

### 已集成的组件

所有组件都在 `/src/app/components/ui/` 目录下:

```tsx
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Dialog } from '../components/ui/dialog';
import { Select } from '../components/ui/select';
import { Table } from '../components/ui/table';
// ... 等等

function MyComponent() {
  return (
    <Card className="p-6">
      <Input placeholder="输入内容..." />
      <Button variant="default" size="lg">
        确认
      </Button>
    </Card>
  );
}
```

### Button 变体

```tsx
<Button variant="default">默认按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="destructive">危险按钮</Button>
<Button size="sm">小按钮</Button>
<Button size="lg">大按钮</Button>
```

### Dialog 使用

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

function MyDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>对话框标题</DialogTitle>
          <DialogDescription>对话框描述</DialogDescription>
        </DialogHeader>
        {/* 内容 */}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎯 最佳实践

### 1. React Query

✅ **使用统一的 Query Keys**
```typescript
const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  detail: (id: string) => [...linkKeys.all, 'detail', id] as const,
};
```

✅ **自动重新验证**
```typescript
useQuery({
  queryKey: ['stats'],
  queryFn: getStats,
  refetchInterval: 30000, // 每 30 秒自动刷新
});
```

✅ **乐观更新**
```typescript
const updateLink = useMutation({
  mutationFn: api.updateLink,
  onMutate: async (newData) => {
    // 取消正在进行的查询
    await queryClient.cancelQueries({ queryKey: linkKeys.detail(newData.id) });
    
    // 保存之前的数据（用于回滚）
    const previous = queryClient.getQueryData(linkKeys.detail(newData.id));
    
    // 乐观更新
    queryClient.setQueryData(linkKeys.detail(newData.id), newData);
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // 发生错误时回滚
    queryClient.setQueryData(
      linkKeys.detail(variables.id), 
      context?.previous
    );
  },
});
```

### 2. Tailwind CSS

✅ **使用设计 tokens**
```tsx
<div className="text-[#111827] bg-[#F9FAFB] border-[#E5E7EB]">
  {/* 使用项目定义的颜色 */}
</div>
```

✅ **响应式设计**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 移动端 1 列，平板 2 列，桌面 4 列 */}
</div>
```

✅ **使用 cn 工具合并类名**
```tsx
import { cn } from '../components/ui/utils';

<button className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
```

### 3. 组件组织

✅ **拆分业务组件**
```
components/
├── ui/              # shadcn/ui 基础组件
├── app-sidebar.tsx  # 应用级组件
├── link-card.tsx    # 业务组件
└── qr-code-dialog.tsx
```

✅ **使用 TypeScript**
```typescript
interface LinkCardProps {
  link: Link;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  // ...
}
```

---

## 📊 实际应用示例

### QR Codes 页面

展示了完整的 React Query 集成:

- ✅ 使用 `useLinks()` 获取数据
- ✅ 加载状态处理
- ✅ 错误处理
- ✅ 数据过滤和搜索
- ✅ 响应式布局

```tsx
export function QRCodesPage() {
  const { data: qrCodes, isLoading } = useLinks();
  
  const filteredQRCodes = qrCodes?.filter(qr => {
    return qr.title.includes(searchQuery);
  }) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredQRCodes.map((qrCode) => (
        <QRCodeCard key={qrCode.id} qrCode={qrCode} />
      ))}
    </div>
  );
}
```

---

## 🛠 开发工具

### React Query DevTools

按 Ctrl + Shift + I 打开浏览器开发者工具，然后点击 React Query 标签查看:

- 📊 所有查询状态
- 🔄 缓存数据
- ⏱ 查询时间线
- 🗑 手动清除缓存

### Tailwind CSS IntelliSense

推荐安装 VS Code 扩展:
- **Tailwind CSS IntelliSense** - 自动补全 Tailwind 类名
- **PostCSS Language Support** - CSS 语法支持

---

## 📚 相关文档

- [React Query 文档](https://tanstack.com/query/latest)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Vite 文档](https://vitejs.dev/)
- [React Router 文档](https://reactrouter.com/)

---

## 🎉 总结

LinkFlow 使用了现代化的技术栈，为您提供:

1. **极速开发体验** - Vite HMR + React Fast Refresh
2. **类型安全** - TypeScript 全面覆盖
3. **强大的数据管理** - TanStack React Query
4. **优雅的 UI 组件** - shadcn/ui
5. **灵活的样式系统** - Tailwind CSS v4
6. **完善的开发工具** - DevTools + IntelliSense

开始构建您的应用吧！🚀
