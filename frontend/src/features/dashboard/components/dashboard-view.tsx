'use client';

import { useAccounts } from '@/features/accounts';
import { useBudgets } from '@/features/budgets';
import { useTransactions } from '@/features/transactions';

import { HeroLedgerCard } from './hero-ledger-card';
import { PocketWalletCarousel } from './pocket-wallet-carousel';
import { PostItReminderCard } from './post-it-reminder-card';
import { RecentTransactionsCard } from './recent-transactions-card';

export function DashboardView() {
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

  return (
    <div className="space-y-6">
      <HeroLedgerCard
        netWorth={netWorth}
        isLoading={isLoading}
        totalBudgeted={budgetSummary?.totalBudgeted ?? 0}
        totalSpent={budgetSummary?.totalSpentInBudgeted ?? 0}
        remainingBudget={budgetSummary?.remainingBudget ?? 0}
        usagePercent={usagePercent}
      />

      <PocketWalletCarousel accounts={allAccounts} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RecentTransactionsCard
          transactions={txData?.items || []}
          isLoading={isTxLoading}
        />
        <PostItReminderCard usagePercent={usagePercent} />
      </div>
    </div>
  );
}
