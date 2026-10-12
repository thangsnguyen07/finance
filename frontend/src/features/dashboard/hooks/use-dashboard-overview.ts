'use client';

import { useAccounts } from '@/features/accounts';
import { useBudgets } from '@/features/budgets';
import { useTransactions } from '@/features/transactions';

export function useDashboardOverview() {
  const { data: accounts, isLoading } = useAccounts();
  const { data: txData, isLoading: isTxLoading } = useTransactions({
    limit: 5,
  });
  const { data: budgetSummary } = useBudgets();

  const allAccounts = accounts || [];
  const totalAssets = allAccounts
    .filter((a) => a.type !== 'CREDIT_CARD')
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const totalDebt = allAccounts
    .filter((a) => a.type === 'CREDIT_CARD')
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const netWorth = totalAssets - totalDebt;
  const usagePercent = budgetSummary?.overallUsagePercentage ?? 0;

  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const currentMonthNumber = now.getMonth() + 1;
  const monthLabel = `T${String(currentMonthNumber).padStart(2, '0')}/${now.getFullYear()}`;

  return {
    allAccounts,
    recentTransactions: txData?.items || [],
    isLoading,
    isTxLoading,
    netWorth,
    totalBudgeted: budgetSummary?.totalBudgeted ?? 0,
    totalSpent: budgetSummary?.totalSpentInBudgeted ?? 0,
    remainingBudget: budgetSummary?.remainingBudget ?? 0,
    usagePercent,
    currentDay,
    daysInMonth,
    currentMonthNumber,
    monthLabel,
  };
}
