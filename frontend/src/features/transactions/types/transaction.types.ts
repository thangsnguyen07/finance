import type { AccountResponse } from '@/features/accounts';
import type { CategoryResponse } from '@/features/categories';
import type { PaginatedResponse } from '@/types/common.types';

export const TRANSACTION_TYPE = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export const TRANSACTION_FILTER_TYPE = {
  ALL: 'ALL',
  ...TRANSACTION_TYPE,
} as const;

export type TransactionFilterType =
  (typeof TRANSACTION_FILTER_TYPE)[keyof typeof TRANSACTION_FILTER_TYPE];

export const TRANSACTION_STATUS = {
  CLEARED: 'CLEARED',
  UNCLEARED: 'UNCLEARED',
  RECONCILED: 'RECONCILED',
} as const;

export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

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
