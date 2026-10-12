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
        className="flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <span className="text-xs text-muted block">
            Thặng dư / Thâm hụt ròng • {formatMonthDisplay(selectedMonth)}
          </span>
          <Card.Title className="text-2xl sm:text-3xl font-serif font-black mt-1">
            <CurrencyText
              amount={Math.abs(monthNet)}
              type={monthNet >= 0 ? 'INCOME' : 'EXPENSE'}
              signed={monthNet !== 0}
              className={
                monthNet >= 0 ? 'text-foreground' : 'text-danger'
              }
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

      <Card.Content className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <CurrencyText
            amount={monthIncome}
            type="INCOME"
            signed
            className="text-base font-bold"
          />
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
