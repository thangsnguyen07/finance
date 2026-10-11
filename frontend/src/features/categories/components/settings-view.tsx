'use client';

import { PageHeader } from '@/components/ui';
import { LedgerLoadingState } from '@/components/feedback';
import { useCategories } from '../hooks/use-categories';
import { CreateCategoryForm } from './create-category-form';
import { CategoryDirectoryCard } from './category-directory-card';

export function SettingsView() {
  const { data: categories, isLoading } = useCategories();

  const expenseCategories = (categories || []).filter(
    (c) => c.type === 'EXPENSE',
  );
  const incomeCategories = (categories || []).filter(
    (c) => c.type === 'INCOME',
  );

  return (
    <div className="space-y-6">
      <PageHeader.Root>
        <PageHeader.Content
          title="Cài Đặt Sổ & Danh Mục Thu Chi"
          description="Quản lý các nhãn phân loại bút toán thu nhập, chi tiêu và quy ước sổ cái"
        />
      </PageHeader.Root>

      <CreateCategoryForm />

      {isLoading ? (
        <LedgerLoadingState message="Đang tải danh bạ danh mục..." />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
        </div>
      )}
    </div>
  );
}
