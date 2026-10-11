'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, Badge, CurrencyText } from '@/components/ui';
import { formatMonthDisplay } from '@/lib/formatters';

function SurplusSavingsBadge({ rate }: { rate: number }) {
  return (
    <Badge size="sm" color="success" variant="soft" mono>
      Giữ lại được {rate}% thu nhập
    </Badge>
  );
}

function DeficitSavingsBadge() {
  return (
    <Badge size="sm" color="danger" variant="soft" mono>
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
        className="flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div>
          <span className="block text-xs text-ink-secondary">
            Thặng dư / Thâm hụt ròng • {formatMonthDisplay(selectedMonth)}
          </span>
          <Card.Title className="mt-1 text-2xl font-black sm:text-3xl">
            <CurrencyText
              amount={Math.abs(monthNet)}
              type={monthNet >= 0 ? 'INCOME' : 'EXPENSE'}
              signed
              className={
                monthNet >= 0 ? 'text-ink-primary' : 'text-accent-coral'
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

      <Card.Content className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-ledger-border/60 bg-paper-muted/40 p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-teal/10 text-accent-teal">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs text-ink-secondary">
                Tổng dòng thu
              </span>
              <span className="text-[11px] text-ink-secondary">
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

        <div className="flex items-center justify-between rounded-lg border border-ledger-border/60 bg-paper-muted/40 p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-coral/10 text-accent-coral">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs text-ink-secondary">
                Tổng dòng chi
              </span>
              <span className="text-[11px] text-ink-secondary">
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
