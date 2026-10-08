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

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
}
