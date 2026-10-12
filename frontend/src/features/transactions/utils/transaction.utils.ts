import type {
  CreateTransactionDto,
  TransactionResponse,
  TransactionType,
} from '../types/transaction.types';
import type { AccountResponse } from '@/features/accounts';
import type { CategoryResponse } from '@/features/categories';

export function computeTransactionTotals(
  transactions: TransactionResponse[] = [],
) {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    if (tx.type === 'INCOME') {
      totalIncome += tx.amount;
    } else if (tx.type === 'EXPENSE') {
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
  if (tx.type === 'TRANSFER') {
    return `Chuyển khoản: ${tx.account?.name || ''} → ${tx.targetAccount?.name || ''}`;
  }
  return 'Giao dịch';
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
    return { error: 'Vui lòng nhập số tiền lớn hơn 0 ₫' };
  }

  if (!input.effectiveAccountId) {
    return { error: 'Vui lòng chọn ví / tài khoản nguồn' };
  }

  if (input.txType === 'TRANSFER') {
    if (!input.effectiveTargetAccountId) {
      return { error: 'Vui lòng chọn ví đích để chuyển khoản' };
    }
    if (input.effectiveAccountId === input.effectiveTargetAccountId) {
      return { error: 'Ví nguồn và ví đích phải khác nhau' };
    }
  }

  return {
    dto: {
      clientTxId: generateClientTxId(),
      accountId: input.effectiveAccountId,
      targetAccountId:
        input.txType === 'TRANSFER'
          ? input.effectiveTargetAccountId
          : undefined,
      categoryId:
        input.txType !== 'TRANSFER' && input.effectiveCategoryId
          ? input.effectiveCategoryId
          : undefined,
      amount: input.rawAmount,
      type: input.txType,
      transactionDate: input.transactionDate,
      description: input.description.trim() || undefined,
    },
  };
}
