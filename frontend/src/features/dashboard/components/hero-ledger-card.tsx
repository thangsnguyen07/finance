'use client';

import Link from 'next/link';

import { Card, CurrencyText, K3WoodenRuler } from '@/components/ui';

interface HeroLedgerCardProps {
  netWorth: number;
  isLoading: boolean;
  totalBudgeted: number;
  totalSpent: number;
  remainingBudget: number;
  usagePercent: number;
  currentDay: number;
  daysInMonth: number;
  currentMonthNumber: number;
}

export function HeroLedgerCard({
  netWorth,
  isLoading,
  totalBudgeted,
  totalSpent,
  remainingBudget,
  usagePercent,
  currentDay,
  daysInMonth,
  currentMonthNumber,
}: HeroLedgerCardProps) {
  return (
    <Card className="relative space-y-4 overflow-hidden">
      <Card.Header className="flex-col items-start">
        <Card.Eyebrow className="mb-1 font-sans text-[10px]">
          Sổ Cái Tổng Hợp • Số Dư Tích Lũy
        </Card.Eyebrow>
        <Card.Title className="font-serif text-3xl font-black tracking-tight text-foreground tabular-nums sm:text-4xl">
          {isLoading ? '...' : <CurrencyText amount={netWorth} />}
        </Card.Title>
      </Card.Header>

      <Card.Content className="space-y-2 border-t border-border/70 pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-foreground">
            <span>📏 Hạn mức chi tiêu tháng {currentMonthNumber}:</span>
            <span className="text-[10px] font-normal text-muted">
              (Ngày {currentDay}/{daysInMonth})
            </span>
          </span>
          {totalBudgeted > 0 ? (
            <span className="font-mono font-bold text-amber-950 tabular-nums dark:text-amber-300">
              <CurrencyText amount={totalBudgeted} /> ({usagePercent}%)
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

        <div className="flex justify-between font-mono text-[10px] text-muted tabular-nums">
          <span>
            Đã chi: <CurrencyText amount={totalSpent} /> ({usagePercent}%)
          </span>
          <span className="font-bold text-foreground">
            {remainingBudget >= 0 ? (
              <>
                Còn lại: <CurrencyText amount={remainingBudget} />
              </>
            ) : (
              <>
                Vượt hạn mức:{' '}
                <CurrencyText amount={Math.abs(remainingBudget)} />
              </>
            )}
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
