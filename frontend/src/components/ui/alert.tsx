'use client';

import type { ReactNode } from 'react';
import { Surface as HeroSurface, cn } from '@heroui/react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export type AlertVariant = 'danger' | 'success' | 'warning';

const ALERT_STYLES: Record<AlertVariant, string> = {
  danger: 'border-accent-coral bg-accent-coral/10 text-accent-coral',
  success: 'border-accent-teal bg-accent-teal/10 text-accent-teal',
  warning: 'border-accent-ochre bg-accent-ochre/10 text-ink-primary',
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
        'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium',
        ALERT_STYLES[variant],
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </HeroSurface>
  );
}
