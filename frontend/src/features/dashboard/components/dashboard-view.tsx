'use client';

import { useDashboardOverview } from '../hooks/use-dashboard-overview';
import { HeroLedgerCard } from './hero-ledger-card';
import { PocketWalletCarousel } from './pocket-wallet-carousel';
import { PostItReminderCard } from './post-it-reminder-card';
import { RecentTransactionsCard } from './recent-transactions-card';

export function DashboardView() {
  const {
    allAccounts,
    recentTransactions,
    isLoading,
    isTxLoading,
    netWorth,
    totalBudgeted,
    totalSpent,
    remainingBudget,
    usagePercent,
    currentDay,
    daysInMonth,
    currentMonthNumber,
    monthLabel,
  } = useDashboardOverview();

  return (
    <div className="space-y-6">
      <HeroLedgerCard
        netWorth={netWorth}
        isLoading={isLoading}
        totalBudgeted={totalBudgeted}
        totalSpent={totalSpent}
        remainingBudget={remainingBudget}
        usagePercent={usagePercent}
        currentDay={currentDay}
        daysInMonth={daysInMonth}
        currentMonthNumber={currentMonthNumber}
      />

      <PocketWalletCarousel accounts={allAccounts} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RecentTransactionsCard
          transactions={recentTransactions}
          isLoading={isTxLoading}
        />
        <PostItReminderCard
          usagePercent={usagePercent}
          monthLabel={monthLabel}
        />
      </div>
    </div>
  );
}
