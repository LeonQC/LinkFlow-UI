import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { AppSidebar } from '../components/app-sidebar';
import { TopBar } from '../components/top-bar';
import { MobileNav } from '../components/mobile-nav';
import { Toaster } from '../components/ui/sonner';
import { useBackendHealth } from '../hooks/use-backend-health';

export function RootLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    isError: backendUnavailable,
    refetch: refetchBackendHealth,
  } = useBackendHealth();

  // 模拟 WebSocket 连接状态
  useEffect(() => {
    // 模拟随机断连
  }, []);

  // 检查用户角色
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isAdmin={isAdmin}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {!backendUnavailable ? null : (
          <div className="bg-[#F59E0B] text-white py-3 px-4 text-sm flex items-center justify-center gap-4">
            <span>Backend connection is down. Live API requests are currently unavailable.</span>
            <button
              type="button"
              onClick={() => {
                void refetchBackendHealth();
              }}
              className="underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}
        <TopBar onLogout={handleLogout} />
        
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        <MobileNav isAdmin={isAdmin} />
      </div>
      
      <Toaster />
    </div>
  );
}
