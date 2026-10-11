'use client';

import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface LedgerEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function LedgerEmptyState({
  icon,
  title,
  description,
  action,
}: LedgerEmptyStateProps) {
  return (
    <Card variant="dashed" padding="lg" className="text-center">
      <Card.Content className="flex flex-col items-center py-4">
        {icon ? <div className="mb-3 text-ink-secondary">{icon}</div> : null}
        <h3 className="font-serif text-base font-bold text-ink-primary">
          {title}
        </h3>
        <p className="mx-auto mt-1 mb-4 max-w-md text-xs text-ink-secondary">
          {description}
        </p>
        {action}
      </Card.Content>
    </Card>
  );
}
