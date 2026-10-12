'use client';

import { Modal } from '@/components/feedback';
import { Button, Field, Alert, VndAmountInput } from '@/components/ui';

import {
  ACCOUNT_TYPE_CONFIG,
  ACCOUNT_TYPE_OPTIONS,
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

  const selectedTypeConfig = ACCOUNT_TYPE_CONFIG[type];

  return (
    <Modal.Root isOpen={isOpen} onClose={handleClose} maxWidthClass="max-w-md">
      <Modal.Header
        title="Mở tài khoản mới"
        subtitle="Thiết lập ví tiền mặt, ngân hàng hoặc thẻ tín dụng"
        onClose={handleClose}
      />

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Field.Root>
            <Field.Label>Loại tài khoản</Field.Label>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_TYPE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setType(item.type)}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2.5 text-xs transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/10 font-semibold text-accent shadow-2xs'
                        : 'border-border bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="mb-1 h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </Field.Root>

          <Field.Root>
            <Field.Label>Tên tài khoản / Ngân hàng</Field.Label>
            <Field.Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Techcombank, MoMo, Ví Tiền mặt..."
              autoFocus
            />
          </Field.Root>

          <VndAmountInput
            label={selectedTypeConfig.initialBalanceLabel}
            amount={initialBalance}
            onChange={setInitialBalance}
            showThousandMultiplier
          />

          {type === ACCOUNT_TYPE.CREDIT_CARD ? (
            <div className="space-y-3 pt-1">
              <VndAmountInput
                label="Hạn mức tín dụng tối đa (VND)"
                amount={creditLimit}
                onChange={setCreditLimit}
                showThousandMultiplier
              />

              <Field.Root>
                <Field.Label>Ngày chốt sao kê hàng tháng (1–31)</Field.Label>
                <Field.Input
                  type="number"
                  min="1"
                  max="31"
                  value={statementDay}
                  onChange={(e) => setStatementDay(e.target.value)}
                  placeholder="20"
                  mono
                />
              </Field.Root>
            </div>
          ) : null}

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
                <span>Tạo tài khoản</span>
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal.Root>
  );
}
