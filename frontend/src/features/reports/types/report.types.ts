export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyCashflowPoint {
  month: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export interface ReportsAnalyticsData {
  selectedMonth: string;
  monthIncome: number;
  monthExpense: number;
  monthNet: number;
  savingsRate: number;
  sixMonthTrend: MonthlyCashflowPoint[];
  maxMonthlyValue: number;
  expenseBreakdown: CategoryBreakdownItem[];
  incomeBreakdown: CategoryBreakdownItem[];
}
