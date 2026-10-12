export const ACCOUNT_TYPE = {
  CASH: 'CASH',
  BANK: 'BANK',
  CREDIT_CARD: 'CREDIT_CARD',
  E_WALLET: 'E_WALLET',
  INVESTMENT: 'INVESTMENT',
} as const;

export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

export const CURRENCY_CODE = {
  VND: 'VND',
} as const;

export type CurrencyCode = (typeof CURRENCY_CODE)[keyof typeof CURRENCY_CODE];

export interface AccountResponse {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  currentBalance: number;
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
  currency?: CurrencyCode;
  creditLimit?: number;
  statementDay?: number;
}

export interface UpdateAccountDto {
  name?: string;
  creditLimit?: number;
  statementDay?: number;
  isArchived?: boolean;
}
