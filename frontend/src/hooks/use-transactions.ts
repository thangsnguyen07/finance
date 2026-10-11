import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from '@/lib/api/transactions';
import { ACCOUNTS_QUERY_KEY } from './use-accounts';
import type {
  CreateTransactionDto,
  QueryTransactionsParams,
} from '@/types/api';

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
    },
  });
}
