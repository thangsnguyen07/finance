'use client';

import { useState } from 'react';

import { useTransactions } from '@/features/transactions';
import { getCurrentMonthString, getSixMonthWindow } from '@/lib/date-utils';
import { formatMonthDisplay } from '@/lib/formatters';

import { REPORT_DEFAULTS } from '../constants/report.constants';
import { computeAnalyticsSinglePass } from '../utils/compute-cashflow-analytics';

export function useCashflowReport() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentMonthString,
  );
  const { months, startDate, endDate } = getSixMonthWindow(selectedMonth);

  const { data: txData, isLoading: isTxLoading } = useTransactions({
    startDate,
    endDate,
    limit: REPORT_DEFAULTS.TRANSACTIONS_FETCH_LIMIT,
  });

  const analytics = computeAnalyticsSinglePass(
    txData?.items || [],
    selectedMonth,
    months,
  );

  return {
    selectedMonth,
    setSelectedMonth,
    formattedMonth: formatMonthDisplay(selectedMonth),
    analytics,
    isLoading: isTxLoading,
  };
}
