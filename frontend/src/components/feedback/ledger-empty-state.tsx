'use client';

import { Card } from '@heroui/react';

interface LedgerEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function LedgerEmptyState({
  icon,
  title,
  description,
  action,
}: LedgerEmptyStateProps) {
  return (
    <Card className="text-center py-12 px-4 border border-dashed border-border rounded-xl bg-surface/50 shadow-none">
      <Card.Content className="p-0 flex flex-col items-center">
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
