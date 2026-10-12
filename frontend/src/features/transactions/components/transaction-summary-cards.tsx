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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card variant="compact">
        <Card.Content>
          <Card.Eyebrow>Tổng Thu Nhập (+)</Card.Eyebrow>
          <p className="mt-1">
            <CurrencyText
              amount={totalIncome}
              type="INCOME"
              signed
              className="text-xl font-serif font-bold"
            />
          </p>
        </Card.Content>
      </Card>

      <Card variant="compact">
        <Card.Content>
          <Card.Eyebrow>Tổng Chi Tiêu (-)</Card.Eyebrow>
          <p className="mt-1">
            <CurrencyText
              amount={totalExpense}
              type="EXPENSE"
              signed
              className="text-xl font-serif font-bold"
            />
          </p>
        </Card.Content>
      </Card>

      <Card variant="compact">
        <Card.Content>
          <Card.Eyebrow>Chênh Lệch Dòng Tiền</Card.Eyebrow>
          <p className="mt-1">
            <CurrencyText
              amount={Math.abs(netCashflow)}
              type={netCashflow >= 0 ? 'INCOME' : 'EXPENSE'}
              signed
              className={`text-xl font-serif font-bold ${
                netCashflow >= 0 ? 'text-foreground' : 'text-danger'
              }`}
            />
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
