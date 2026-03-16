import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface BackendCapabilityAlertProps {
  title: string;
  description: string;
  tone?: 'info' | 'success' | 'warning';
}

export function BackendCapabilityAlert({
  title,
  description,
  tone = 'info',
}: BackendCapabilityAlertProps) {
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'warning' ? AlertCircle : Info;

  return (
    <Alert className="border-[#E5E7EB] bg-white">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
