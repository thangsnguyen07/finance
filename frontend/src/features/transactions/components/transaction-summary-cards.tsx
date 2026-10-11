'use client';

import { Card, CurrencyText } from '@/components/ui';

interface TransactionSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
}

export function TransactionSummaryCards({
  totalIncome,
  totalExpense,
}: TransactionSummaryCardsProps) {
  const netCashflow = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card padding="md">
        <Card.Content>
          <Card.Eyebrow>Tổng Thu Nhập (+)</Card.Eyebrow>
          <p className="mt-1">
            <CurrencyText
              amount={totalIncome}
              type="INCOME"
              signed
              className="font-serif text-xl font-bold"
            />
          </p>
        </Card.Content>
      </Card>

      <Card padding="md">
        <Card.Content>
          <Card.Eyebrow>Tổng Chi Tiêu (-)</Card.Eyebrow>
          <p className="mt-1">
            <CurrencyText
              amount={totalExpense}
              type="EXPENSE"
              signed
              className="font-serif text-xl font-bold"
            />
          </p>
        </Card.Content>
      </Card>

      <Card padding="md">
        <Card.Content>
          <Card.Eyebrow>Chênh Lệch Dòng Tiền</Card.Eyebrow>
          <p className="mt-1">
            <CurrencyText
              amount={Math.abs(netCashflow)}
              type={netCashflow >= 0 ? 'INCOME' : 'EXPENSE'}
              signed
              className={`font-serif text-xl font-bold ${
                netCashflow >= 0 ? 'text-ink-primary' : 'text-accent-coral'
              }`}
            />
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
