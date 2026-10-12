'use client';

import { Tag, Calendar, Trash2 } from 'lucide-react';

import { Modal } from '@/components/feedback';
import { Button, Field, Alert, VndAmountInput } from '@/components/ui';

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

  return (
    <Modal.Root isOpen={isOpen} onClose={handleClose}>
      <Modal.Header
        title={
          existingBudgetId
            ? 'Điều chỉnh hạn mức danh mục'
            : 'Đặt hạn mức chi tiêu tháng'
        }
        subtitle={
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>Kỳ ngân sách: Tháng {month}</span>
          </span>
        }
        onClose={handleClose}
      />

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Field.Root>
            <Field.Label icon={<Tag className="h-3.5 w-3.5" />}>
              Chọn phong bì danh mục
            </Field.Label>
            <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto p-0.5">
              {expenseCategories.map((cat) => {
                const isSelected = effectiveCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`h-9 cursor-pointer truncate rounded-lg border px-3 text-left text-xs transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/10 font-bold text-accent shadow-2xs'
                        : 'border-border bg-surface text-foreground hover:border-border/80'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </Field.Root>

          <VndAmountInput
            label="Hạn mức tối đa trong tháng (VND)"
            amount={effectiveAmount}
            onChange={(val) => setRawAmount(val)}
            presets={BUDGET_AMOUNT_PRESETS}
            showThousandMultiplier
            autoFocus
          />

          <Modal.Footer>
            <div>
              {existingBudgetId ? (
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
              ) : null}
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                tone="ghost"
                size="sm"
                isDisabled={isBusy}
                onPress={handleClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                tone="primary"
                size="sm"
                isLoading={isBusy}
                className="px-5 py-2"
              >
                <span>Lưu hạn mức</span>
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal.Root>
  );
}
