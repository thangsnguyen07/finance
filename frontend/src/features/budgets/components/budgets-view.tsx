'use client';

import { Plus } from 'lucide-react';

import { LedgerLoadingState } from '@/components/feedback';
import { Button, Alert, PageHeader, MonthNavigator } from '@/components/ui';

import { useBudgetPlanner } from '../hooks/use-budgets';
import { BudgetEnvelopeList } from './budget-envelope-list';
import { BudgetRulerSummaryCard } from './budget-ruler-summary-card';
import { UnbudgetedCategoryGrid } from './unbudgeted-category-grid';
import { UpsertBudgetModal } from './upsert-budget-modal';

export function BudgetsView() {
  const {
    selectedMonth,
    setSelectedMonth,
    dayProgress,
    totalSpent,
    totalBudgeted,
    remainingBudget,
    overallPercent,
    envelopes,
    unbudgetedCategories,
    isLoading,
    errorMessage,
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useBudgetPlanner();

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
        dayProgress={dayProgress}
        totalSpent={totalSpent}
        totalBudgeted={totalBudgeted}
        remainingBudget={remainingBudget}
        overallPercent={overallPercent}
        isLoading={isLoading}
      />

      {isLoading ? (
        <LedgerLoadingState message="Đang đối chiếu sổ ngân sách tháng..." />
      ) : errorMessage ? (
        <Alert variant="danger">{errorMessage}</Alert>
      ) : (
        <div className="space-y-6">
          <BudgetEnvelopeList
            envelopes={envelopes}
            onOpenCreate={() => openCreateModal()}
            onOpenEdit={openEditModal}
          />
          <UnbudgetedCategoryGrid
            categories={unbudgetedCategories}
            onSelectCategory={openCreateModal}
          />
        </div>
      )}

      <UpsertBudgetModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        month={selectedMonth}
        initialCategoryId={modalState.categoryId}
        initialAmount={modalState.amount}
        existingBudgetId={modalState.budgetId}
      />
    </div>
  );
}
