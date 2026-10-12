'use client';

import { cn } from '@heroui/react';

import { formatVND } from '@/lib/formatters';

interface CurrencyTextProps {
  amount: string | number;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  signed?: boolean;
  className?: string;
}

export function CurrencyText({
  amount,
  type,
  signed = false,
  className,
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
    >
      {prefix}
      {formatVND(numericAmount)}
    </span>
  );
}
