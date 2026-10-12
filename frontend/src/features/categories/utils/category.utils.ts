import type {
  CategoryResponse,
  CategoryType,
  CreateCategoryDto,
} from '../types/category.types';

export function splitCategoriesByType(categories: CategoryResponse[] = []) {
  return {
    expenseCategories: categories.filter((c) => c.type === 'EXPENSE'),
    incomeCategories: categories.filter((c) => c.type === 'INCOME'),
  };
}

export function getDefaultCategoryColor(type: CategoryType): string {
  return type === 'EXPENSE' ? '#991B1B' : '#166534';
}

export function validateAndBuildCreateCategoryDto(input: {
  name: string;
  type: CategoryType;
  color: string;
}): { dto?: CreateCategoryDto; error?: string } {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    return { error: 'Vui lòng nhập tên danh mục' };
  }

  return {
    dto: {
      name: trimmedName,
      type: input.type,
      color: input.color,
    },
  };
}
