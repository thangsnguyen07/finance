'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useCategories } from '@/features/categories';
import { getCurrentMonthString, getMonthDayProgress } from '@/lib/date-utils';

import {
  getMonthlyBudgets,
  upsertBudget,
  deleteBudget,
} from '../services/budgets.api';

import type {
  BudgetEnvelopeResponse,
  UpsertBudgetDto,
} from '../types/budget.types';

export const BUDGETS_QUERY_KEY = ['budgets'];

export function useBudgets(month?: string) {
  return useQuery({
    queryKey: [...BUDGETS_QUERY_KEY, month ?? 'current'],
    queryFn: () => getMonthlyBudgets(month),
  });
}

export function useUpsertBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpsertBudgetDto) => upsertBudget(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}

export function useBudgetPlanner() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentMonthString,
  );
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    categoryId?: string;
    amount?: number;
    budgetId?: string;
  }>({ isOpen: false });

  const { data: summary, isLoading, error } = useBudgets(selectedMonth);
  const dayProgress = getMonthDayProgress(selectedMonth);

  const openCreateModal = (categoryId?: string, suggestedAmount?: number) => {
    setModalState({
      isOpen: true,
      categoryId,
      amount: suggestedAmount,
      budgetId: undefined,
    });
  };

  const openEditModal = (env: BudgetEnvelopeResponse) => {
    setModalState({
      isOpen: true,
      categoryId: env.categoryId,
      amount: env.budgetAmount,
      budgetId: env.id,
    });
  };

  const closeModal = () => setModalState({ isOpen: false });

  return {
    selectedMonth,
    setSelectedMonth,
    dayProgress,
    totalSpent: summary?.totalSpentInBudgeted ?? 0,
    totalBudgeted: summary?.totalBudgeted ?? 0,
    remainingBudget: summary?.remainingBudget ?? 0,
    overallPercent: summary?.overallUsagePercentage ?? 0,
    envelopes: summary?.envelopes ?? [],
    unbudgetedCategories: summary?.unbudgetedCategories ?? [],
    isLoading,
    errorMessage:
      error instanceof Error
        ? error.message
        : error
          ? 'Không thể tải dữ liệu ngân sách tháng'
          : null,
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}

export function useUpsertBudgetForm({
  month,
  initialCategoryId,
  initialAmount,
  existingBudgetId,
  onClose,
}: {
  month: string;
  initialCategoryId?: string;
  initialAmount?: number;
  existingBudgetId?: string;
  onClose: () => void;
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [rawAmount, setRawAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useCategories('EXPENSE');
  const upsertMutation = useUpsertBudget();
  const deleteMutation = useDeleteBudget();

  const expenseCategories = (categories || []).filter(
    (c) => c.type === 'EXPENSE',
  );

  const effectiveCategoryId =
    selectedCategoryId || initialCategoryId || expenseCategories[0]?.id || '';
  const effectiveAmount = rawAmount !== null ? rawAmount : (initialAmount ?? 0);

  const handleClose = () => {
    setSelectedCategoryId('');
    setRawAmount(null);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!effectiveCategoryId) {
      setError('Vui lòng chọn một danh mục chi tiêu');
      return;
    }

    if (effectiveAmount < 1000) {
      setError('Vui lòng đặt hạn mức tối thiểu từ 1.000 ₫ trở lên');
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        categoryId: effectiveCategoryId,
        month,
        amount: effectiveAmount,
      });
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể lưu hạn mức. Vui lòng thử lại.');
      }
    }
  };

  const handleDelete = async () => {
    if (!existingBudgetId) return;
    setError(null);
    try {
      await deleteMutation.mutateAsync(existingBudgetId);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể xóa hạn mức này.');
      }
    }
  };

  const isBusy = upsertMutation.isPending || deleteMutation.isPending;

  return {
    expenseCategories,
    effectiveCategoryId,
    setSelectedCategoryId,
    effectiveAmount,
    setRawAmount,
    error,
    isBusy,
    handleClose,
    handleSubmit,
    handleDelete,
  };
}
