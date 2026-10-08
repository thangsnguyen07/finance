'use client';

import { useState } from 'react';
import { X, Wallet, Landmark, CreditCard, Smartphone, TrendingUp, Loader2 } from 'lucide-react';
import { useCreateAccount } from '@/hooks/use-accounts';
import type { AccountType } from '@/types/api';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCOUNT_TYPES: { type: AccountType; label: string; icon: typeof Wallet }[] = [
  { type: 'CASH', label: 'Tiền mặt', icon: Wallet },
  { type: 'BANK', label: 'Ngân hàng', icon: Landmark },
  { type: 'CREDIT_CARD', label: 'Thẻ tín dụng', icon: CreditCard },
  { type: 'E_WALLET', label: 'Ví điện tử', icon: Smartphone },
  { type: 'INVESTMENT', label: 'Đầu tư', icon: TrendingUp },
];

export function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('BANK');
  const [initialBalance, setInitialBalance] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [statementDay, setStatementDay] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateAccount();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Vui lòng nhập tên tài khoản / ví');
      return;
    }

    const parsedBalance = initialBalance ? parseInt(initialBalance.replace(/\D/g, ''), 10) : 0;
    const parsedCreditLimit = creditLimit ? parseInt(creditLimit.replace(/\D/g, ''), 10) : undefined;
    const parsedStatementDay = statementDay ? parseInt(statementDay, 10) : undefined;

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        type,
        initialBalance: isNaN(parsedBalance) ? 0 : parsedBalance,
        creditLimit: parsedCreditLimit,
        statementDay: parsedStatementDay,
      });

      // Reset form on success
      setName('');
      setInitialBalance('');
      setCreditLimit('');
      setStatementDay('');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã có lỗi xảy ra khi tạo tài khoản');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/25 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-surface text-foreground border border-border rounded-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary/40">
          <div>
            <h2 className="font-serif font-bold text-lg text-foreground">
              Mở tài khoản mới
            </h2>
            <p className="text-xs text-muted">
              Định dạng sổ theo phong cách Paperlike
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-danger bg-danger/10 border border-danger/20 rounded-md">
              {error}
            </div>
          )}

          {/* Account Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Loại tài khoản
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_TYPES.map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setType(item.type)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-md border text-xs transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/5 text-accent font-semibold shadow-xs'
                        : 'border-border bg-surface-secondary/30 text-muted hover:border-border/80 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Name Input */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Tên tài khoản / Ngân hàng
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Techcombank, MoMo, Ví Tiền mặt"
              className="w-full px-3.5 py-2 text-sm bg-surface-secondary/20 border border-border rounded-md text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>

          {/* Initial Balance Input */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              {type === 'CREDIT_CARD' ? 'Dư nợ hiện tại (₫)' : 'Số dư ban đầu (₫)'}
            </label>
            <input
              type="text"
              value={initialBalance}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                setInitialBalance(raw ? Number(raw).toLocaleString('vi-VN') : '');
              }}
              placeholder="0 ₫"
              className="w-full px-3.5 py-2 text-sm font-mono bg-surface-secondary/20 border border-border rounded-md text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Credit Card Specific Fields */}
          {type === 'CREDIT_CARD' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Hạn mức tín dụng (₫)
                </label>
                <input
                  type="text"
                  value={creditLimit}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setCreditLimit(raw ? Number(raw).toLocaleString('vi-VN') : '');
                  }}
                  placeholder="20.000.000 ₫"
                  className="w-full px-3.5 py-2 text-sm font-mono bg-surface-secondary/20 border border-border rounded-md text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Ngày sao kê (1-31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={statementDay}
                  onChange={(e) => setStatementDay(e.target.value)}
                  placeholder="20"
                  className="w-full px-3.5 py-2 text-sm font-mono bg-surface-secondary/20 border border-border rounded-md text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md shadow-xs hover:opacity-95 active:scale-98 transition-all disabled:opacity-50"
            >
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>Tạo tài khoản</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
