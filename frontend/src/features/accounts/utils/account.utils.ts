import { ACCOUNT_MESSAGES } from '../constants/account.constants';
import {
  ACCOUNT_TYPE,
  type AccountResponse,
  type AccountType,
  type CreateAccountDto,
} from '../types/account.types';

export interface AccountOverviewMetrics {
  assetAccounts: AccountResponse[];
  creditCards: AccountResponse[];
  cashAndWallets: AccountResponse[];
  bankAccounts: AccountResponse[];
  investments: AccountResponse[];
  totalAssets: number;
  totalDebt: number;
  netWorth: number;
}

export function computeAccountOverviewMetrics(
  accounts: AccountResponse[] = [],
): AccountOverviewMetrics {
  const assetAccounts = accounts.filter(
    (acc) => acc.type !== ACCOUNT_TYPE.CREDIT_CARD,
  );
  const creditCards = accounts.filter(
    (acc) => acc.type === ACCOUNT_TYPE.CREDIT_CARD,
  );

  const totalAssets = assetAccounts.reduce(
    (sum, acc) => sum + (acc.currentBalance || 0),
    0,
  );
  const totalDebt = creditCards.reduce(
    (sum, acc) => sum + (acc.currentBalance || 0),
    0,
  );
  const netWorth = totalAssets - totalDebt;

  const cashAndWallets = accounts.filter(
    (acc) =>
      acc.type === ACCOUNT_TYPE.CASH || acc.type === ACCOUNT_TYPE.E_WALLET,
  );
  const bankAccounts = accounts.filter((acc) => acc.type === ACCOUNT_TYPE.BANK);
  const investments = accounts.filter(
    (acc) => acc.type === ACCOUNT_TYPE.INVESTMENT,
  );

  return {
    assetAccounts,
    creditCards,
    cashAndWallets,
    bankAccounts,
    investments,
    totalAssets,
    totalDebt,
    netWorth,
  };
}

export function validateAndBuildCreateAccountDto(input: {
  name: string;
  type: AccountType;
  initialBalance: number;
  creditLimit: number;
  statementDay: string;
}): { dto?: CreateAccountDto; error?: string } {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    return { error: ACCOUNT_MESSAGES.NAME_REQUIRED };
  }

  const parsedStatementDay = input.statementDay
    ? parseInt(input.statementDay, 10)
    : undefined;

  return {
    dto: {
      name: trimmedName,
      type: input.type,
      initialBalance: input.initialBalance,
      creditLimit:
        input.type === ACCOUNT_TYPE.CREDIT_CARD && input.creditLimit > 0
          ? input.creditLimit
          : undefined,
      statementDay:
        input.type === ACCOUNT_TYPE.CREDIT_CARD
          ? parsedStatementDay
          : undefined,
    },
  };
}
