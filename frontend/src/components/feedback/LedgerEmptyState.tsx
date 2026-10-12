'use client';

import { Card } from '@/components/ui/Card';
import { Stack } from '@/components/ui/Layout';
import { Text } from '@/components/ui/Text';

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
      <Stack gap="sm" className="flex flex-col items-center">
        {icon ? <div className="mb-1 text-muted">{icon}</div> : null}
        <Text variant="title">{title}</Text>
        <Text variant="body" tone="muted" className="mx-auto mb-2 max-w-md">
          {description}
        </Text>
        {action}
      </Stack>
    </Card>
  );
}
