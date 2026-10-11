export type AccountType =
  | 'CASH'
  | 'BANK'
  | 'CREDIT_CARD'
  | 'E_WALLET'
  | 'INVESTMENT';

export interface AccountResponse {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: 'VND';
  currentBalance: number; // Stored in integer VND
  creditLimit?: number | null;
  statementDay?: number | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  initialBalance: number;
  currency?: 'VND';
  creditLimit?: number;
  statementDay?: number;
}

export interface UpdateAccountDto {
  name?: string;
  creditLimit?: number;
  statementDay?: number;
  isArchived?: boolean;
}

export type CategoryType = 'INCOME' | 'EXPENSE';

export interface CategoryResponse {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  isSystemDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
}

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

export interface PaginatedTransactionsResponse {
  items: TransactionResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
}
