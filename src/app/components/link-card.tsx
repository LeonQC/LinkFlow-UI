import React from 'react';
import { motion } from 'motion/react';
import { Copy, MoreVertical, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { StatusTag, StatusType } from './status-tag';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LinkCardProps {
  id: string;
  shortUrl: string;
  title: string;
  clicks: number;
  status: StatusType;
  createdAt: string;
  onClick?: () => void;
  onCopy?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  onShowQR?: () => void;
  index?: number;
}

export function LinkCard({
  id,
  shortUrl,
  title,
  clicks,
  status,
  createdAt,
  onClick,
  onCopy,
  onToggleStatus,
  onDelete,
  onShowQR,
  index = 0,
}: LinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="font-medium text-[#111827] mb-1 truncate">{title}</h3>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-[#F3F4F6] px-2 py-1 rounded font-mono text-[#2563EB]">
              {shortUrl}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onCopy?.();
              }}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopy?.(); }}>
              复制链接
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleStatus?.(); }}>
              {status === 'active' ? '暂停' : '启用'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-[#EF4444]" 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            >
              删除
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-[#2563EB]" 
              onClick={(e) => { e.stopPropagation(); onShowQR?.(); }}
            >
              显示二维码
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-[#6B7280]">点击量</span>
            <span className="ml-2 font-semibold text-[#111827]">{clicks.toLocaleString()}</span>
          </div>
          <div className="text-[#6B7280]">{createdAt}</div>
        </div>
        <StatusTag status={status} />
      </div>
    </motion.div>
  );
}