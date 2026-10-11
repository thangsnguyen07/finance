'use client';

import { Card } from '@heroui/react';
import { BarChart3 } from 'lucide-react';
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
    <Card className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs">
      <Card.Header className="p-0 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent" />
          <div>
            <Card.Title className="font-serif font-bold text-base text-foreground">
              Biểu đồ đối chiếu Thu – Chi 6 tháng
            </Card.Title>
            <Card.Description className="text-xs text-muted">
              Bấm vào cột tháng bất kỳ để xem chi tiết cơ cấu danh mục của tháng
              đó
            </Card.Description>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="w-2.5 h-2.5 rounded-2xs bg-success inline-block" />
            Thu nhập
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="w-2.5 h-2.5 rounded-2xs bg-danger inline-block" />
            Chi tiêu
          </span>
        </div>
      </Card.Header>

      <Card.Content className="p-0 pt-6">
        <div className="relative h-48 grid grid-cols-6 gap-2 sm:gap-4 items-end pt-4 px-2 border-b border-border bg-[linear-gradient(to_bottom,transparent_24%,var(--border)_25%,transparent_26%,transparent_49%,var(--border)_50%,transparent_51%,transparent_74%,var(--border)_75%,transparent_76%)]">
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
                className={`h-full flex flex-col justify-end items-center group cursor-pointer rounded-t-md px-1 pt-2 transition-colors ${
                  isCurrentSelected
                    ? 'bg-accent/5 ring-1 ring-accent/30'
                    : 'hover:bg-surface-secondary/50'
                }`}
              >
                <div className="w-full max-w-[44px] h-full flex items-end justify-center gap-1 sm:gap-1.5">
                  <div
                    style={{
                      height: `${
                        point.income > 0 ? Math.max(6, incomeHeight) : 2
                      }%`,
                    }}
                    title={`Thu ${point.label}: ${formatVND(point.income)}`}
                    className="w-1/2 bg-success rounded-t-2xs transition-all duration-300"
                  />
                  <div
                    style={{
                      height: `${
                        point.expense > 0 ? Math.max(6, expenseHeight) : 2
                      }%`,
                    }}
                    title={`Chi ${point.label}: ${formatVND(point.expense)}`}
                    className="w-1/2 bg-danger rounded-t-2xs transition-all duration-300"
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-2.5 px-2 text-center">
          {points.map((point) => {
            const isCurrentSelected = point.month === selectedMonth;
            return (
              <button
                key={point.month}
                type="button"
                onClick={() => onSelectMonth(point.month)}
                className={`text-[11px] font-mono cursor-pointer transition-colors ${
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
