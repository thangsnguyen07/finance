'use client';

import { Grid, StatCard } from '@/components/ui';

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
    <Grid cols={3} gap="lg">
      <StatCard
        label="Tổng Thu Nhập (+)"
        amount={totalIncome}
        amountType="INCOME"
        signed
      />

      <StatCard
        label="Tổng Chi Tiêu (-)"
        amount={totalExpense}
        amountType="EXPENSE"
        signed
      />

      <StatCard
        label="Chênh Lệch Dòng Tiền"
        amount={Math.abs(netCashflow)}
        amountType={netCashflow >= 0 ? 'INCOME' : 'EXPENSE'}
        signed
      />
    </Grid>
  );
}
