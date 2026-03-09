import React from 'react';
import { cn } from './ui/utils';

export type StatusType = 'active' | 'paused' | 'blocked' | 'expired';

interface StatusTagProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  active: {
    label: '活跃',
    className: 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]/20',
  },
  paused: {
    label: '暂停',
    className: 'bg-[#E5E7EB] text-[#4B5563] border-[#9CA3AF]/20',
  },
  blocked: {
    label: '已拦截',
    className: 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]/20',
  },
  expired: {
    label: '已过期',
    className: 'bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]/20',
  },
};

export function StatusTag({ status, className }: StatusTagProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
