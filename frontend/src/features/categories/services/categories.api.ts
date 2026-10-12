import { apiRequest } from '@/lib/api-client';

import type {
  CategoryResponse,
  CategoryType,
  CreateCategoryDto,
} from '../types/category.types';

export function getCategories(
  type?: CategoryType,
): Promise<CategoryResponse[]> {
  const query = type ? `?type=${type}` : '';
  return apiRequest<CategoryResponse[]>(`/categories${query}`);
}

export function createCategory(
  dto: CreateCategoryDto,
): Promise<CategoryResponse> {
  return apiRequest<CategoryResponse>('/categories', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
