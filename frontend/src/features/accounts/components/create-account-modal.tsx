'use client';

import { useState } from 'react';
import { Modal } from '@/components/feedback';
import { Button, Field, Alert, VndAmountInput } from '@/components/ui';
import { ACCOUNT_TYPE_OPTIONS } from '../constants/account.constants';
import { useCreateAccount } from '../hooks/use-accounts';
import type { AccountType } from '../types/account.types';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('BANK');
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [creditLimit, setCreditLimit] = useState<number>(0);
  const [statementDay, setStatementDay] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateAccount();

  const handleClose = () => {
    setName('');
    setType('BANK');
    setInitialBalance(0);
    setCreditLimit(0);
    setStatementDay('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Vui lòng nhập tên tài khoản / ví');
      return;
    }

    const parsedStatementDay = statementDay
      ? parseInt(statementDay, 10)
      : undefined;

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        type,
        initialBalance,
        creditLimit:
          type === 'CREDIT_CARD' && creditLimit > 0 ? creditLimit : undefined,
        statementDay: type === 'CREDIT_CARD' ? parsedStatementDay : undefined,
      });

      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã có lỗi xảy ra khi tạo tài khoản');
      }
    }
  };

  return (
    <Modal.Root
      isOpen={isOpen}
      onClose={handleClose}
      maxWidthClass="max-w-md"
    >
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
                        ? 'border-accent-coral bg-accent-coral/10 font-semibold text-accent-coral shadow-2xs'
                        : 'border-ledger-border bg-paper-surface text-ink-secondary hover:text-ink-primary'
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
            label={
              type === 'CREDIT_CARD'
                ? 'Dư nợ hiện tại (VND)'
                : 'Số dư ban đầu (VND)'
            }
            amount={initialBalance}
            onChange={setInitialBalance}
            showThousandMultiplier
          />

          {type === 'CREDIT_CARD' ? (
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
                isDisabled={createMutation.isPending}
                onPress={handleClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                tone="primary"
                size="sm"
                isLoading={createMutation.isPending}
              >
                Tạo tài khoản
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal.Root>
  );
}
