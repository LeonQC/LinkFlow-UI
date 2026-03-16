import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { BackendCapabilityAlert } from '../components/backend-capability-alert';
import { EmptyState } from '../components/empty-state';
import { Card } from '../components/ui/card';
import { backendCapabilities } from '../services/linkflow-api';

export function AlertsPageLive() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Risk Alerts</h1>
        <p className="text-sm text-[#6B7280] mt-1">No mocked alert queue is shown anymore.</p>
      </div>

      <BackendCapabilityAlert
        title="Backend status"
        description={backendCapabilities.alerts.summary}
        tone="warning"
      />

      <Card className="p-6">
        <EmptyState
          title="Risk alert APIs are not wired yet"
          description="When the backend exposes real alert endpoints, this page can move from a placeholder state to live review workflows immediately."
          icon={ShieldAlert}
        />
      </Card>
    </div>
  );
}
