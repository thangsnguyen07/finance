import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory } from '@/lib/api/categories';
import { BUDGETS_QUERY_KEY } from './use-budgets';
import type { CategoryType, CreateCategoryDto } from '@/types/api';

export const CATEGORIES_QUERY_KEY = ['categories'];

export function useCategories(type?: CategoryType) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, { type }],
    queryFn: () => getCategories(type),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}
