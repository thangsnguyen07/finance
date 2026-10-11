import type {
  MonthlyBudgetSummaryResponse,
  BudgetResponse,
  UpsertBudgetDto,
} from '@/types/api';

const API_BASE =
  process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000/api/v1';
const DEV_USER_ID = 'dev_user_default';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}`;
    try {
      const errorJson = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(errorJson.message)) {
        errorMessage = errorJson.message.join(', ');
      } else if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function getMonthlyBudgets(
  month?: string,
): Promise<MonthlyBudgetSummaryResponse> {
  const query = month ? `?month=${encodeURIComponent(month)}` : '';
  const res = await fetch(`${API_BASE}/budgets${query}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
  });
  return handleResponse<MonthlyBudgetSummaryResponse>(res);
}

export async function upsertBudget(
  dto: UpsertBudgetDto,
): Promise<BudgetResponse> {
  const res = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
    body: JSON.stringify(dto),
  });
  return handleResponse<BudgetResponse>(res);
}

export async function deleteBudget(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': DEV_USER_ID,
    },
  });
  return handleResponse<void>(res);
}
