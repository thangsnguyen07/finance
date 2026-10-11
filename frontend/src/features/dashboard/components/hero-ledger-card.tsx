'use client';

import Link from 'next/link';
import { Card } from '@heroui/react';
import { K3WoodenRuler } from '@/components/ui/k3-wooden-ruler';
import { formatVND } from '@/lib/formatters';

interface HeroLedgerCardProps {
  netWorth: number;
  isLoading: boolean;
  totalBudgeted: number;
  totalSpent: number;
  remainingBudget: number;
  usagePercent: number;
}

export function HeroLedgerCard({
  netWorth,
  isLoading,
  totalBudgeted,
  totalSpent,
  remainingBudget,
  usagePercent,
}: HeroLedgerCardProps) {
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const currentMonthNumber = now.getMonth() + 1;

  return (
    <Card className="relative bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs overflow-hidden space-y-4">
      <Card.Header className="p-0 flex flex-col items-start">
        <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-muted mb-1">
          Sổ Cái Tổng Hợp • Số Dư Tích Lũy
        </span>
        <Card.Title className="text-3xl sm:text-4xl font-serif font-black text-foreground tracking-tight tabular-nums">
          {isLoading ? '...' : formatVND(netWorth)}
        </Card.Title>
      </Card.Header>

      <Card.Content className="p-0 pt-3 border-t border-border/70 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span>📏 Hạn mức chi tiêu tháng {currentMonthNumber}:</span>
            <span className="text-[10px] text-muted font-normal">
              (Ngày {currentDay}/{daysInMonth})
            </span>
          </span>
          {totalBudgeted > 0 ? (
            <span className="font-mono text-amber-950 dark:text-amber-300 font-bold tabular-nums">
              {formatVND(totalBudgeted)} ({usagePercent}%)
            </span>
          ) : (
            <Link
              href="/budgets"
              className="text-xs font-semibold text-accent hover:underline"
            >
              + Đặt hạn mức tháng →
            </Link>
          )}
        </div>

        <K3WoodenRuler usagePercentage={usagePercent} />

        <div className="flex justify-between text-[10px] text-muted font-mono tabular-nums">
          <span>
            Đã chi: {formatVND(totalSpent)} ({usagePercent}%)
          </span>
          <span className="font-bold text-foreground">
            {remainingBudget >= 0
              ? `Còn lại: ${formatVND(remainingBudget)}`
              : `Vượt hạn mức: ${formatVND(Math.abs(remainingBudget))}`}
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
