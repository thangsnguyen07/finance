import { apiRequest } from '@/lib/api-client';

import type {
  MonthlyBudgetSummaryResponse,
  BudgetResponse,
  UpsertBudgetDto,
} from '../types/budget.types';

export function getMonthlyBudgets(
  month?: string,
): Promise<MonthlyBudgetSummaryResponse> {
  const query = month ? `?month=${encodeURIComponent(month)}` : '';
  return apiRequest<MonthlyBudgetSummaryResponse>(`/budgets${query}`);
}

export function upsertBudget(dto: UpsertBudgetDto): Promise<BudgetResponse> {
  return apiRequest<BudgetResponse>('/budgets', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function deleteBudget(id: string): Promise<void> {
  return apiRequest<void>(`/budgets/${id}`, {
    method: 'DELETE',
  });
}
