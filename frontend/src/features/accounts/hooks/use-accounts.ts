'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../services/accounts.api';
import {
  computeAccountOverviewMetrics,
  validateAndBuildCreateAccountDto,
} from '../utils/account.utils';

import type {
  AccountType,
  CreateAccountDto,
  UpdateAccountDto,
} from '../types/account.types';

export const ACCOUNTS_QUERY_KEY = ['accounts'];

export function useAccounts() {
  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: getAccounts,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAccountDto) => createAccount(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAccountDto }) =>
      updateAccount(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export function useAccountOverview() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: accounts, isLoading, error } = useAccounts();
  const deleteMutation = useDeleteAccount();

  const allAccounts = accounts || [];
  const metrics = computeAccountOverviewMetrics(allAccounts);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleArchive = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn lưu trữ ví "${name}" không?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return {
    allAccounts,
    ...metrics,
    isLoading,
    errorMessage:
      error instanceof Error
        ? error.message
        : error
          ? 'Lỗi tải danh sách tài khoản'
          : null,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    handleArchive,
  };
}

export function useCreateAccountForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('BANK');
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [creditLimit, setCreditLimit] = useState<number>(0);
  const [statementDay, setStatementDay] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateAccount();

  const handleClose = () => {
    setName('');
    setType('BANK');
    setInitialBalance(0);
    setCreditLimit(0);
    setStatementDay('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { dto, error: validationError } = validateAndBuildCreateAccountDto({
      name,
      type,
      initialBalance,
      creditLimit,
      statementDay,
    });

    if (validationError || !dto) {
      setError(validationError ?? 'Dữ liệu không hợp lệ');
      return;
    }

    try {
      await createMutation.mutateAsync(dto);
      handleClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Đã có lỗi xảy ra khi tạo tài khoản',
      );
    }
  };

  return {
    name,
    setName,
    type,
    setType,
    initialBalance,
    setInitialBalance,
    creditLimit,
    setCreditLimit,
    statementDay,
    setStatementDay,
    error,
    isPending: createMutation.isPending,
    handleClose,
    handleSubmit,
  };
}
