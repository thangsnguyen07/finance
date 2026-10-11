'use client';

import { Card } from '@heroui/react';
import { formatVND } from '@/lib/formatters';

interface TransactionSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
}

export function TransactionSummaryCards({
  totalIncome,
  totalExpense,
}: TransactionSummaryCardsProps) {
  const netCashflow = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4 bg-surface border border-border rounded-xl shadow-xs">
        <Card.Content className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Tổng Thu Nhập (+)
          </span>
          <span className="text-xl font-serif font-bold text-success mt-1 block tabular-nums">
            +{formatVND(totalIncome)}
          </span>
        </Card.Content>
      </Card>

      <Card className="p-4 bg-surface border border-border rounded-xl shadow-xs">
        <Card.Content className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Tổng Chi Tiêu (-)
          </span>
          <span className="text-xl font-serif font-bold text-danger mt-1 block tabular-nums">
            -{formatVND(totalExpense)}
          </span>
        </Card.Content>
      </Card>

      <Card className="p-4 bg-surface border border-border rounded-xl shadow-xs">
        <Card.Content className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Chênh Lệch Dòng Tiền
          </span>
          <span
            className={`text-xl font-serif font-bold mt-1 block tabular-nums ${
              netCashflow >= 0 ? 'text-foreground' : 'text-danger'
            }`}
          >
            {netCashflow >= 0 ? '+' : ''}
            {formatVND(netCashflow)}
          </span>
        </Card.Content>
      </Card>
    </div>
  );
}
