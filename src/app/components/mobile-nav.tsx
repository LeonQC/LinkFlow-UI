import React from 'react';
import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Shield, 
  Activity,
  QrCode
} from 'lucide-react';
import { cn } from './ui/utils';

interface MobileNavProps {
  isAdmin?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: '看板', href: '/dashboard', icon: LayoutDashboard },
  { label: '短链', href: '/links', icon: LinkIcon },
  { label: '二维码', href: '/qr-codes', icon: QrCode },
  { label: '风控', href: '/alerts', icon: Shield, adminOnly: true },
  { label: '监控', href: '/monitoring', icon: Activity, adminOnly: true },
];

export function MobileNav({ isAdmin = false }: MobileNavProps) {
  const location = useLocation();
  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50">
      <div className={cn(
        "grid gap-1 p-2",
        filteredItems.length === 3 ? "grid-cols-3" : 
        filteredItems.length === 4 ? "grid-cols-4" : 
        "grid-cols-5"
      )}>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-[#DBEAFE] text-[#2563EB]'
                  : 'text-[#6B7280] active:bg-[#F3F4F6]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}