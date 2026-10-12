'use client';

import { Grid, Stack } from '@/components/ui';

import { useDashboardOverview } from '../hooks/use-dashboard-overview';
import { HeroLedgerCard } from './HeroLedgerCard';
import { PocketWalletCarousel } from './PocketWalletCarousel';
import { PostItReminderCard } from './PostItReminderCard';
import { RecentTransactionsCard } from './RecentTransactionsCard';

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
    <Stack gap="xl">
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

      <Grid cols={3} gap="lg">
        <RecentTransactionsCard
          transactions={recentTransactions}
          isLoading={isTxLoading}
        />
        <PostItReminderCard
          usagePercent={usagePercent}
          monthLabel={monthLabel}
        />
      </Grid>
    </Stack>
  );
}
