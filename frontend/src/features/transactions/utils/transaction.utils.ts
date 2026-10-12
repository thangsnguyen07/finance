import { TRANSACTION_MESSAGES } from '../constants/transaction.constants';
import {
  TRANSACTION_TYPE,
  type CreateTransactionDto,
  type TransactionResponse,
  type TransactionType,
} from '../types/transaction.types';

import type { AccountResponse } from '@/features/accounts';
import type { CategoryResponse } from '@/features/categories';

export function computeTransactionTotals(
  transactions: TransactionResponse[] = [],
) {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    if (tx.type === TRANSACTION_TYPE.INCOME) {
      totalIncome += tx.amount;
    } else if (tx.type === TRANSACTION_TYPE.EXPENSE) {
      totalExpense += tx.amount;
    }
  }

  return {
    totalIncome,
    totalExpense,
    netFlow: totalIncome - totalExpense,
  };
}

export function getTransactionDisplayTitle(tx: TransactionResponse): string {
  if (tx.description) return tx.description;
  if (tx.category?.name) return tx.category.name;
  if (tx.type === TRANSACTION_TYPE.TRANSFER) {
    return TRANSACTION_MESSAGES.TRANSFER_TITLE(
      tx.account?.name,
      tx.targetAccount?.name,
    );
  }
  return TRANSACTION_MESSAGES.FALLBACK_TITLE;
}

export function resolveQuickEntrySelections(input: {
  txType: TransactionType;
  accountId: string;
  targetAccountId: string;
  categoryId: string;
  accounts: AccountResponse[];
  categories: CategoryResponse[];
}) {
  const filteredCategories = input.categories.filter(
    (c) => c.type === input.txType,
  );

  const effectiveAccountId = input.accountId || input.accounts[0]?.id || '';
  const effectiveTargetAccountId =
    input.targetAccountId && input.targetAccountId !== effectiveAccountId
      ? input.targetAccountId
      : input.accounts.find((a) => a.id !== effectiveAccountId)?.id || '';
  const effectiveCategoryId = filteredCategories.some(
    (c) => c.id === input.categoryId,
  )
    ? input.categoryId
    : filteredCategories[0]?.id || '';

  return {
    filteredCategories,
    effectiveAccountId,
    effectiveTargetAccountId,
    effectiveCategoryId,
  };
}

export function generateClientTxId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function validateAndBuildTransactionDto(input: {
  txType: TransactionType;
  rawAmount: number;
  effectiveAccountId: string;
  effectiveTargetAccountId: string;
  effectiveCategoryId: string;
  transactionDate: string;
  description: string;
}): { dto?: CreateTransactionDto; error?: string } {
  if (input.rawAmount <= 0) {
    return { error: TRANSACTION_MESSAGES.AMOUNT_REQUIRED };
  }

  if (!input.effectiveAccountId) {
    return { error: TRANSACTION_MESSAGES.SOURCE_ACCOUNT_REQUIRED };
  }

  if (input.txType === TRANSACTION_TYPE.TRANSFER) {
    if (!input.effectiveTargetAccountId) {
      return { error: TRANSACTION_MESSAGES.TARGET_ACCOUNT_REQUIRED };
    }
    if (input.effectiveAccountId === input.effectiveTargetAccountId) {
      return { error: TRANSACTION_MESSAGES.SAME_ACCOUNT_ERROR };
    }
  }

  return {
    dto: {
      clientTxId: generateClientTxId(),
      accountId: input.effectiveAccountId,
      targetAccountId:
        input.txType === TRANSACTION_TYPE.TRANSFER
          ? input.effectiveTargetAccountId
          : undefined,
      categoryId:
        input.txType !== TRANSACTION_TYPE.TRANSFER && input.effectiveCategoryId
          ? input.effectiveCategoryId
          : undefined,
      amount: input.rawAmount,
      type: input.txType,
      transactionDate: input.transactionDate,
      description: input.description.trim() || undefined,
    },
  };
}
