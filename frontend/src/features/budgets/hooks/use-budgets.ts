import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getMonthlyBudgets,
  upsertBudget,
  deleteBudget,
} from '../services/budgets.api';

import type { UpsertBudgetDto } from '../types/budget.types';

export const BUDGETS_QUERY_KEY = ['budgets'];

export function useBudgets(month?: string) {
  return useQuery({
    queryKey: [...BUDGETS_QUERY_KEY, month ?? 'current'],
    queryFn: () => getMonthlyBudgets(month),
  });
}

export function useUpsertBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpsertBudgetDto) => upsertBudget(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}
