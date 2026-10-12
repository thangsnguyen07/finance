'use client';

import { ArrowRightLeft, Wallet, Calendar, FileText, Tag } from 'lucide-react';

import { Modal } from '@/components/feedback';
import {
  ChoiceGroup,
  Field,
  Grid,
  SegmentedControl,
  Stack,
  Text,
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

  const accountSelectOptions = accounts.map((acc) => ({
    value: acc.id,
    label: `${acc.name} (${acc.currentBalance.toLocaleString('vi-VN')} ₫)`,
  }));

  const categoryChoices = filteredCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="✍️ Ghi Sổ Giao Dịch Mới"
      subtitle="Cập nhật tức thì vào số dư ví & sổ cái"
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Lưu Vào Sổ Cái"
      isSubmitting={isPending}
    >
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

      <Grid cols={2} gap="md">
        <Field.Select
          label={accountFieldLabel}
          icon={<Wallet className="h-3.5 w-3.5" />}
          uppercaseLabel
          value={effectiveAccountId}
          onChange={(e) => setAccountId(e.target.value)}
          options={accountSelectOptions}
        />

        <Field.Input
          label="Ngày ghi sổ"
          icon={<Calendar className="h-3.5 w-3.5" />}
          uppercaseLabel
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          mono
        />
      </Grid>

      <div className="flex h-[152px] flex-col">
        {txType !== TRANSACTION_TYPE.TRANSFER ? (
          <ChoiceGroup
            label={TRANSACTION_CATEGORY_SECTION_LABELS[txType]}
            labelIcon={<Tag className="h-3.5 w-3.5" />}
            uppercaseLabel
            variant="compact-grid"
            cols={2}
            scrollable
            value={effectiveCategoryId}
            onChange={setCategoryId}
            items={categoryChoices}
            className="h-full"
          />
        ) : (
          <Stack gap="xs" className="h-full">
            <Field.Label
              icon={<ArrowRightLeft className="h-3.5 w-3.5" />}
              uppercase
              className="shrink-0"
            >
              Sang ví đích nhận tiền
            </Field.Label>
            <Stack
              justify="between"
              className="flex-1 rounded-xl border border-border bg-surface-secondary/30 p-3"
            >
              <Field.Select
                value={effectiveTargetAccountId}
                onChange={(e) => setTargetAccountId(e.target.value)}
                options={accountSelectOptions}
              />
              <Text
                variant="caption"
                tone="muted"
                className="px-0.5 leading-relaxed"
              >
                💡 Chuyển khoản nội bộ sẽ tự động trừ số dư ví nguồn và cộng vào
                ví đích (hoặc giảm dư nợ nếu ví đích là Thẻ tín dụng).
              </Text>
            </Stack>
          </Stack>
        )}
      </div>

      <Field.Input
        label="Diễn giải / Ghi chú bút mực"
        icon={<FileText className="h-3.5 w-3.5" />}
        uppercaseLabel
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="VD: Cà phê sáng, Đổ xăng, Tiền nhà tháng 10..."
      />
    </Modal>
  );
}
