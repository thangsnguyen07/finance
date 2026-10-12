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
    <Card className="relative overflow-hidden space-y-4">
      <Card.Header className="flex-col items-start">
        <Card.Eyebrow className="text-[10px] font-sans mb-1">
          Sổ Cái Tổng Hợp • Số Dư Tích Lũy
        </Card.Eyebrow>
        <Card.Title className="text-3xl sm:text-4xl font-serif font-black text-foreground tracking-tight tabular-nums">
          {isLoading ? '...' : <CurrencyText amount={netWorth} />}
        </Card.Title>
      </Card.Header>

      <Card.Content className="pt-3 border-t border-border/70 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <span>📏 Hạn mức chi tiêu tháng {currentMonthNumber}:</span>
            <span className="text-[10px] text-muted font-normal">
              (Ngày {currentDay}/{daysInMonth})
            </span>
          </span>
          {totalBudgeted > 0 ? (
            <span className="font-mono text-amber-950 dark:text-amber-300 font-bold tabular-nums">
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

        <div className="flex justify-between text-[10px] text-muted font-mono tabular-nums">
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
