'use client';

import { Plus } from 'lucide-react';

import { LedgerLoadingState } from '@/components/feedback';
import {
  Alert,
  Button,
  MonthNavigator,
  PageHeader,
  Stack,
} from '@/components/ui';

import { useBudgetPlanner } from '../hooks/use-budgets';
import { BudgetEnvelopeList } from './BudgetEnvelopeList';
import { BudgetRulerSummaryCard } from './BudgetRulerSummaryCard';
import { UnbudgetedCategoryGrid } from './UnbudgetedCategoryGrid';
import { UpsertBudgetModal } from './UpsertBudgetModal';

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
    <Stack gap="xl">
      <PageHeader
        title="Sổ Ngân Sách Tháng"
        description="Phân bổ hạn mức chi tiêu theo từng phong bì danh mục và đối chiếu nhịp độ thực tế"
        actions={
          <>
            <MonthNavigator month={selectedMonth} onChange={setSelectedMonth} />
            <Button tone="primary" size="sm" onPress={() => openCreateModal()}>
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Đặt hạn mức</span>
            </Button>
          </>
        }
      />

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
        <Stack gap="xl">
          <BudgetEnvelopeList
            envelopes={envelopes}
            onOpenCreate={() => openCreateModal()}
            onOpenEdit={openEditModal}
          />
          <UnbudgetedCategoryGrid
            categories={unbudgetedCategories}
            onSelectCategory={openCreateModal}
          />
        </Stack>
      )}

      <UpsertBudgetModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        month={selectedMonth}
        initialCategoryId={modalState.categoryId}
        initialAmount={modalState.amount}
        existingBudgetId={modalState.budgetId}
      />
    </Stack>
  );
}
