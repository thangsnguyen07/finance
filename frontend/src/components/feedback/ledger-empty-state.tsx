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
    <Card variant="dashed" className="text-center py-12 px-4">
      <Card.Content className="flex flex-col items-center">
        {icon ? <div className="mb-3 text-muted">{icon}</div> : null}
        <h3 className="font-serif font-bold text-base text-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted max-w-md mx-auto mt-1 mb-4">
          {description}
        </p>
        {action}
      </Card.Content>
    </Card>
  );
}
