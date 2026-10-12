'use client';

import { Card } from '@/components/ui/card';

import type { ReactNode } from 'react';

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
    <Card variant="dashed" className="px-4 py-12 text-center">
      <Card.Content className="flex flex-col items-center">
        {icon ? <div className="mb-3 text-muted">{icon}</div> : null}
        <h3 className="font-serif text-base font-bold text-foreground">
          {title}
        </h3>
        <p className="mx-auto mt-1 mb-4 max-w-md text-xs text-muted">
          {description}
        </p>
        {action}
      </Card.Content>
    </Card>
  );
}
