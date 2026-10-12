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
import {
  extractBudgetSummaryMetrics,
  resolveUpsertBudgetSelections,
  validateAndBuildUpsertBudgetDto,
} from '../utils/budget.utils';

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
  const metrics = extractBudgetSummaryMetrics(summary);

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
    ...metrics,
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

  const { expenseCategories, effectiveCategoryId, effectiveAmount } =
    resolveUpsertBudgetSelections({
      categories: categories || [],
      selectedCategoryId,
      initialCategoryId,
      rawAmount,
      initialAmount,
    });

  const handleClose = () => {
    setSelectedCategoryId('');
    setRawAmount(null);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { dto, error: validationError } = validateAndBuildUpsertBudgetDto({
      month,
      effectiveCategoryId,
      effectiveAmount,
    });

    if (validationError || !dto) {
      setError(validationError ?? 'Dữ liệu hạn mức không hợp lệ');
      return;
    }

    try {
      await upsertMutation.mutateAsync(dto);
      handleClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể lưu hạn mức. Vui lòng thử lại.',
      );
    }
  };

  const handleDelete = async () => {
    if (!existingBudgetId) return;
    setError(null);
    try {
      await deleteMutation.mutateAsync(existingBudgetId);
      handleClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Không thể xóa hạn mức này.',
      );
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
