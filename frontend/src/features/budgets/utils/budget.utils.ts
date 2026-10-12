import { CATEGORY_TYPE, type CategoryResponse } from '@/features/categories';

import { BUDGET_LIMITS, BUDGET_MESSAGES } from '../constants/budget.constants';

import type {
  MonthlyBudgetSummaryResponse,
  UpsertBudgetDto,
} from '../types/budget.types';

export function extractBudgetSummaryMetrics(
  summary?: MonthlyBudgetSummaryResponse,
) {
  return {
    totalSpent: summary?.totalSpentInBudgeted ?? 0,
    totalBudgeted: summary?.totalBudgeted ?? 0,
    remainingBudget: summary?.remainingBudget ?? 0,
    overallPercent: summary?.overallUsagePercentage ?? 0,
    envelopes: summary?.envelopes ?? [],
    unbudgetedCategories: summary?.unbudgetedCategories ?? [],
  };
}

export function resolveUpsertBudgetSelections(input: {
  categories: CategoryResponse[];
  selectedCategoryId: string;
  initialCategoryId?: string;
  rawAmount: number | null;
  initialAmount?: number;
}) {
  const expenseCategories = input.categories.filter(
    (c) => c.type === CATEGORY_TYPE.EXPENSE,
  );
  const effectiveCategoryId =
    input.selectedCategoryId ||
    input.initialCategoryId ||
    expenseCategories[0]?.id ||
    '';
  const effectiveAmount =
    input.rawAmount !== null ? input.rawAmount : (input.initialAmount ?? 0);

  return {
    expenseCategories,
    effectiveCategoryId,
    effectiveAmount,
  };
}

export function validateAndBuildUpsertBudgetDto(input: {
  month: string;
  effectiveCategoryId: string;
  effectiveAmount: number;
}): { dto?: UpsertBudgetDto; error?: string } {
  if (!input.effectiveCategoryId) {
    return { error: BUDGET_MESSAGES.CATEGORY_REQUIRED };
  }

  if (input.effectiveAmount < BUDGET_LIMITS.MIN_BUDGET_AMOUNT) {
    return { error: BUDGET_MESSAGES.MIN_AMOUNT_REQUIRED };
  }

  return {
    dto: {
      categoryId: input.effectiveCategoryId,
      month: input.month,
      amount: input.effectiveAmount,
    },
  };
}
