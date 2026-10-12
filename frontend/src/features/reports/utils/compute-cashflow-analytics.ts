import {
  TRANSACTION_TYPE,
  type TransactionResponse,
} from '@/features/transactions';
import { formatShortMonthLabel } from '@/lib/formatters';

import {
  EXPENSE_PALETTE,
  INCOME_PALETTE,
  REPORT_DEFAULTS,
  REPORT_FALLBACK_CATEGORIES,
} from '../constants/report.constants';

import type {
  CategoryBreakdownItem,
  MonthlyCashflowPoint,
  ReportsAnalyticsData,
} from '../types/report.types';

export function computeAnalyticsSinglePass(
  transactions: TransactionResponse[],
  selectedMonth: string,
  monthsWindow: string[],
): ReportsAnalyticsData {
  const monthPointMap = new Map<string, { income: number; expense: number }>();
  for (const m of monthsWindow) {
    monthPointMap.set(m, { income: 0, expense: 0 });
  }

  const expenseCatMap = new Map<
    string,
    { name: string; color: string | null; amount: number; count: number }
  >();
  const incomeCatMap = new Map<
    string,
    { name: string; color: string | null; amount: number; count: number }
  >();

  let monthIncome = 0;
  let monthExpense = 0;

  for (const tx of transactions) {
    const txMonth = tx.transactionDate.slice(0, 7);
    const bucket = monthPointMap.get(txMonth);

    if (bucket) {
      if (tx.type === TRANSACTION_TYPE.INCOME) {
        bucket.income += tx.amount;
      } else if (tx.type === TRANSACTION_TYPE.EXPENSE) {
        bucket.expense += tx.amount;
      }
    }

    if (txMonth === selectedMonth) {
      if (tx.type === TRANSACTION_TYPE.EXPENSE) {
        monthExpense += tx.amount;
        const catId =
          tx.categoryId || REPORT_FALLBACK_CATEGORIES.UNCATEGORIZED_EXPENSE_ID;
        const catName =
          tx.category?.name ||
          REPORT_FALLBACK_CATEGORIES.UNCATEGORIZED_EXPENSE_LABEL;
        const existing = expenseCatMap.get(catId);
        if (existing) {
          existing.amount += tx.amount;
          existing.count += 1;
        } else {
          expenseCatMap.set(catId, {
            name: catName,
            color: tx.category?.color || null,
            amount: tx.amount,
            count: 1,
          });
        }
      } else if (tx.type === TRANSACTION_TYPE.INCOME) {
        monthIncome += tx.amount;
        const catId =
          tx.categoryId || REPORT_FALLBACK_CATEGORIES.UNCATEGORIZED_INCOME_ID;
        const catName =
          tx.category?.name ||
          REPORT_FALLBACK_CATEGORIES.UNCATEGORIZED_INCOME_LABEL;
        const existing = incomeCatMap.get(catId);
        if (existing) {
          existing.amount += tx.amount;
          existing.count += 1;
        } else {
          incomeCatMap.set(catId, {
            name: catName,
            color: tx.category?.color || null,
            amount: tx.amount,
            count: 1,
          });
        }
      }
    }
  }

  const sixMonthTrend: MonthlyCashflowPoint[] = [];
  let maxMonthlyValue = 1;

  for (const m of monthsWindow) {
    const point = monthPointMap.get(m) || { income: 0, expense: 0 };
    const peak = Math.max(point.income, point.expense);
    if (peak > maxMonthlyValue) {
      maxMonthlyValue = peak;
    }
    sixMonthTrend.push({
      month: m,
      label: formatShortMonthLabel(m),
      income: point.income,
      expense: point.expense,
      net: point.income - point.expense,
    });
  }

  const expenseBreakdown: CategoryBreakdownItem[] = Array.from(
    expenseCatMap.entries(),
  )
    .map(([categoryId, item], idx) => ({
      categoryId,
      categoryName: item.name,
      color:
        item.color ||
        EXPENSE_PALETTE[idx % EXPENSE_PALETTE.length] ||
        REPORT_DEFAULTS.DEFAULT_EXPENSE_COLOR,
      amount: item.amount,
      count: item.count,
      percentage:
        monthExpense > 0
          ? Math.round((item.amount / monthExpense) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const incomeBreakdown: CategoryBreakdownItem[] = Array.from(
    incomeCatMap.entries(),
  )
    .map(([categoryId, item], idx) => ({
      categoryId,
      categoryName: item.name,
      color:
        item.color ||
        INCOME_PALETTE[idx % INCOME_PALETTE.length] ||
        REPORT_DEFAULTS.DEFAULT_INCOME_COLOR,
      amount: item.amount,
      count: item.count,
      percentage:
        monthIncome > 0
          ? Math.round((item.amount / monthIncome) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const monthNet = monthIncome - monthExpense;
  const savingsRate =
    monthIncome > 0
      ? Math.round(((monthIncome - monthExpense) / monthIncome) * 1000) / 10
      : 0;

  return {
    selectedMonth,
    monthIncome,
    monthExpense,
    monthNet,
    savingsRate,
    sixMonthTrend,
    maxMonthlyValue,
    expenseBreakdown,
    incomeBreakdown,
  };
}
