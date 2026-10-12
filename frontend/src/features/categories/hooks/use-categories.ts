'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  CATEGORY_MESSAGES,
  DEFAULT_CATEGORY_TYPE,
} from '../constants/category.constants';
import { getCategories, createCategory } from '../services/categories.api';
import {
  getDefaultCategoryColor,
  splitCategoriesByType,
  validateAndBuildCreateCategoryDto,
} from '../utils/category.utils';

import type { CategoryType, CreateCategoryDto } from '../types/category.types';

export const CATEGORIES_QUERY_KEY = ['categories'] as const;

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
  const [categoryType, setCategoryType] = useState<CategoryType>(
    DEFAULT_CATEGORY_TYPE,
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    getDefaultCategoryColor(DEFAULT_CATEGORY_TYPE),
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
      setError(validationError ?? CATEGORY_MESSAGES.INVALID_DATA);
      return;
    }

    try {
      await createCategoryMutation.mutateAsync(dto);
      setCategoryName('');
      setSuccessMsg(CATEGORY_MESSAGES.CREATE_SUCCESS(dto.name));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : CATEGORY_MESSAGES.CREATE_ERROR,
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
