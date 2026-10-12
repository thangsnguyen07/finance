'use client';

import { cn } from '@heroui/react';

import { Card } from './Card';
import { CurrencyText } from './CurrencyText';
import { IconBox, type IconBoxTone } from './IconBox';
import { Row, Stack } from './Layout';
import { Text } from './Text';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface StatCardProps {
  label: ReactNode;
  sublabel?: ReactNode;
  amount: number;
  amountType?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  signed?: boolean;
  icon?: LucideIcon;
  iconTone?: IconBoxTone;
  variant?: 'card' | 'inset';
  className?: string;
}

export function StatCard({
  label,
  sublabel,
  amount,
  amountType,
  signed = false,
  icon: Icon,
  iconTone = 'neutral',
  variant = 'card',
  className,
}: StatCardProps) {
  if (variant === 'inset') {
    return (
      <Row
        justify="between"
        className={cn(
          'rounded-lg border border-border/60 bg-surface-secondary/40 p-3.5',
          className,
        )}
      >
        <Row gap="sm">
          {Icon ? (
            <IconBox tone={iconTone} size="sm" shape="circle">
              <Icon className="h-4 w-4" />
            </IconBox>
          ) : null}
          <div>
            <Text as="span" variant="body" tone="muted" className="block">
              {label}
            </Text>
            {sublabel ? (
              <Text as="span" variant="caption" tone="muted">
                {sublabel}
              </Text>
            ) : null}
          </div>
        </Row>
        <CurrencyText
          amount={amount}
          type={amountType}
          signed={signed}
          className="text-base font-bold"
        />
      </Row>
    );
  }

  return (
    <Card variant="compact" className={className}>
      <Stack gap="xs">
        <Row gap="xs" className="text-xs text-muted">
          {Icon ? (
            <IconBox
              tone={iconTone}
              size="sm"
              shape="circle"
              className="h-5 w-5"
            >
              <Icon className="h-3.5 w-3.5" />
            </IconBox>
          ) : null}
          <Text variant="body" tone="muted">
            {label}
          </Text>
        </Row>
        <CurrencyText
          amount={amount}
          type={amountType}
          signed={signed}
          className="text-lg font-bold"
        />
        {sublabel ? (
          <Text variant="caption" tone="muted">
            {sublabel}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
