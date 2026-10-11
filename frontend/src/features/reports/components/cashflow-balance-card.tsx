'use client';

import { Card, Chip } from '@heroui/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatMonthDisplay, formatVND } from '@/lib/formatters';

function SurplusSavingsBadge({ rate }: { rate: number }) {
  return (
    <Chip
      size="sm"
      color="success"
      variant="soft"
      className="font-mono text-xs font-semibold"
    >
      Giữ lại được {rate}% thu nhập
    </Chip>
  );
}

function DeficitSavingsBadge() {
  return (
    <Chip
      size="sm"
      color="danger"
      variant="soft"
      className="font-mono text-xs font-semibold"
    >
      Chi vượt thu trong kỳ
    </Chip>
  );
}

interface CashflowBalanceCardProps {
  selectedMonth: string;
  monthNet: number;
  monthIncome: number;
  monthExpense: number;
  savingsRate: number;
  incomeGroupCount: number;
  expenseGroupCount: number;
}

export function CashflowBalanceCard({
  selectedMonth,
  monthNet,
  monthIncome,
  monthExpense,
  savingsRate,
  incomeGroupCount,
  expenseGroupCount,
}: CashflowBalanceCardProps) {
  return (
    <Card className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs">
      <Card.Header className="p-0 pb-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-muted block">
            Thặng dư / Thâm hụt ròng • {formatMonthDisplay(selectedMonth)}
          </span>
          <Card.Title
            className={`text-2xl sm:text-3xl font-serif font-black mt-1 tabular-nums ${
              monthNet >= 0 ? 'text-foreground' : 'text-danger'
            }`}
          >
            {monthNet > 0 ? '+' : ''}
            {formatVND(monthNet)}
          </Card.Title>
        </div>

        {monthIncome > 0 ? (
          monthNet >= 0 ? (
            <SurplusSavingsBadge rate={savingsRate} />
          ) : (
            <DeficitSavingsBadge />
          )
        ) : null}
      </Card.Header>

      <Card.Content className="p-0 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-secondary/40 border border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-muted block">Tổng dòng thu</span>
              <span className="text-[11px] text-muted">
                {incomeGroupCount} nhóm nguồn thu
              </span>
            </div>
          </div>
          <span className="font-mono text-base font-bold text-success tabular-nums">
            +{formatVND(monthIncome)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-secondary/40 border border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-muted block">Tổng dòng chi</span>
              <span className="text-[11px] text-muted">
                {expenseGroupCount} nhóm chi tiêu
              </span>
            </div>
          </div>
          <span className="font-mono text-base font-bold text-danger tabular-nums">
            -{formatVND(monthExpense)}
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
