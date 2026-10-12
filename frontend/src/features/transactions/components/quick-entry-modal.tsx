'use client';

import { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Wallet,
  Calendar,
  FileText,
  Tag,
} from 'lucide-react';
import { Modal } from '@/components/feedback';
import {
  Button,
  Field,
  Alert,
  SegmentedControl,
  VndAmountInput,
} from '@/components/ui';
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
    <Modal.Root isOpen={isOpen} onClose={handleClose}>
      <Modal.Header
        title="✍️ Ghi Sổ Giao Dịch Mới"
        subtitle="Cập nhật tức thì vào số dư ví & sổ cái"
        onClose={handleClose}
      />

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {error ? <Alert variant="danger">{error}</Alert> : null}

          {/* 1. Transaction Type Tabs */}
          <SegmentedControl<TransactionType>
            value={txType}
            onChange={setTxType}
            fullWidth
            options={[
              {
                value: 'EXPENSE',
                label: (
                  <>
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Chi tiêu</span>
                  </>
                ),
                activeClassName: 'bg-danger text-white shadow-xs',
              },
              {
                value: 'INCOME',
                label: (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Thu nhập</span>
                  </>
                ),
                activeClassName: 'bg-success text-white shadow-xs',
              },
              {
                value: 'TRANSFER',
                label: (
                  <>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Chuyển khoản</span>
                  </>
                ),
                activeClassName: 'bg-accent text-white shadow-xs',
              },
            ]}
          />

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
            <Field.Root>
              <Field.Label
                icon={<Wallet className="w-3.5 h-3.5" />}
                uppercase
              >
                {txType === 'TRANSFER' ? 'Từ ví nguồn' : 'Ví / Tài khoản'}
              </Field.Label>
              <Field.Select
                value={effectiveAccountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {(accounts || []).map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currentBalance.toLocaleString('vi-VN')} ₫)
                  </option>
                ))}
              </Field.Select>
            </Field.Root>

            <Field.Root>
              <Field.Label
                icon={<Calendar className="w-3.5 h-3.5" />}
                uppercase
              >
                Ngày ghi sổ
              </Field.Label>
              <Field.Input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                mono
              />
            </Field.Root>
          </div>

          {/* 4. Fixed-Height Dynamic Slot: Category Grid or Target Account */}
          <div className="h-[152px] flex flex-col">
            {txType !== 'TRANSFER' ? (
              <>
                <Field.Label
                  icon={<Tag className="w-3.5 h-3.5" />}
                  uppercase
                  className="mb-1.5 shrink-0"
                >
                  Danh mục ({txType === 'EXPENSE' ? 'Chi tiêu' : 'Thu nhập'})
                </Field.Label>
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
                <Field.Label
                  icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                  uppercase
                  className="mb-1.5 shrink-0"
                >
                  Sang ví đích nhận tiền
                </Field.Label>
                <div className="flex-1 flex flex-col justify-between bg-surface-secondary/30 border border-border rounded-xl p-3">
                  <Field.Select
                    value={effectiveTargetAccountId}
                    onChange={(e) => setTargetAccountId(e.target.value)}
                  >
                    {(accounts || []).map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currentBalance.toLocaleString('vi-VN')}{' '}
                        ₫)
                      </option>
                    ))}
                  </Field.Select>
                  <p className="text-[11px] text-muted leading-relaxed px-0.5">
                    💡 Chuyển khoản nội bộ sẽ tự động trừ số dư ví nguồn và cộng
                    vào ví đích (hoặc giảm dư nợ nếu ví đích là Thẻ tín dụng).
                  </p>
                </div>
              </>
            )}
          </div>

          {/* 5. Note / Description */}
          <Field.Root>
            <Field.Label
              icon={<FileText className="w-3.5 h-3.5" />}
              uppercase
            >
              Diễn giải / Ghi chú bút mực
            </Field.Label>
            <Field.Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Cà phê sáng, Đổ xăng, Tiền nhà tháng 10..."
            />
          </Field.Root>

          <Modal.Footer>
            <div />
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                tone="ghost"
                size="sm"
                isDisabled={createTransactionMutation.isPending}
                onPress={handleClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                tone="primary"
                size="sm"
                isLoading={createTransactionMutation.isPending}
                className="px-5 py-2"
              >
                <span>Lưu Vào Sổ Cái</span>
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal.Root>
  );
}
