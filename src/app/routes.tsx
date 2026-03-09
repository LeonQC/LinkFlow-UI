import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayoutLive } from './layouts/root-layout-live';
import { AuthLayout } from './layouts/auth-layout';
import { AlertsPageLive } from './pages/alerts-live';
import { DashboardPageLive } from './pages/dashboard-live';
import { LinkDetailPageLive } from './pages/link-detail-live';
import { LinksPageLive } from './pages/links-live';
import { LoginPageLive } from './pages/login-live';
import { MonitoringPageLive } from './pages/monitoring-live';
import { QRCodesPageLive } from './pages/qr-codes-live';

export const router = createBrowserRouter([
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      { path: 'login', Component: LoginPageLive },
      { index: true, element: <Navigate to="/auth/login" replace /> },
    ],
  },
  {
    path: '/',
    Component: RootLayoutLive,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardPageLive },
      { path: 'links', Component: LinksPageLive },
      { path: 'links/:id', Component: LinkDetailPageLive },
      { path: 'qr-codes', Component: QRCodesPageLive },
      { path: 'alerts', Component: AlertsPageLive },
      { path: 'monitoring', Component: MonitoringPageLive },
    ],
  },
]);
