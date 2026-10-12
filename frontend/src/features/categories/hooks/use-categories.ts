'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getCategories, createCategory } from '../services/categories.api';

import type { CategoryType, CreateCategoryDto } from '../types/category.types';

export const CATEGORIES_QUERY_KEY = ['categories'];

export function useCategories(type?: CategoryType) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, { type }],
    queryFn: () => getCategories(type),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useCategoryDirectory() {
  const { data: categories, isLoading } = useCategories();

  const allCategories = categories || [];
  const expenseCategories = allCategories.filter((c) => c.type === 'EXPENSE');
  const incomeCategories = allCategories.filter((c) => c.type === 'INCOME');

  return {
    expenseCategories,
    incomeCategories,
    isLoading,
  };
}

export function useCreateCategoryForm() {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryType, setCategoryType] = useState<CategoryType>('EXPENSE');
  const [selectedColor, setSelectedColor] = useState<string>('#991B1B');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const createCategoryMutation = useCreateCategory();

  const handleTypeChange = (nextType: CategoryType) => {
    setCategoryType(nextType);
    setSelectedColor(nextType === 'EXPENSE' ? '#991B1B' : '#166534');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmed = categoryName.trim();
    if (!trimmed) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: trimmed,
        type: categoryType,
        color: selectedColor,
      });
      setCategoryName('');
      setSuccessMsg(`Đã thêm danh mục "${trimmed}" vào sổ.`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể tạo danh mục mới. Vui lòng thử lại.');
      }
    }
  };

  return {
    categoryName,
    setCategoryName,
    categoryType,
    handleTypeChange,
    selectedColor,
    setSelectedColor,
    error,
    successMsg,
    isPending: createCategoryMutation.isPending,
    handleSubmit,
  };
}
