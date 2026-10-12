import { ACCOUNT_TYPE, type AccountResponse } from '@/features/accounts';

import type { MonthlyBudgetSummaryResponse } from '@/features/budgets';

export function computeNetWorthFromAccounts(
  accounts: AccountResponse[] = [],
): number {
  let totalAssets = 0;
  let totalDebt = 0;

  for (const acc of accounts) {
    if (acc.type === ACCOUNT_TYPE.CREDIT_CARD) {
      totalDebt += acc.currentBalance || 0;
    } else {
      totalAssets += acc.currentBalance || 0;
    }
  }

  return totalAssets - totalDebt;
}

export function getDashboardCalendarProgress(now: Date = new Date()) {
  const currentDay = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const currentMonthNumber = now.getMonth() + 1;
  const monthLabel = `T${String(currentMonthNumber).padStart(2, '0')}/${now.getFullYear()}`;

  return {
    currentDay,
    daysInMonth,
    currentMonthNumber,
    monthLabel,
  };
}

export function extractDashboardBudgetSnapshot(
  budgetSummary?: MonthlyBudgetSummaryResponse,
) {
  return {
    totalBudgeted: budgetSummary?.totalBudgeted ?? 0,
    totalSpent: budgetSummary?.totalSpentInBudgeted ?? 0,
    remainingBudget: budgetSummary?.remainingBudget ?? 0,
    usagePercent: budgetSummary?.overallUsagePercentage ?? 0,
  };
}
