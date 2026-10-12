'use client';

import { Tag, Calendar, Trash2 } from 'lucide-react';

import { Modal } from '@/components/feedback';
import { Button, ChoiceGroup, Row, VndAmountInput } from '@/components/ui';

import { BUDGET_AMOUNT_PRESETS } from '../constants/budget.constants';
import { useUpsertBudgetForm } from '../hooks/use-budgets';

interface UpsertBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  initialCategoryId?: string;
  initialAmount?: number;
  existingBudgetId?: string;
}

export function UpsertBudgetModal({
  isOpen,
  onClose,
  month,
  initialCategoryId,
  initialAmount,
  existingBudgetId,
}: UpsertBudgetModalProps) {
  const {
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
  } = useUpsertBudgetForm({
    month,
    initialCategoryId,
    initialAmount,
    existingBudgetId,
    onClose,
  });

  const categoryChoices = expenseCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        existingBudgetId
          ? 'Điều chỉnh hạn mức danh mục'
          : 'Đặt hạn mức chi tiêu tháng'
      }
      subtitle={
        <Row as="span" gap="xs">
          <Calendar className="h-3 w-3" />
          <span>Kỳ ngân sách: Tháng {month}</span>
        </Row>
      }
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Lưu hạn mức"
      isSubmitting={isBusy}
      footerLeading={
        existingBudgetId ? (
          <Button
            type="button"
            tone="danger"
            size="sm"
            isDisabled={isBusy}
            onPress={() => void handleDelete()}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Gỡ hạn mức</span>
          </Button>
        ) : null
      }
    >
      <ChoiceGroup
        label="Chọn phong bì danh mục"
        labelIcon={<Tag className="h-3.5 w-3.5" />}
        variant="compact-grid"
        cols={2}
        scrollable
        value={effectiveCategoryId}
        onChange={setSelectedCategoryId}
        items={categoryChoices}
      />

      <VndAmountInput
        label="Hạn mức tối đa trong tháng (VND)"
        amount={effectiveAmount}
        onChange={(val) => setRawAmount(val)}
        presets={BUDGET_AMOUNT_PRESETS}
        showThousandMultiplier
        autoFocus
      />
    </Modal>
  );
}
