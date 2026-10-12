import type {
  MonthlyBudgetSummaryResponse,
  UpsertBudgetDto,
} from '../types/budget.types';
import type { CategoryResponse } from '@/features/categories';

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
    (c) => c.type === 'EXPENSE',
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
    return { error: 'Vui lòng chọn một danh mục chi tiêu' };
  }

  if (input.effectiveAmount < 1000) {
    return { error: 'Vui lòng đặt hạn mức tối thiểu từ 1.000 ₫ trở lên' };
  }

  return {
    dto: {
      categoryId: input.effectiveCategoryId,
      month: input.month,
      amount: input.effectiveAmount,
    },
  };
}
