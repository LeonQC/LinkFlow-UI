import React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TopBarProps {
  title?: string;
  onLogout?: () => void;
}

export function TopBar({ title, onLogout }: TopBarProps) {
  const userName = localStorage.getItem('userName') || '用户';
  const userRole = localStorage.getItem('userRole');
  
  return (
    <header className="h-14 md:h-16 border-b border-[#E5E7EB] bg-white flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-base md:text-lg font-semibold text-[#111827]">{title}</h1>}
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
          <Bell className="w-4 h-4 md:w-5 md:h-5 text-[#6B7280]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 md:h-10 px-2 md:px-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-[#111827]">{userName}</span>
                {userRole === 'admin' && (
                  <span className="text-xs text-[#6B7280]">管理员</span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>个人设置</DropdownMenuItem>
            <DropdownMenuItem>账户安全</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-[#EF4444]">
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}