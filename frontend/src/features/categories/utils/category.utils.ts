import {
  CATEGORY_MESSAGES,
  DEFAULT_CATEGORY_COLORS,
} from '../constants/category.constants';
import {
  CATEGORY_TYPE,
  type CategoryResponse,
  type CategoryType,
  type CreateCategoryDto,
} from '../types/category.types';

export function splitCategoriesByType(categories: CategoryResponse[] = []) {
  return {
    expenseCategories: categories.filter(
      (c) => c.type === CATEGORY_TYPE.EXPENSE,
    ),
    incomeCategories: categories.filter((c) => c.type === CATEGORY_TYPE.INCOME),
  };
}

export function getDefaultCategoryColor(type: CategoryType): string {
  return DEFAULT_CATEGORY_COLORS[type];
}

export function validateAndBuildCreateCategoryDto(input: {
  name: string;
  type: CategoryType;
  color: string;
}): { dto?: CreateCategoryDto; error?: string } {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    return { error: CATEGORY_MESSAGES.NAME_REQUIRED };
  }

  return {
    dto: {
      name: trimmedName,
      type: input.type,
      color: input.color,
    },
  };
}
