'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Receipt } from 'lucide-react';
import { PageHeader, MonthNavigator } from '@/components/ui';
import { LedgerLoadingState } from '@/components/feedback';
import { formatMonthDisplay } from '@/lib/formatters';
import { getCurrentMonthString, getSixMonthWindow } from '@/lib/date-utils';
import { useTransactions } from '@/features/transactions';
import { computeAnalyticsSinglePass } from '../utils/compute-cashflow-analytics';
import { CashflowBalanceCard } from './cashflow-balance-card';
import { CashflowTrendChart } from './cashflow-trend-chart';
import { CategoryProportionSheet } from './category-proportion-sheet';

export function ReportsView() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentMonthString,
  );

  const windowRange = getSixMonthWindow(selectedMonth);
  const { data: txData, isLoading } = useTransactions({
    startDate: windowRange.startDate,
    endDate: windowRange.endDate,
    limit: 200,
  });

  const analytics = computeAnalyticsSinglePass(
    txData?.items || [],
    selectedMonth,
    windowRange.months,
  );

  return (
    <div className="space-y-6">
      <PageHeader.Root>
        <PageHeader.Content
          title="Sổ Báo Cáo & Phân Tích Dòng Tiền"
          description="Tổng hợp cán cân thu chi, tỷ lệ tiết kiệm ròng và cơ cấu danh mục"
        />
        <PageHeader.Actions>
          <Link
            href="/transactions"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-ledger-border bg-paper-surface px-3 py-2 text-xs font-medium text-ink-primary shadow-2xs transition-colors hover:border-accent-coral"
          >
            <Receipt className="h-3.5 w-3.5 text-accent-coral" />
            <span>Xem nhật ký</span>
          </Link>
          <MonthNavigator month={selectedMonth} onChange={setSelectedMonth} />
        </PageHeader.Actions>
      </PageHeader.Root>

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

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <CategoryProportionSheet.Root
              items={analytics.expenseBreakdown}
              totalAmount={analytics.monthExpense}
              emptyMessage={`Chưa có khoản chi tiêu nào trong ${formatMonthDisplay(selectedMonth)}.`}
            >
              <div>
                <CategoryProportionSheet.Header
                  title="Cơ cấu chi tiêu theo danh mục"
                  subtitle="Tỷ trọng các khoản chi lớn nhất trong kỳ"
                />
                <CategoryProportionSheet.SegmentedBar />
                <CategoryProportionSheet.List />
              </div>
            </CategoryProportionSheet.Root>

            <CategoryProportionSheet.Root
              items={analytics.incomeBreakdown}
              totalAmount={analytics.monthIncome}
              emptyMessage={`Chưa có khoản thu nhập nào trong ${formatMonthDisplay(selectedMonth)}.`}
            >
              <div>
                <CategoryProportionSheet.Header
                  title="Cơ cấu nguồn thu nhập"
                  subtitle="Phân bổ các nguồn tiền đi vào trong kỳ"
                />
                <CategoryProportionSheet.SegmentedBar />
                <CategoryProportionSheet.List />
              </div>
            </CategoryProportionSheet.Root>
          </div>
        </>
      )}
    </div>
  );
}
