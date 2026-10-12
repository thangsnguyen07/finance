'use client';

import { BarChart3 } from 'lucide-react';

import { Card } from '@/components/ui';
import { formatVND } from '@/lib/formatters';

import type { MonthlyCashflowPoint } from '../types/report.types';

interface CashflowTrendChartProps {
  points: MonthlyCashflowPoint[];
  maxMonthlyValue: number;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}

export function CashflowTrendChart({
  points,
  maxMonthlyValue,
  selectedMonth,
  onSelectMonth,
}: CashflowTrendChartProps) {
  return (
    <Card>
      <Card.Header
        bordered
        className="flex-col justify-between gap-2 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-accent" />
          <div>
            <Card.Title>Biểu đồ đối chiếu Thu – Chi 6 tháng</Card.Title>
            <Card.Description>
              Bấm vào cột tháng bất kỳ để xem chi tiết cơ cấu danh mục của tháng
              đó
            </Card.Description>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="rounded-2xs inline-block h-2.5 w-2.5 bg-success" />
            Thu nhập
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="rounded-2xs inline-block h-2.5 w-2.5 bg-danger" />
            Chi tiêu
          </span>
        </div>
      </Card.Header>

      <Card.Content className="pt-2">
        <div className="relative grid h-48 grid-cols-6 items-end gap-2 border-b border-border bg-[linear-gradient(to_bottom,transparent_24%,var(--border)_25%,transparent_26%,transparent_49%,var(--border)_50%,transparent_51%,transparent_74%,var(--border)_75%,transparent_76%)] px-2 pt-4 sm:gap-4">
          {points.map((point) => {
            const isCurrentSelected = point.month === selectedMonth;
            const incomeHeight = Math.round(
              (point.income / maxMonthlyValue) * 100,
            );
            const expenseHeight = Math.round(
              (point.expense / maxMonthlyValue) * 100,
            );

            return (
              <button
                key={point.month}
                type="button"
                onClick={() => onSelectMonth(point.month)}
                className={`group flex h-full cursor-pointer flex-col items-center justify-end rounded-t-md px-1 pt-2 transition-colors ${
                  isCurrentSelected
                    ? 'bg-accent/5 ring-1 ring-accent/30'
                    : 'hover:bg-surface-secondary/50'
                }`}
              >
                <div className="flex h-full w-full max-w-[44px] items-end justify-center gap-1 sm:gap-1.5">
                  <div
                    style={{
                      height: `${
                        point.income > 0 ? Math.max(6, incomeHeight) : 2
                      }%`,
                    }}
                    title={`Thu ${point.label}: ${formatVND(point.income)}`}
                    className="rounded-t-2xs w-1/2 bg-success transition-all duration-300"
                  />
                  <div
                    style={{
                      height: `${
                        point.expense > 0 ? Math.max(6, expenseHeight) : 2
                      }%`,
                    }}
                    title={`Chi ${point.label}: ${formatVND(point.expense)}`}
                    className="rounded-t-2xs w-1/2 bg-danger transition-all duration-300"
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-6 gap-2 px-2 pt-2.5 text-center sm:gap-4">
          {points.map((point) => {
            const isCurrentSelected = point.month === selectedMonth;
            return (
              <button
                key={point.month}
                type="button"
                onClick={() => onSelectMonth(point.month)}
                className={`cursor-pointer font-mono text-[11px] transition-colors ${
                  isCurrentSelected
                    ? 'font-bold text-accent underline underline-offset-4'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {point.label}
              </button>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
}
