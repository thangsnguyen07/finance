import type {
  CreateTransactionDto,
  PaginatedTransactionsResponse,
  QueryTransactionsParams,
  TransactionResponse,
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
    return {} as T;
  }

  return res.json() as Promise<T>;
}

export async function getTransactions(
  params?: QueryTransactionsParams,
): Promise<PaginatedTransactionsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.accountId) searchParams.set('accountId', params.accountId);
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const queryString = searchParams.toString();
  const url = `${API_BASE}/transactions${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
  });
  return handleResponse<PaginatedTransactionsResponse>(res);
}

export async function createTransaction(
  dto: CreateTransactionDto,
): Promise<TransactionResponse> {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
    body: JSON.stringify(dto),
  });
  return handleResponse<TransactionResponse>(res);
}

export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': DEV_USER_ID,
    },
  });
  return handleResponse<void>(res);
}
