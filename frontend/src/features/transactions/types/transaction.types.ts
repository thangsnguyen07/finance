import type { AccountResponse } from '@/features/accounts';
import type { CategoryResponse } from '@/features/categories';
import type { PaginatedResponse } from '@/types/common.types';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TransactionStatus = 'CLEARED' | 'UNCLEARED' | 'RECONCILED';

export interface TransactionResponse {
  id: string;
  clientTxId: string;
  userId: string;
  accountId: string;
  account?: AccountResponse;
  targetAccountId: string | null;
  targetAccount?: AccountResponse | null;
  categoryId: string | null;
  category?: CategoryResponse | null;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  clientTxId: string;
  accountId: string;
  targetAccountId?: string;
  categoryId?: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
  description?: string;
}

export interface QueryTransactionsParams {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export type PaginatedTransactionsResponse =
  PaginatedResponse<TransactionResponse>;
