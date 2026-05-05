import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { AppSidebar } from '../components/app-sidebar';
import { MobileNav } from '../components/mobile-nav';
import { TopBar } from '../components/top-bar';
import { Toaster } from '../components/ui/sonner';
import { useBackendHealth } from '../hooks/use-backend-health';
import { api, hasAuthSession } from '../services/linkflow-api';

export function RootLayoutLive() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    isError: backendUnavailable,
    refetch: refetchBackendHealth,
  } = useBackendHealth();

  useEffect(() => {
    if (!hasAuthSession()) {
      navigate('/auth/login', { replace: true });
      return;
    }

    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');

    void api.me()
      .then((user) => {
        localStorage.setItem('userName', user.username);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role);
        setIsAdmin(user.role === 'admin');
      })
      .catch(() => {
        // The API client already handles expired sessions by clearing tokens and redirecting.
      });
  }, [navigate]);

  const handleLogout = () => {
    void api.logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
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

        <MobileNav isAdmin={isAdmin} />
      </div>

      <Toaster />
    </div>
  );
}
