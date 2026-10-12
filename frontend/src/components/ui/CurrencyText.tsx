'use client';

import { cn } from '@heroui/react';

import { formatVND } from '@/lib/formatters';

import type { HTMLAttributes } from 'react';

export interface CurrencyTextProps extends HTMLAttributes<HTMLSpanElement> {
  amount: string | number;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  signed?: boolean;
}

export function CurrencyText({
  amount,
  type,
  signed = false,
  className,
  ...props
}: CurrencyTextProps) {
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  const prefix =
    signed && type === 'INCOME' ? '+' : signed && type === 'EXPENSE' ? '-' : '';

  return (
    <span
      className={cn(
        'font-mono tracking-tight tabular-nums',
        type === 'INCOME' && 'text-success',
        type === 'EXPENSE' && 'text-danger',
        type === 'TRANSFER' && 'text-accent',
        className,
      )}
      {...props}
    >
      {prefix}
      {formatVND(numericAmount)}
    </span>
  );
}
