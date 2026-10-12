'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getCategories, createCategory } from '../services/categories.api';
import {
  getDefaultCategoryColor,
  splitCategoriesByType,
  validateAndBuildCreateCategoryDto,
} from '../utils/category.utils';

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
  const { expenseCategories, incomeCategories } =
    splitCategoriesByType(categories);

  return {
    expenseCategories,
    incomeCategories,
    isLoading,
  };
}

export function useCreateCategoryForm() {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryType, setCategoryType] = useState<CategoryType>('EXPENSE');
  const [selectedColor, setSelectedColor] = useState<string>(
    getDefaultCategoryColor('EXPENSE'),
  );
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const createCategoryMutation = useCreateCategory();

  const handleTypeChange = (nextType: CategoryType) => {
    setCategoryType(nextType);
    setSelectedColor(getDefaultCategoryColor(nextType));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const { dto, error: validationError } = validateAndBuildCreateCategoryDto({
      name: categoryName,
      type: categoryType,
      color: selectedColor,
    });

    if (validationError || !dto) {
      setError(validationError ?? 'Dữ liệu không hợp lệ');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync(dto);
      setCategoryName('');
      setSuccessMsg(`Đã thêm danh mục "${dto.name}" vào sổ.`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tạo danh mục mới. Vui lòng thử lại.',
      );
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
