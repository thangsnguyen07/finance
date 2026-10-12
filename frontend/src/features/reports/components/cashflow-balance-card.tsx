'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { Card, Badge, CurrencyText } from '@/components/ui';
import { formatMonthDisplay } from '@/lib/formatters';

function SurplusSavingsBadge({ rate }: { rate: number }) {
  return (
    <Badge
      size="sm"
      color="success"
      variant="soft"
      mono
      className="text-xs font-semibold"
    >
      Giữ lại được {rate}% thu nhập
    </Badge>
  );
}

function DeficitSavingsBadge() {
  return (
    <Badge
      size="sm"
      color="danger"
      variant="soft"
      mono
      className="text-xs font-semibold"
    >
      Chi vượt thu trong kỳ
    </Badge>
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
    <Card>
      <Card.Header
        bordered
        className="flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div>
          <span className="block text-xs text-muted">
            Thặng dư / Thâm hụt ròng • {formatMonthDisplay(selectedMonth)}
          </span>
          <Card.Title className="mt-1 font-serif text-2xl font-black sm:text-3xl">
            <CurrencyText
              amount={Math.abs(monthNet)}
              type={monthNet >= 0 ? 'INCOME' : 'EXPENSE'}
              signed={monthNet !== 0}
              className={monthNet >= 0 ? 'text-foreground' : 'text-danger'}
            />
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

      <Card.Content className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-secondary/40 p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs text-muted">Tổng dòng thu</span>
              <span className="text-[11px] text-muted">
                {incomeGroupCount} nhóm nguồn thu
              </span>
            </div>
          </div>
          <CurrencyText
            amount={monthIncome}
            type="INCOME"
            signed
            className="text-base font-bold"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-secondary/40 p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/10 text-danger">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs text-muted">Tổng dòng chi</span>
              <span className="text-[11px] text-muted">
                {expenseGroupCount} nhóm chi tiêu
              </span>
            </div>
          </div>
          <CurrencyText
            amount={monthExpense}
            type="EXPENSE"
            signed
            className="text-base font-bold"
          />
        </div>
      </Card.Content>
    </Card>
  );
}
