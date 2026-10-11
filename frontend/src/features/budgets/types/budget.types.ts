export type BudgetStatus = 'SAFE' | 'WARNING' | 'EXCEEDED';

export interface BudgetEnvelopeResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  month: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  status: BudgetStatus;
}

export interface UnbudgetedCategoryResponse {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  spentAmount: number;
}

export interface MonthlyBudgetSummaryResponse {
  month: string;
  totalBudgeted: number;
  totalSpentInBudgeted: number;
  totalSpentAllCategories: number;
  remainingBudget: number;
  overallUsagePercentage: number;
  overallStatus: BudgetStatus;
  envelopes: BudgetEnvelopeResponse[];
  unbudgetedCategories: UnbudgetedCategoryResponse[];
}

export interface BudgetResponse {
  id: string;
  userId: string;
  categoryId: string;
  month: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertBudgetDto {
  categoryId: string;
  month: string;
  amount: number;
}
