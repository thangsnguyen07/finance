'use client';

import { ArrowRightLeft, Wallet, Calendar, FileText, Tag } from 'lucide-react';

import { Modal } from '@/components/feedback';
import {
  Button,
  Field,
  Alert,
  SegmentedControl,
  VndAmountInput,
} from '@/components/ui';

import {
  DEFAULT_ACCOUNT_FIELD_LABEL,
  TRANSACTION_ACCOUNT_FIELD_LABEL_OVERRIDES,
  TRANSACTION_AMOUNT_PRESETS,
  TRANSACTION_CATEGORY_SECTION_LABELS,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_TYPE_TONES,
} from '../constants/transaction.constants';
import { useQuickEntryForm } from '../hooks/use-transactions';
import {
  TRANSACTION_TYPE,
  type TransactionType,
} from '../types/transaction.types';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickEntryModal({ isOpen, onClose }: QuickEntryModalProps) {
  const {
    txType,
    setTxType,
    rawAmount,
    setRawAmount,
    accounts,
    filteredCategories,
    effectiveAccountId,
    setAccountId,
    effectiveTargetAccountId,
    setTargetAccountId,
    effectiveCategoryId,
    setCategoryId,
    transactionDate,
    setTransactionDate,
    description,
    setDescription,
    error,
    isPending,
    handleClose,
    handleSubmit,
  } = useQuickEntryForm({ onClose });

  const accountFieldLabel =
    TRANSACTION_ACCOUNT_FIELD_LABEL_OVERRIDES[txType] ??
    DEFAULT_ACCOUNT_FIELD_LABEL;

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

          <SegmentedControl<TransactionType>
            value={txType}
            onChange={setTxType}
            fullWidth
            options={TRANSACTION_TYPE_OPTIONS.map((typeOption) => {
              const Icon = TRANSACTION_TYPE_ICONS[typeOption];
              return {
                value: typeOption,
                label: (
                  <>
                    <Icon className="h-3.5 w-3.5" />
                    <span>{TRANSACTION_TYPE_LABELS[typeOption]}</span>
                  </>
                ),
                tone: TRANSACTION_TYPE_TONES[typeOption],
              };
            })}
          />

          <VndAmountInput
            label="Số tiền giao dịch (VND)"
            amount={rawAmount}
            onChange={setRawAmount}
            presets={TRANSACTION_AMOUNT_PRESETS}
            showThousandMultiplier
            autoFocus
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field.Root>
              <Field.Label icon={<Wallet className="h-3.5 w-3.5" />} uppercase>
                {accountFieldLabel}
              </Field.Label>
              <Field.Select
                value={effectiveAccountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currentBalance.toLocaleString('vi-VN')} ₫)
                  </option>
                ))}
              </Field.Select>
            </Field.Root>

            <Field.Root>
              <Field.Label
                icon={<Calendar className="h-3.5 w-3.5" />}
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

          <div className="flex h-[152px] flex-col">
            {txType !== TRANSACTION_TYPE.TRANSFER ? (
              <>
                <Field.Label
                  icon={<Tag className="h-3.5 w-3.5" />}
                  uppercase
                  className="mb-1.5 shrink-0"
                >
                  {TRANSACTION_CATEGORY_SECTION_LABELS[txType]}
                </Field.Label>
                <div className="grid flex-1 grid-cols-2 content-start gap-2 overflow-y-auto p-0.5">
                  {filteredCategories.map((cat) => {
                    const isSelected = effectiveCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
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
              </>
            ) : (
              <>
                <Field.Label
                  icon={<ArrowRightLeft className="h-3.5 w-3.5" />}
                  uppercase
                  className="mb-1.5 shrink-0"
                >
                  Sang ví đích nhận tiền
                </Field.Label>
                <div className="flex flex-1 flex-col justify-between rounded-xl border border-border bg-surface-secondary/30 p-3">
                  <Field.Select
                    value={effectiveTargetAccountId}
                    onChange={(e) => setTargetAccountId(e.target.value)}
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.currentBalance.toLocaleString('vi-VN')}{' '}
                        ₫)
                      </option>
                    ))}
                  </Field.Select>
                  <p className="px-0.5 text-[11px] leading-relaxed text-muted">
                    💡 Chuyển khoản nội bộ sẽ tự động trừ số dư ví nguồn và cộng
                    vào ví đích (hoặc giảm dư nợ nếu ví đích là Thẻ tín dụng).
                  </p>
                </div>
              </>
            )}
          </div>

          <Field.Root>
            <Field.Label icon={<FileText className="h-3.5 w-3.5" />} uppercase>
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
                isDisabled={isPending}
                onPress={handleClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                tone="primary"
                size="sm"
                isLoading={isPending}
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
