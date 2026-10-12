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

  const totalIncome = items
    .filter((tx) => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = items
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + tx.amount, 0);

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

  const filteredCategories = (categories || []).filter(
    (c) => c.type === txType,
  );

  const effectiveAccountId = accountId || accounts?.[0]?.id || '';
  const effectiveTargetAccountId =
    targetAccountId && targetAccountId !== effectiveAccountId
      ? targetAccountId
      : accounts?.find((a) => a.id !== effectiveAccountId)?.id || '';
  const effectiveCategoryId = filteredCategories.some(
    (c) => c.id === categoryId,
  )
    ? categoryId
    : filteredCategories[0]?.id || '';

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

    if (rawAmount <= 0) {
      setError('Vui lòng nhập số tiền lớn hơn 0 ₫');
      return;
    }

    if (!effectiveAccountId) {
      setError('Vui lòng chọn ví / tài khoản nguồn');
      return;
    }

    if (txType === 'TRANSFER') {
      if (!effectiveTargetAccountId) {
        setError('Vui lòng chọn ví đích để chuyển khoản');
        return;
      }
      if (effectiveAccountId === effectiveTargetAccountId) {
        setError('Ví nguồn và ví đích phải khác nhau');
        return;
      }
    }

    const clientTxId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    try {
      await createTransactionMutation.mutateAsync({
        clientTxId,
        accountId: effectiveAccountId,
        targetAccountId:
          txType === 'TRANSFER' ? effectiveTargetAccountId : undefined,
        categoryId:
          txType !== 'TRANSFER' && effectiveCategoryId
            ? effectiveCategoryId
            : undefined,
        amount: rawAmount,
        type: txType,
        transactionDate,
        description: description.trim() || undefined,
      });

      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể lưu giao dịch. Vui lòng thử lại.');
      }
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
