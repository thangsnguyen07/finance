'use client';

import { Surface as HeroSurface, cn } from '@heroui/react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

import type { ReactNode } from 'react';

export type AlertVariant = 'danger' | 'success' | 'warning';

const ALERT_STYLES: Record<AlertVariant, string> = {
  danger: 'border-danger/20 bg-danger/10 text-danger',
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
};

const ALERT_ICONS: Record<AlertVariant, typeof AlertCircle> = {
  danger: AlertCircle,
  success: CheckCircle2,
  warning: Info,
};

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'danger', children, className }: AlertProps) {
  const Icon = ALERT_ICONS[variant];

  return (
    <HeroSurface
      className={cn(
        'flex items-center gap-2 rounded-md border p-3 text-xs',
        ALERT_STYLES[variant],
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </HeroSurface>
  );
}
