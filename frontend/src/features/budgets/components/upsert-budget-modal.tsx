'use client';

import { useState } from 'react';
import { Tag, Calendar, Trash2 } from 'lucide-react';
import { Modal } from '@/components/feedback';
import { Button, Field, Alert, VndAmountInput } from '@/components/ui';
import { useCategories } from '@/features/categories';
import { BUDGET_AMOUNT_PRESETS } from '../constants/budget.constants';
import { useUpsertBudget, useDeleteBudget } from '../hooks/use-budgets';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [rawAmount, setRawAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useCategories('EXPENSE');
  const upsertMutation = useUpsertBudget();
  const deleteMutation = useDeleteBudget();

  const expenseCategories = (categories || []).filter(
    (c) => c.type === 'EXPENSE',
  );

  const effectiveCategoryId =
    selectedCategoryId ||
    initialCategoryId ||
    expenseCategories[0]?.id ||
    '';
  const effectiveAmount =
    rawAmount !== null ? rawAmount : (initialAmount ?? 0);

  const handleClose = () => {
    setSelectedCategoryId('');
    setRawAmount(null);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!effectiveCategoryId) {
      setError('Vui lòng chọn một danh mục chi tiêu');
      return;
    }

    if (effectiveAmount < 1000) {
      setError('Vui lòng đặt hạn mức tối thiểu từ 1.000 ₫ trở lên');
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        categoryId: effectiveCategoryId,
        month,
        amount: effectiveAmount,
      });
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể lưu hạn mức. Vui lòng thử lại.');
      }
    }
  };

  const handleDelete = async () => {
    if (!existingBudgetId) return;
    setError(null);
    try {
      await deleteMutation.mutateAsync(existingBudgetId);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể xóa hạn mức này.');
      }
    }
  };

  const isBusy = upsertMutation.isPending || deleteMutation.isPending;

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
            <Calendar className="w-3 h-3" />
            <span>Kỳ ngân sách: Tháng {month}</span>
          </span>
        }
        onClose={handleClose}
      />

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Field.Root>
            <Field.Label icon={<Tag className="w-3.5 h-3.5" />}>
              Chọn phong bì danh mục
            </Field.Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-0.5">
              {expenseCategories.map((cat) => {
                const isSelected = effectiveCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`h-9 px-3 rounded-lg border text-left text-xs transition-all truncate cursor-pointer ${
                      isSelected
                        ? 'border-accent bg-accent/10 text-accent font-bold shadow-2xs'
                        : 'border-border bg-surface hover:border-border/80 text-foreground'
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
                  <Trash2 className="w-3.5 h-3.5" />
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
