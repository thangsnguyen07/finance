'use client';

import { Modal } from '@/components/feedback';
import { ChoiceGroup, Field, Stack, VndAmountInput } from '@/components/ui';

import {
  ACCOUNT_INITIAL_BALANCE_LABEL_OVERRIDES,
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_OPTIONS,
  DEFAULT_INITIAL_BALANCE_LABEL,
} from '../constants/account.constants';
import { useCreateAccountForm } from '../hooks/use-accounts';
import { ACCOUNT_TYPE } from '../types/account.types';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  const {
    name,
    setName,
    type,
    setType,
    initialBalance,
    setInitialBalance,
    creditLimit,
    setCreditLimit,
    statementDay,
    setStatementDay,
    error,
    isPending,
    handleClose,
    handleSubmit,
  } = useCreateAccountForm({ onClose });

  const initialBalanceLabel =
    ACCOUNT_INITIAL_BALANCE_LABEL_OVERRIDES[type] ??
    DEFAULT_INITIAL_BALANCE_LABEL;

  const accountTypeChoices = ACCOUNT_TYPE_OPTIONS.map((typeOption) => ({
    value: typeOption,
    label: ACCOUNT_TYPE_LABELS[typeOption],
    icon: ACCOUNT_TYPE_ICONS[typeOption],
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Mở tài khoản mới"
      subtitle="Thiết lập ví tiền mặt, ngân hàng hoặc thẻ tín dụng"
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Tạo tài khoản"
      isSubmitting={isPending}
    >
      <ChoiceGroup
        label="Loại tài khoản"
        variant="icon-grid"
        cols={3}
        value={type}
        onChange={setType}
        items={accountTypeChoices}
      />

      <Field.Input
        label="Tên tài khoản / Ngân hàng"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="VD: Techcombank, MoMo, Ví Tiền mặt..."
        autoFocus
      />

      <VndAmountInput
        label={initialBalanceLabel}
        amount={initialBalance}
        onChange={setInitialBalance}
        showThousandMultiplier
      />

      {type === ACCOUNT_TYPE.CREDIT_CARD ? (
        <Stack gap="md">
          <VndAmountInput
            label="Hạn mức tín dụng tối đa (VND)"
            amount={creditLimit}
            onChange={setCreditLimit}
            showThousandMultiplier
          />

          <Field.Input
            label="Ngày chốt sao kê hàng tháng (1–31)"
            type="number"
            min="1"
            max="31"
            value={statementDay}
            onChange={(e) => setStatementDay(e.target.value)}
            placeholder="20"
            mono
          />
        </Stack>
      ) : null}
    </Modal>
  );
}
