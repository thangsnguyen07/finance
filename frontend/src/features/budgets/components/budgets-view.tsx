'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { LedgerLoadingState } from '@/components/feedback';
import { Button, Alert, PageHeader, MonthNavigator } from '@/components/ui';
import { getCurrentMonthString } from '@/lib/date-utils';

import { useBudgets } from '../hooks/use-budgets';
import { BudgetEnvelopeList } from './budget-envelope-list';
import { BudgetRulerSummaryCard } from './budget-ruler-summary-card';
import { UnbudgetedCategoryGrid } from './unbudgeted-category-grid';
import { UpsertBudgetModal } from './upsert-budget-modal';

import type { BudgetEnvelopeResponse } from '../types/budget.types';

export function BudgetsView() {
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

  return (
    <div className="space-y-6">
      <PageHeader.Root>
        <PageHeader.Content
          title="Sổ Ngân Sách Tháng"
          description="Phân bổ hạn mức chi tiêu theo từng phong bì danh mục và đối chiếu nhịp độ thực tế"
        />
        <PageHeader.Actions>
          <MonthNavigator month={selectedMonth} onChange={setSelectedMonth} />
          <Button tone="primary" size="sm" onPress={() => openCreateModal()}>
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Đặt hạn mức</span>
          </Button>
        </PageHeader.Actions>
      </PageHeader.Root>

      <BudgetRulerSummaryCard
        month={selectedMonth}
        totalSpent={summary?.totalSpentInBudgeted ?? 0}
        totalBudgeted={summary?.totalBudgeted ?? 0}
        remainingBudget={summary?.remainingBudget ?? 0}
        overallPercent={summary?.overallUsagePercentage ?? 0}
        isLoading={isLoading}
      />

      {isLoading ? (
        <LedgerLoadingState message="Đang đối chiếu sổ ngân sách tháng..." />
      ) : error ? (
        <Alert variant="danger">
          {error instanceof Error
            ? error.message
            : 'Không thể tải dữ liệu ngân sách tháng'}
        </Alert>
      ) : (
        <div className="space-y-6">
          <BudgetEnvelopeList
            envelopes={summary?.envelopes ?? []}
            onOpenCreate={() => openCreateModal()}
            onOpenEdit={openEditModal}
          />
          <UnbudgetedCategoryGrid
            categories={summary?.unbudgetedCategories ?? []}
            onSelectCategory={openCreateModal}
          />
        </div>
      )}

      <UpsertBudgetModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        month={selectedMonth}
        initialCategoryId={modalState.categoryId}
        initialAmount={modalState.amount}
        existingBudgetId={modalState.budgetId}
      />
    </div>
  );
}
