import React from 'react';
import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Shield, 
  Activity,
  ChevronLeft,
  ChevronRight,
  QrCode
} from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  isAdmin?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: '数据看板', href: '/dashboard', icon: LayoutDashboard },
  { label: '短链管理', href: '/links', icon: LinkIcon },
  { label: 'QR codes', href: '/qr-codes', icon: QrCode },
  { label: '风控告警', href: '/alerts', icon: Shield, adminOnly: true },
  { label: '系统监控', href: '/monitoring', icon: Activity, adminOnly: true },
];

export function AppSidebar({ collapsed = false, onToggle, isAdmin = false }: SidebarProps) {
  const location = useLocation();
  
  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);
  
  return (
    <aside
      className={cn(
        'h-screen bg-white border-r border-[#E5E7EB] flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 border-b border-[#E5E7EB] flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[#111827]">LinkFlow</span>
          </div>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn('w-8 h-8', collapsed && 'mx-auto')}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-[#DBEAFE] text-[#2563EB] font-medium'
                  : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]',
                collapsed && 'justify-center'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-[#E5E7EB]">
        {!collapsed && (
          <div className="text-xs text-[#9CA3AF] space-y-1">
            <div>版本 v1.0.0</div>
            <div>© 2026 LinkFlow</div>
          </div>
        )}
      </div>
    </aside>
  );
}