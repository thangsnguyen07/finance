'use client';

import { Ruler } from 'lucide-react';

import { Card, CurrencyText, K3WoodenRuler } from '@/components/ui';
import { formatMonthDisplay } from '@/lib/formatters';

interface BudgetRulerSummaryCardProps {
  month: string;
  dayProgress: {
    currentDay: number;
    daysInMonth: number;
    dayPercentage: number;
    isCurrentMonth: boolean;
  };
  totalSpent: number;
  totalBudgeted: number;
  remainingBudget: number;
  overallPercent: number;
  isLoading: boolean;
}

export function BudgetRulerSummaryCard({
  month,
  dayProgress,
  totalSpent,
  totalBudgeted,
  remainingBudget,
  overallPercent,
  isLoading,
}: BudgetRulerSummaryCardProps) {
  return (
    <Card>
      <Card.Header
        bordered
        className="flex-col items-start justify-between gap-3 sm:flex-row sm:items-end"
      >
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-muted">
            <Ruler className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400" />
            <span>Tổng kế hoạch chi tiêu • {formatMonthDisplay(month)}</span>
            {dayProgress.isCurrentMonth ? (
              <span className="font-mono text-[11px] text-muted">
                (Ngày {dayProgress.currentDay}/{dayProgress.daysInMonth})
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <Card.Title className="font-serif text-2xl font-black text-foreground tabular-nums sm:text-3xl">
              {isLoading ? '...' : <CurrencyText amount={totalSpent} />}
            </Card.Title>
            <span className="font-mono text-xs text-muted tabular-nums sm:text-sm">
              / hạn mức <CurrencyText amount={totalBudgeted} />
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="block text-[11px] text-muted">
            {remainingBudget >= 0
              ? 'Còn được phép chi'
              : 'Đã vượt tổng hạn mức'}
          </span>
          <CurrencyText
            amount={Math.abs(remainingBudget)}
            type={remainingBudget >= 0 ? 'INCOME' : 'EXPENSE'}
            className="text-base font-bold sm:text-lg"
          />
        </div>
      </Card.Header>

      <Card.Content className="space-y-2.5">
        <K3WoodenRuler
          usagePercentage={overallPercent}
          dayPercentage={
            dayProgress.isCurrentMonth && totalBudgeted > 0
              ? dayProgress.dayPercentage
              : undefined
          }
          dayMarkerTooltip={`Nhịp thời gian tháng: Ngày ${dayProgress.currentDay}/${dayProgress.daysInMonth} (${dayProgress.dayPercentage}%)`}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted">
          <span>
            Đã dùng:{' '}
            <strong className="text-foreground">{overallPercent}%</strong> kế
            hoạch
          </span>
          {dayProgress.isCurrentMonth ? (
            <span>
              Nhịp thời gian tháng:{' '}
              <strong className="text-accent">
                {dayProgress.dayPercentage}%
              </strong>{' '}
              ({dayProgress.currentDay}/{dayProgress.daysInMonth} ngày)
            </span>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  );
}
