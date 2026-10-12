'use client';

import { LedgerLoadingState } from '@/components/feedback';
import { Grid, PageHeader, Stack } from '@/components/ui';

import { useCategoryDirectory } from '../hooks/use-categories';
import { CategoryDirectoryCard } from './CategoryDirectoryCard';
import { CreateCategoryForm } from './CreateCategoryForm';

export function SettingsView() {
  const { expenseCategories, incomeCategories, isLoading } =
    useCategoryDirectory();

  return (
    <Stack gap="xl">
      <PageHeader
        title="Cài Đặt Sổ & Danh Mục Thu Chi"
        description="Quản lý các nhãn phân loại bút toán thu nhập, chi tiêu và quy ước sổ cái"
      />

      <CreateCategoryForm />

      {isLoading ? (
        <LedgerLoadingState message="Đang tải danh bạ danh mục..." />
      ) : (
        <Grid cols={2} gap="lg">
          <CategoryDirectoryCard
            title="Danh mục Chi tiêu"
            type="EXPENSE"
            categories={expenseCategories}
          />
          <CategoryDirectoryCard
            title="Danh mục Thu nhập"
            type="INCOME"
            categories={incomeCategories}
          />
        </Grid>
      )}
    </Stack>
  );
}
