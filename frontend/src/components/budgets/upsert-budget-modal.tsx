'use client';

import { useState } from 'react';
import { Button, Chip } from '@heroui/react';
import { X, Tag, Calendar, Loader2, Trash2 } from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';
import { useUpsertBudget, useDeleteBudget } from '@/hooks/use-budgets';

interface UpsertBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  initialCategoryId?: string;
  initialAmount?: number;
  existingBudgetId?: string;
}

const BUDGET_PRESETS = [
  { label: '1.000.000 ₫', value: 1000000 },
  { label: '2.000.000 ₫', value: 2000000 },
  { label: '3.000.000 ₫', value: 3000000 },
  { label: '5.000.000 ₫', value: 5000000 },
  { label: '10.000.000 ₫', value: 10000000 },
];

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

  if (!isOpen) return null;

  const expenseCategories = (categories || []).filter(
    (c) => c.type === 'EXPENSE',
  );

  // Derived effective values during render (following rerender-derived-state-no-effect)
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
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface text-foreground border-t sm:border border-border rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-secondary/50">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-foreground">
              {existingBudgetId
                ? 'Điều chỉnh hạn mức danh mục'
                : 'Đặt hạn mức chi tiêu tháng'}
            </h2>
            <p className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>Kỳ ngân sách: Tháng {month}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error ? (
            <div className="p-3 text-xs text-danger bg-danger/10 border border-danger/20 rounded-md">
              {error}
            </div>
          ) : null}

          {/* 1. Category Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
              <Tag className="w-3.5 h-3.5 text-muted" />
              <span>Chọn phong bì danh mục</span>
            </label>
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
          </div>

          {/* 2. Budget Amount Input */}
          <div className="bg-surface-secondary/30 border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Hạn mức tối đa trong tháng (VND)
              </label>
              {effectiveAmount > 0 ? (
                <button
                  type="button"
                  onClick={() => setRawAmount(0)}
                  className="text-[11px] text-danger hover:underline font-medium cursor-pointer"
                >
                  Đặt lại 0
                </button>
              ) : null}
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={
                  effectiveAmount > 0
                    ? effectiveAmount.toLocaleString('vi-VN')
                    : ''
                }
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  setRawAmount(digits ? parseInt(digits, 10) : 0);
                }}
                placeholder="0"
                className="w-full text-2xl sm:text-3xl font-mono font-bold bg-transparent text-foreground placeholder:text-muted/40 focus:outline-none pr-8 tabular-nums"
                autoFocus
              />
              <span className="text-lg font-serif font-bold text-muted select-none">
                ₫
              </span>
            </div>

            {/* HeroUI Chips for Quick Budget Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {BUDGET_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setRawAmount(preset.value)}
                  className="cursor-pointer active:scale-95 transition-transform"
                >
                  <Chip
                    size="sm"
                    variant={
                      effectiveAmount === preset.value ? 'primary' : 'secondary'
                    }
                    className="font-mono text-[11px] cursor-pointer"
                  >
                    {preset.label}
                  </Chip>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              {existingBudgetId ? (
                <Button
                  type="button"
                  variant="danger-soft"
                  size="sm"
                  isDisabled={isBusy}
                  onPress={() => void handleDelete()}
                  className="text-xs font-medium flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Gỡ hạn mức</span>
                </Button>
              ) : null}
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                isDisabled={isBusy}
                onPress={handleClose}
                className="text-xs font-medium"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isDisabled={isBusy}
                className="px-5 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                {isBusy ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Lưu hạn mức</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
