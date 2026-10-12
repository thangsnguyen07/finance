'use client';

import { useAccounts } from '@/features/accounts';
import { useBudgets } from '@/features/budgets';
import { useTransactions } from '@/features/transactions';

import {
  computeNetWorthFromAccounts,
  extractDashboardBudgetSnapshot,
  getDashboardCalendarProgress,
} from '../utils/dashboard.utils';

export function useDashboardOverview() {
  const { data: accounts, isLoading } = useAccounts();
  const { data: txData, isLoading: isTxLoading } = useTransactions({
    limit: 5,
  });
  const { data: budgetSummary } = useBudgets();

  const allAccounts = accounts || [];
  const netWorth = computeNetWorthFromAccounts(allAccounts);
  const budgetSnapshot = extractDashboardBudgetSnapshot(budgetSummary);
  const calendarProgress = getDashboardCalendarProgress();

  return {
    allAccounts,
    recentTransactions: txData?.items || [],
    isLoading,
    isTxLoading,
    netWorth,
    ...budgetSnapshot,
    ...calendarProgress,
  };
}
