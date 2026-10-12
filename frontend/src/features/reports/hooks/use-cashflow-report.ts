'use client';

import { useState } from 'react';

import { useTransactions } from '@/features/transactions';
import { getCurrentMonthString, getSixMonthWindow } from '@/lib/date-utils';
import { formatMonthDisplay } from '@/lib/formatters';

import { computeAnalyticsSinglePass } from '../utils/compute-cashflow-analytics';

export function useCashflowReport() {
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

  return {
    selectedMonth,
    setSelectedMonth,
    formattedMonth: formatMonthDisplay(selectedMonth),
    isLoading,
    analytics,
  };
}
