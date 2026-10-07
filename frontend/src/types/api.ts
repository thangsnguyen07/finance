export type AccountType =
  | 'CASH'
  | 'BANK'
  | 'CREDIT_CARD'
  | 'E_WALLET'
  | 'INVESTMENT';

export interface AccountResponse {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  currency: 'VND';
  current_balance: number; // Stored in VND
  credit_limit?: number | null;
  statement_day?: number | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  initial_balance: number;
  currency?: 'VND';
  credit_limit?: number;
  statement_day?: number;
}

export interface UpdateAccountDto {
  name?: string;
  credit_limit?: number;
  statement_day?: number;
  is_archived?: boolean;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
}
