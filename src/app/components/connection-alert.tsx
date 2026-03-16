import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface ConnectionAlertProps {
  isConnected: boolean;
  onReconnect?: () => void;
}

export function ConnectionAlert({ isConnected, onReconnect }: ConnectionAlertProps) {
  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#F59E0B] text-white py-3 px-4 flex items-center justify-center gap-4 shadow-lg"
        >
          <WifiOff className="w-5 h-5" />
          <span className="font-medium">WebSocket 连接已断开，实时数据更新已暂停</span>
          <Button
            size="sm"
            variant="secondary"
            onClick={onReconnect}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新连接
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
