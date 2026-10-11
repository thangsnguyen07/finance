'use client';

import { useState } from 'react';
import {
  X,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Loader2,
  Wallet,
  Calendar,
  FileText,
  Tag,
} from 'lucide-react';
import { useAccounts } from '@/hooks/use-accounts';
import { useCategories } from '@/hooks/use-categories';
import { useCreateTransaction } from '@/hooks/use-transactions';
import type { TransactionType } from '@/types/api';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [
  { label: '+20k', value: 20000 },
  { label: '+50k', value: 50000 },
  { label: '+100k', value: 100000 },
  { label: '+200k', value: 200000 },
  { label: '+500k', value: 500000 },
];

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function QuickEntryModal({ isOpen, onClose }: QuickEntryModalProps) {
  const [txType, setTxType] = useState<TransactionType>('EXPENSE');
  const [rawAmount, setRawAmount] = useState<number>(0);
  const [accountId, setAccountId] = useState<string>('');
  const [targetAccountId, setTargetAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [transactionDate, setTransactionDate] =
    useState<string>(getTodayDateString);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories(
    txType === 'TRANSFER' ? undefined : txType,
  );
  const createTransactionMutation = useCreateTransaction();

  if (!isOpen) return null;

  const filteredCategories = (categories || []).filter(
    (c) => c.type === txType,
  );

  const effectiveAccountId = accountId || accounts?.[0]?.id || '';
  const effectiveTargetAccountId =
    targetAccountId && targetAccountId !== effectiveAccountId
      ? targetAccountId
      : accounts?.find((a) => a.id !== effectiveAccountId)?.id || '';
  const effectiveCategoryId = filteredCategories.some(
    (c) => c.id === categoryId,
  )
    ? categoryId
    : filteredCategories[0]?.id || '';

  const handleAddPreset = (amountToAdd: number) => {
    setRawAmount((prev) => prev + amountToAdd);
  };

  const handleMultiplyThousand = () => {
    if (rawAmount > 0 && rawAmount < 1000000) {
      setRawAmount((prev) => prev * 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rawAmount <= 0) {
      setError('Vui lòng nhập số tiền lớn hơn 0 ₫');
      return;
    }

    if (!effectiveAccountId) {
      setError('Vui lòng chọn ví / tài khoản nguồn');
      return;
    }

    if (txType === 'TRANSFER') {
      if (!effectiveTargetAccountId) {
        setError('Vui lòng chọn ví đích để chuyển khoản');
        return;
      }
      if (effectiveAccountId === effectiveTargetAccountId) {
        setError('Ví nguồn và ví đích phải khác nhau');
        return;
      }
    }

    const clientTxId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    try {
      await createTransactionMutation.mutateAsync({
        clientTxId,
        accountId: effectiveAccountId,
        targetAccountId:
          txType === 'TRANSFER' ? effectiveTargetAccountId : undefined,
        categoryId:
          txType !== 'TRANSFER' && effectiveCategoryId
            ? effectiveCategoryId
            : undefined,
        amount: rawAmount,
        type: txType,
        transactionDate,
        description: description.trim() || undefined,
      });

      setRawAmount(0);
      setDescription('');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể lưu giao dịch. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-surface text-foreground border-t sm:border border-border rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-secondary/50">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-foreground">
              ✍️ Ghi Sổ Giao Dịch Mới
            </h2>
            <p className="text-[11px] text-muted">
              Cập nhật tức thì vào số dư ví & sổ cái
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 text-xs text-danger bg-danger/10 border border-danger/20 rounded-md">
              {error}
            </div>
          )}

          {/* 1. Transaction Type Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-surface-secondary rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setTxType('EXPENSE')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                txType === 'EXPENSE'
                  ? 'bg-danger text-white shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Chi tiêu</span>
            </button>

            <button
              type="button"
              onClick={() => setTxType('INCOME')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                txType === 'INCOME'
                  ? 'bg-success text-white shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Thu nhập</span>
            </button>

            <button
              type="button"
              onClick={() => setTxType('TRANSFER')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                txType === 'TRANSFER'
                  ? 'bg-accent text-white shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Chuyển khoản</span>
            </button>
          </div>

          {/* 2. Amount Input & Banknote Quick Presets */}
          <div className="bg-surface-secondary/30 border border-border rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Số tiền giao dịch (VND)
              </label>
              {rawAmount > 0 && (
                <button
                  type="button"
                  onClick={() => setRawAmount(0)}
                  className="text-[10px] text-danger hover:underline font-medium cursor-pointer"
                >
                  Xóa về 0
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={rawAmount > 0 ? rawAmount.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  setRawAmount(digits ? parseInt(digits, 10) : 0);
                }}
                placeholder="0"
                className="w-full text-2xl sm:text-3xl font-mono font-bold bg-transparent text-foreground placeholder:text-muted/40 focus:outline-none pr-8"
                autoFocus
              />
              <span className="text-lg font-serif font-bold text-muted select-none">
                ₫
              </span>
            </div>

            {/* Vietnamese Banknote Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleAddPreset(preset.value)}
                  className="px-2.5 py-1 rounded-md bg-surface border border-border hover:border-accent text-xs font-mono font-semibold text-foreground transition-colors cursor-pointer active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleMultiplyThousand}
                className="px-2.5 py-1 rounded-md bg-amber-900/10 border border-amber-900/30 text-amber-900 dark:text-amber-300 text-xs font-mono font-bold transition-colors cursor-pointer active:scale-95"
              >
                .000
              </button>
            </div>
          </div>

          {/* 3. Account Selector & Date (Consistent across all tabs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                <Wallet className="w-3.5 h-3.5" />
                <span>
                  {txType === 'TRANSFER' ? 'Từ ví nguồn' : 'Ví / Tài khoản'}
                </span>
              </label>
              <select
                value={effectiveAccountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
              >
                {(accounts || []).map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currentBalance.toLocaleString('vi-VN')} ₫)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Ngày ghi sổ</span>
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* 4. Fixed-Height Dynamic Slot: Category Grid (EXPENSE/INCOME) or Target Account (TRANSFER) */}
          <div className="h-[152px] flex flex-col">
            {txType !== 'TRANSFER' ? (
              <>
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5 shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                  <span>
                    Danh mục ({txType === 'EXPENSE' ? 'Chi tiêu' : 'Thu nhập'})
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 flex-1 content-start overflow-y-auto p-0.5">
                  {filteredCategories.map((cat) => {
                    const isSelected = effectiveCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
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
              </>
            ) : (
              <>
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5 shrink-0">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Sang ví đích nhận tiền</span>
                </label>
                <div className="flex-1 flex flex-col justify-between bg-surface-secondary/30 border border-border rounded-xl p-3">
                  <select
                    value={effectiveTargetAccountId}
                    onChange={(e) => setTargetAccountId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
                  >
                    {(accounts || []).map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currentBalance.toLocaleString('vi-VN')}{' '}
                        ₫)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted leading-relaxed px-0.5">
                    💡 Chuyển khoản nội bộ sẽ tự động trừ số dư ví nguồn và cộng
                    vào ví đích (hoặc giảm dư nợ nếu ví đích là Thẻ tín dụng).
                  </p>
                </div>
              </>
            )}
          </div>

          {/* 5. Note / Description */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Diễn giải / Ghi chú bút mực</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Cà phê sáng, Đổ xăng, Tiền nhà tháng 10..."
              className="w-full px-3.5 py-2 text-xs bg-surface border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={createTransactionMutation.isPending}
              className="px-4 py-2 text-xs font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createTransactionMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {createTransactionMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Lưu Vào Sổ Cái</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
