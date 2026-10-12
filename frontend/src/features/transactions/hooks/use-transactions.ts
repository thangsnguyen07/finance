'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ACCOUNTS_QUERY_KEY, useAccounts } from '@/features/accounts';
import { useCategories } from '@/features/categories';
import { getTodayDateString } from '@/lib/date-utils';
import { useUiStore } from '@/stores/use-ui-store';

import {
  TRANSACTION_DEFAULTS,
  TRANSACTION_MESSAGES,
} from '../constants/transaction.constants';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from '../services/transactions.api';
import {
  TRANSACTION_FILTER_TYPE,
  TRANSACTION_TYPE,
  type CreateTransactionDto,
  type QueryTransactionsParams,
  type TransactionFilterType,
  type TransactionType,
} from '../types/transaction.types';
import {
  computeTransactionTotals,
  resolveQuickEntrySelections,
  validateAndBuildTransactionDto,
} from '../utils/transaction.utils';

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const;

export function useTransactions(params?: QueryTransactionsParams) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, params ?? {}],
    queryFn: () => getTransactions(params),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTransactionDto) => createTransaction(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useTransactionLedger() {
  const [filterType, setFilterType] = useState<TransactionFilterType>(
    TRANSACTION_DEFAULTS.DEFAULT_FILTER_TYPE,
  );
  const [filterAccountId, setFilterAccountId] = useState<string>('');
  const openQuickEntry = useUiStore((state) => state.openQuickEntry);

  const { data: accounts } = useAccounts();
  const {
    data: txData,
    isLoading,
    isError,
  } = useTransactions({
    type: filterType === TRANSACTION_FILTER_TYPE.ALL ? undefined : filterType,
    accountId: filterAccountId || undefined,
    limit: TRANSACTION_DEFAULTS.LEDGER_LIMIT,
  });
  const deleteMutation = useDeleteTransaction();

  const items = txData?.items || [];
  const { totalIncome, totalExpense } = computeTransactionTotals(items);

  const handleDelete = async (id: string, label: string) => {
    if (window.confirm(TRANSACTION_MESSAGES.CONFIRM_DELETE(label))) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return {
    filterType,
    setFilterType,
    filterAccountId,
    setFilterAccountId,
    accounts: accounts || [],
    items,
    totalCount: txData?.total || items.length,
    totalIncome,
    totalExpense,
    isLoading,
    isError,
    isDeleting: deleteMutation.isPending,
    openQuickEntry,
    handleDelete,
  };
}

export function useQuickEntryForm({ onClose }: { onClose: () => void }) {
  const [txType, setTxType] = useState<TransactionType>(
    TRANSACTION_DEFAULTS.DEFAULT_TYPE,
  );
  const [rawAmount, setRawAmount] = useState<number>(0);
  const [accountId, setAccountId] = useState<string>('');
  const [targetAccountId, setTargetAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [transactionDate, setTransactionDate] =
    useState<string>(getTodayDateString);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories(
    txType === TRANSACTION_TYPE.TRANSFER ? undefined : txType,
  );
  const createTransactionMutation = useCreateTransaction();

  const {
    filteredCategories,
    effectiveAccountId,
    effectiveTargetAccountId,
    effectiveCategoryId,
  } = resolveQuickEntrySelections({
    txType,
    accountId,
    targetAccountId,
    categoryId,
    accounts: accounts || [],
    categories: categories || [],
  });

  const handleClose = () => {
    setTxType(TRANSACTION_DEFAULTS.DEFAULT_TYPE);
    setRawAmount(0);
    setAccountId('');
    setTargetAccountId('');
    setCategoryId('');
    setTransactionDate(getTodayDateString());
    setDescription('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { dto, error: validationError } = validateAndBuildTransactionDto({
      txType,
      rawAmount,
      effectiveAccountId,
      effectiveTargetAccountId,
      effectiveCategoryId,
      transactionDate,
      description,
    });

    if (validationError || !dto) {
      setError(validationError ?? TRANSACTION_MESSAGES.INVALID_DATA);
      return;
    }

    try {
      await createTransactionMutation.mutateAsync(dto);
      handleClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : TRANSACTION_MESSAGES.CREATE_ERROR,
      );
    }
  };

  return {
    txType,
    setTxType,
    rawAmount,
    setRawAmount,
    accounts: accounts || [],
    filteredCategories,
    effectiveAccountId,
    setAccountId,
    effectiveTargetAccountId,
    setTargetAccountId,
    effectiveCategoryId,
    setCategoryId,
    transactionDate,
    setTransactionDate,
    description,
    setDescription,
    error,
    isPending: createTransactionMutation.isPending,
    handleClose,
    handleSubmit,
  };
}
