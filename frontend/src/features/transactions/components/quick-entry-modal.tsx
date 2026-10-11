'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Loader2,
  Wallet,
  Calendar,
  FileText,
  Tag,
} from 'lucide-react';
import { PaperModal } from '@/components/feedback/paper-modal';
import { VndAmountInput } from '@/components/ui/vnd-amount-input';
import { getTodayDateString } from '@/lib/date-utils';
import { useAccounts } from '@/features/accounts';
import { useCategories } from '@/features/categories';
import { TRANSACTION_AMOUNT_PRESETS } from '../constants/transaction.constants';
import { useCreateTransaction } from '../hooks/use-transactions';
import type { TransactionType } from '../types/transaction.types';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  const handleClose = () => {
    setTxType('EXPENSE');
    setRawAmount(0);
    setAccountId('');
    setTargetAccountId('');
    setCategoryId('');
    setTransactionDate(getTodayDateString());
    setDescription('');
    setError(null);
    onClose();
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

      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể lưu giao dịch. Vui lòng thử lại.');
      }
    }
  };

  return (
    <PaperModal.Root isOpen={isOpen} onClose={handleClose}>
      <PaperModal.Header
        title="✍️ Ghi Sổ Giao Dịch Mới"
        subtitle="Cập nhật tức thì vào số dư ví & sổ cái"
        onClose={handleClose}
      />

      <form onSubmit={handleSubmit}>
        <PaperModal.Body>
          {error ? (
            <div className="p-3 text-xs text-danger bg-danger/10 border border-danger/20 rounded-md">
              {error}
            </div>
          ) : null}

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

          {/* 2. Reusable VND Amount Input with Banknote Presets */}
          <VndAmountInput
            label="Số tiền giao dịch (VND)"
            amount={rawAmount}
            onChange={setRawAmount}
            presets={TRANSACTION_AMOUNT_PRESETS}
            showThousandMultiplier
            autoFocus
          />

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

          {/* 4. Fixed-Height Dynamic Slot: Category Grid or Target Account */}
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

          <PaperModal.Footer>
            <div />
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                isDisabled={createTransactionMutation.isPending}
                onPress={handleClose}
                className="text-xs font-medium"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isDisabled={createTransactionMutation.isPending}
                className="px-5 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                {createTransactionMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Lưu Vào Sổ Cái</span>
              </Button>
            </div>
          </PaperModal.Footer>
        </PaperModal.Body>
      </form>
    </PaperModal.Root>
  );
}
