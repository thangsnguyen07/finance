import { apiRequest } from '@/lib/api-client';
import type {
  TransactionResponse,
  CreateTransactionDto,
  QueryTransactionsParams,
  PaginatedTransactionsResponse,
} from '../types/transaction.types';

export function getTransactions(
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
  const suffix = queryString ? `?${queryString}` : '';

  return apiRequest<PaginatedTransactionsResponse>(`/transactions${suffix}`);
}

export function createTransaction(
  dto: CreateTransactionDto,
): Promise<TransactionResponse> {
  return apiRequest<TransactionResponse>('/transactions', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function deleteTransaction(id: string): Promise<void> {
  return apiRequest<void>(`/transactions/${id}`, {
    method: 'DELETE',
  });
}
