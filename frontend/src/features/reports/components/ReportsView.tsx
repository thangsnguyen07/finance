'use client';

import { Receipt } from 'lucide-react';
import Link from 'next/link';

import { LedgerLoadingState } from '@/components/feedback';
import { Grid, MonthNavigator, PageHeader, Stack } from '@/components/ui';

import { useCashflowReport } from '../hooks/use-cashflow-report';
import { CashflowBalanceCard } from './CashflowBalanceCard';
import { CashflowTrendChart } from './CashflowTrendChart';
import { CategoryProportionSheet } from './CategoryProportionSheet';

export function ReportsView() {
  const {
    selectedMonth,
    setSelectedMonth,
    formattedMonth,
    isLoading,
    analytics,
  } = useCashflowReport();

  return (
    <Stack gap="xl">
      <PageHeader
        title="Sổ Báo Cáo & Phân Tích Dòng Tiền"
        description="Tổng hợp cán cân thu chi, tỷ lệ tiết kiệm ròng và cơ cấu danh mục"
        actions={
          <>
            <Link
              href="/transactions"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:border-accent"
            >
              <Receipt className="h-3.5 w-3.5 text-accent" />
              <span>Xem nhật ký</span>
            </Link>
            <MonthNavigator month={selectedMonth} onChange={setSelectedMonth} />
          </>
        }
      />

      <CashflowBalanceCard
        selectedMonth={selectedMonth}
        monthNet={analytics.monthNet}
        monthIncome={analytics.monthIncome}
        monthExpense={analytics.monthExpense}
        savingsRate={analytics.savingsRate}
        incomeGroupCount={analytics.incomeBreakdown.length}
        expenseGroupCount={analytics.expenseBreakdown.length}
      />

      {isLoading ? (
        <LedgerLoadingState message="Đang tổng hợp sổ báo cáo dòng tiền..." />
      ) : (
        <>
          <CashflowTrendChart
            points={analytics.sixMonthTrend}
            maxMonthlyValue={analytics.maxMonthlyValue}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />

          <Grid cols={2} gap="lg">
            <CategoryProportionSheet
              title="Cơ cấu chi tiêu theo danh mục"
              subtitle="Tỷ trọng các khoản chi lớn nhất trong kỳ"
              items={analytics.expenseBreakdown}
              totalAmount={analytics.monthExpense}
              emptyMessage={`Chưa có khoản chi tiêu nào trong ${formattedMonth}.`}
            />

            <CategoryProportionSheet
              title="Cơ cấu nguồn thu nhập"
              subtitle="Phân bổ các nguồn tiền đi vào trong kỳ"
              items={analytics.incomeBreakdown}
              totalAmount={analytics.monthIncome}
              emptyMessage={`Chưa có khoản thu nhập nào trong ${formattedMonth}.`}
            />
          </Grid>
        </>
      )}
    </Stack>
  );
}
