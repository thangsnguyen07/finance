'use client';

import { Ruler } from 'lucide-react';

import {
  Card,
  CurrencyText,
  K3WoodenRuler,
  Row,
  Stack,
  Text,
} from '@/components/ui';
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
        <Stack gap="xs">
          <Row gap="sm" className="text-xs text-muted">
            <Ruler className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400" />
            <span>Tổng kế hoạch chi tiêu • {formatMonthDisplay(month)}</span>
            {dayProgress.isCurrentMonth ? (
              <Text as="span" variant="mono" tone="muted">
                (Ngày {dayProgress.currentDay}/{dayProgress.daysInMonth})
              </Text>
            ) : null}
          </Row>
          <Row align="baseline" wrap gap="md">
            <Card.Title className="font-serif text-2xl font-black text-foreground tabular-nums sm:text-3xl">
              {isLoading ? '...' : <CurrencyText amount={totalSpent} />}
            </Card.Title>
            <Text as="span" variant="mono" tone="muted" className="sm:text-sm">
              / hạn mức <CurrencyText amount={totalBudgeted} />
            </Text>
          </Row>
        </Stack>

        <Stack gap="none" className="sm:text-right">
          <Text variant="caption" tone="muted">
            {remainingBudget >= 0
              ? 'Còn được phép chi'
              : 'Đã vượt tổng hạn mức'}
          </Text>
          <CurrencyText
            amount={Math.abs(remainingBudget)}
            type={remainingBudget >= 0 ? 'INCOME' : 'EXPENSE'}
            className="text-base font-bold sm:text-lg"
          />
        </Stack>
      </Card.Header>

      <Stack gap="sm">
        <K3WoodenRuler
          usagePercentage={overallPercent}
          dayPercentage={
            dayProgress.isCurrentMonth && totalBudgeted > 0
              ? dayProgress.dayPercentage
              : undefined
          }
          dayMarkerTooltip={`Nhịp thời gian tháng: Ngày ${dayProgress.currentDay}/${dayProgress.daysInMonth} (${dayProgress.dayPercentage}%)`}
        />

        <Row
          justify="between"
          wrap
          gap="sm"
          className="font-mono text-xs text-muted"
        >
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
        </Row>
      </Stack>
    </Card>
  );
}
