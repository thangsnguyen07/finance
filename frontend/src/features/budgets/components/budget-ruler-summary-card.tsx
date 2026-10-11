'use client';

import { Card } from '@heroui/react';
import { Ruler } from 'lucide-react';
import { K3WoodenRuler } from '@/components/ui/k3-wooden-ruler';
import { formatMonthDisplay, formatVND } from '@/lib/formatters';
import { getMonthDayProgress } from '@/lib/date-utils';

interface BudgetRulerSummaryCardProps {
  month: string;
  totalSpent: number;
  totalBudgeted: number;
  remainingBudget: number;
  overallPercent: number;
  isLoading: boolean;
}

export function BudgetRulerSummaryCard({
  month,
  totalSpent,
  totalBudgeted,
  remainingBudget,
  overallPercent,
  isLoading,
}: BudgetRulerSummaryCardProps) {
  const dayProgress = getMonthDayProgress(month);

  return (
    <Card className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs">
      <Card.Header className="p-0 pb-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <Ruler className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>Tổng kế hoạch chi tiêu • {formatMonthDisplay(month)}</span>
            {dayProgress.isCurrentMonth ? (
              <span className="font-mono text-[11px] text-muted">
                (Ngày {dayProgress.currentDay}/{dayProgress.daysInMonth})
              </span>
            ) : null}
          </div>
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <Card.Title className="text-2xl sm:text-3xl font-serif font-black text-foreground tabular-nums">
              {isLoading ? '...' : formatVND(totalSpent)}
            </Card.Title>
            <span className="text-xs sm:text-sm font-mono text-muted tabular-nums">
              / hạn mức {formatVND(totalBudgeted)}
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-[11px] text-muted block">
            {remainingBudget >= 0
              ? 'Còn được phép chi'
              : 'Đã vượt tổng hạn mức'}
          </span>
          <span
            className={`font-mono text-base sm:text-lg font-bold tabular-nums ${
              remainingBudget >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {formatVND(Math.abs(remainingBudget))}
          </span>
        </div>
      </Card.Header>

      <Card.Content className="p-0 pt-4 space-y-2.5">
        <K3WoodenRuler
          usagePercentage={overallPercent}
          dayPercentage={
            dayProgress.isCurrentMonth && totalBudgeted > 0
              ? dayProgress.dayPercentage
              : undefined
          }
          dayMarkerTooltip={`Nhịp thời gian tháng: Ngày ${dayProgress.currentDay}/${dayProgress.daysInMonth} (${dayProgress.dayPercentage}%)`}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted font-mono">
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
