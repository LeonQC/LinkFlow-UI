import React from 'react';
import { Database, FileQuestion, LinkIcon, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'file' | 'database' | 'link' | LucideIcon;
  action?: React.ReactNode;
}

const iconMap = {
  file: FileQuestion,
  database: Database,
  link: LinkIcon,
};

export function EmptyState({ title, description, icon = 'file', action }: EmptyStateProps) {
  const Icon = typeof icon === 'string' ? iconMap[icon] : icon;
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#9CA3AF]" />
      </div>
      <h3 className="text-base font-medium text-[#111827] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#6B7280] mb-4 text-center max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
