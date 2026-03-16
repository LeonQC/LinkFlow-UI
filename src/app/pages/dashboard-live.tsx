import React from 'react';
import { Activity, Database, Link2, UserRoundPlus } from 'lucide-react';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { Card } from '../components/ui/card';
import { useBackendHealth } from '../hooks/use-backend-health';
import { useLinks } from '../hooks/use-links';
import { backendCapabilities } from '../services/linkflow-api';

export function DashboardPageLive() {
  const { data: health, isLoading: healthLoading, isError: healthError } = useBackendHealth();
  const { data: links = [] } = useLinks();

  const cards = [
    {
      title: 'Backend health',
      value: healthLoading ? 'Checking...' : healthError ? 'Down' : health?.status ?? 'Unknown',
      icon: Activity,
      accent: '#2563EB',
    },
    {
      title: 'Register API',
      value: backendCapabilities.authRegister.available ? 'Live' : 'Missing',
      icon: UserRoundPlus,
      accent: '#10B981',
    },
    {
      title: 'Short links in session',
      value: String(links.length),
      icon: Link2,
      accent: '#F59E0B',
    },
    {
      title: 'Analytics APIs',
      value: backendCapabilities.dashboard.available ? 'Live' : 'Pending',
      icon: Database,
      accent: '#111827',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Development Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">This dashboard now reflects only the backend capabilities that actually exist.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{card.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#111827]">{card.value}</p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${card.accent}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.accent }} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BackendCapabilityAlert
          title="Working today"
          description="`POST /api/v1/auth/register`, `POST /api/short-urls`, `GET /api/short-urls/{slug}`, and `GET /actuator/health` are the live integration points currently wired into the frontend."
          tone="success"
        />

        <BackendCapabilityAlert
          title="Still pending in backend"
          description="Login, link listing/detail management, dashboard analytics, alert review, and monitoring metrics are intentionally shown as unavailable instead of mocked."
          tone="warning"
        />
      </div>

      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold text-[#111827]">What to build next</h2>
        <p className="text-sm text-[#6B7280]">
          Once the backend adds list or detail APIs, the frontend can switch from browser-session link records to authoritative server data with minimal churn.
        </p>
        <div className="rounded-lg bg-[#F9FAFB] p-4 text-sm text-[#111827]">
          Current session link count: {links.length}
        </div>
      </Card>
    </div>
  );
}
