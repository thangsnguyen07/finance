'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ACCOUNTS_QUERY_KEY, useAccounts } from '@/features/accounts';
import { useCategories } from '@/features/categories';
import { getTodayDateString } from '@/lib/date-utils';
import { useUiStore } from '@/stores/use-ui-store';

import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from '../services/transactions.api';
import {
  computeTransactionTotals,
  resolveQuickEntrySelections,
  validateAndBuildTransactionDto,
} from '../utils/transaction.utils';

import type {
  CreateTransactionDto,
  QueryTransactionsParams,
  TransactionType,
} from '../types/transaction.types';

export const TRANSACTIONS_QUERY_KEY = ['transactions'];

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
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [filterAccountId, setFilterAccountId] = useState<string>('');
  const openQuickEntry = useUiStore((state) => state.openQuickEntry);

  const { data: accounts } = useAccounts();
  const {
    data: txData,
    isLoading,
    isError,
  } = useTransactions({
    type: filterType === 'ALL' ? undefined : filterType,
    accountId: filterAccountId || undefined,
    limit: 50,
  });
  const deleteMutation = useDeleteTransaction();

  const items = txData?.items || [];
  const { totalIncome, totalExpense } = computeTransactionTotals(items);

  const handleDelete = async (id: string, label: string) => {
    if (
      window.confirm(
        `Xóa giao dịch "${label}"? Số dư ví liên quan sẽ được hoàn lại tự động.`,
      )
    ) {
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
  const [txType, setTxType] = useState<TransactionType>('EXPENSE');
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
    txType === 'TRANSFER' ? undefined : txType,
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
    setTxType('EXPENSE');
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
      setError(validationError ?? 'Dữ liệu giao dịch không hợp lệ');
      return;
    }

    try {
      await createTransactionMutation.mutateAsync(dto);
      handleClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể lưu giao dịch. Vui lòng thử lại.',
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
