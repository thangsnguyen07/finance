'use client';

import { useState } from 'react';
import {
  Wallet,
  Landmark,
  CreditCard,
  Smartphone,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  MoreVertical,
  Loader2,
  Archive,
} from 'lucide-react';
import { useAccounts, useDeleteAccount } from '@/hooks/use-accounts';
import { CreateAccountModal } from '@/components/accounts/create-account-modal';
import type { AccountResponse, AccountType } from '@/types/api';

const TYPE_CONFIG: Record<
  AccountType,
  { label: string; icon: typeof Wallet; colorClass: string }
> = {
  CASH: {
    label: 'Tiền mặt',
    icon: Wallet,
    colorClass: 'text-amber-700 bg-amber-500/10 border-amber-600/20',
  },
  BANK: {
    label: 'Ngân hàng',
    icon: Landmark,
    colorClass: 'text-blue-700 bg-blue-500/10 border-blue-600/20',
  },
  CREDIT_CARD: {
    label: 'Thẻ tín dụng',
    icon: CreditCard,
    colorClass: 'text-rose-700 bg-rose-500/10 border-rose-600/20',
  },
  E_WALLET: {
    label: 'Ví điện tử',
    icon: Smartphone,
    colorClass: 'text-purple-700 bg-purple-500/10 border-purple-600/20',
  },
  INVESTMENT: {
    label: 'Đầu tư',
    icon: TrendingUp,
    colorClass: 'text-emerald-700 bg-emerald-500/10 border-emerald-600/20',
  },
};

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { data: accounts, isLoading, error } = useAccounts();
  const deleteMutation = useDeleteAccount();

  // Calculations for Net Worth Summary
  const assetAccounts = (accounts || []).filter(
    (acc) => acc.type !== 'CREDIT_CARD',
  );
  const creditAccounts = (accounts || []).filter(
    (acc) => acc.type === 'CREDIT_CARD',
  );

  const totalAssets = assetAccounts.reduce(
    (sum, acc) => sum + (acc.current_balance || 0),
    0,
  );
  const totalDebt = creditAccounts.reduce(
    (sum, acc) => sum + (acc.current_balance || 0),
    0,
  );
  const netWorth = totalAssets - totalDebt;

  // Group accounts for display
  const cashAndWallets = (accounts || []).filter(
    (acc) => acc.type === 'CASH' || acc.type === 'E_WALLET',
  );
  const bankAccounts = (accounts || []).filter((acc) => acc.type === 'BANK');
  const creditCards = creditAccounts;
  const investments = (accounts || []).filter(
    (acc) => acc.type === 'INVESTMENT',
  );

  const handleArchive = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn lưu trữ tài khoản này không?')) {
      await deleteMutation.mutateAsync(id);
      setActiveMenuId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif font-bold text-2xl text-foreground tracking-tight">
            Sổ Quản Lý Tài Khoản
          </h1>
          <p className="text-xs text-muted mt-1">
            Tổng hợp các nguồn tiền, tài khoản ngân hàng và thẻ tín dụng
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md shadow-xs hover:opacity-95 active:scale-98 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Mở tài khoản mới</span>
        </button>
      </div>

      {/* Net Worth Ledger Summary Card */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/60">
          <Scale className="w-4 h-4 text-accent" />
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Tài sản ròng (Net Worth)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-muted">Tổng giá trị ròng</span>
            <p
              className={`font-serif text-2xl font-bold mt-1 tracking-tight ${
                netWorth >= 0 ? 'text-foreground' : 'text-danger'
              }`}
            >
              {formatVND(netWorth)}
            </p>
          </div>

          <div className="sm:border-l sm:border-border/60 sm:pl-4">
            <div className="flex items-center gap-1.5 text-xs text-success">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Tổng tài sản khả dụng</span>
            </div>
            <p className="font-mono text-lg font-semibold text-foreground mt-1">
              {formatVND(totalAssets)}
            </p>
            <span className="text-[11px] text-muted">
              {assetAccounts.length} nguồn tiền
            </span>
          </div>

          <div className="sm:border-l sm:border-border/60 sm:pl-4">
            <div className="flex items-center gap-1.5 text-xs text-danger">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Tổng dư nợ thẻ</span>
            </div>
            <p className="font-mono text-lg font-semibold text-danger mt-1">
              {formatVND(totalDebt)}
            </p>
            <span className="text-[11px] text-muted">
              {creditCards.length} thẻ tín dụng
            </span>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-muted">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-xs">Đang tải sổ tài khoản...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger text-sm rounded-md">
          {error instanceof Error ? error.message : 'Lỗi tải danh sách tài khoản'}
        </div>
      )}

      {/* Account Groups */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {/* Section: Tiền mặt & Ví điện tử */}
          {cashAndWallets.length > 0 && (
            <AccountSection
              title="Tiền mặt & Ví điện tử"
              accounts={cashAndWallets}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onArchive={handleArchive}
            />
          )}

          {/* Section: Ngân hàng */}
          {bankAccounts.length > 0 && (
            <AccountSection
              title="Tài khoản Ngân hàng"
              accounts={bankAccounts}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onArchive={handleArchive}
            />
          )}

          {/* Section: Thẻ tín dụng */}
          {creditCards.length > 0 && (
            <AccountSection
              title="Thẻ tín dụng"
              accounts={creditCards}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onArchive={handleArchive}
              isCredit
            />
          )}

          {/* Section: Đầu tư */}
          {investments.length > 0 && (
            <AccountSection
              title="Tài khoản Đầu tư"
              accounts={investments}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onArchive={handleArchive}
            />
          )}

          {/* Empty state if zero accounts */}
          {(accounts || []).length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-lg bg-surface/50">
              <Wallet className="w-10 h-10 text-muted mx-auto mb-3 stroke-[1.5]" />
              <h3 className="font-serif font-bold text-base text-foreground">
                Chưa có tài khoản nào
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
                Tạo ví tiền mặt hoặc tài khoản ngân hàng đầu tiên để bắt đầu ghi
                chép thu chi.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-xs font-medium bg-accent text-accent-foreground rounded-md shadow-xs hover:opacity-95"
              >
                + Mở tài khoản ngay
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

interface AccountSectionProps {
  title: string;
  accounts: AccountResponse[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onArchive: (id: string) => void;
  isCredit?: boolean;
}

function AccountSection({
  title,
  accounts,
  activeMenuId,
  setActiveMenuId,
  onArchive,
  isCredit,
}: AccountSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
          {title} ({accounts.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {accounts.map((account) => {
          const config = TYPE_CONFIG[account.type];
          const Icon = config.icon;
          const isMenuOpen = activeMenuId === account.id;

          const balance = account.current_balance || 0;
          const creditLimit = account.credit_limit || 0;
          const remainingLimit = creditLimit - balance;

          return (
            <div
              key={account.id}
              className="relative flex items-center justify-between p-4 bg-surface border border-border rounded-lg shadow-xs hover:border-border/80 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center border shrink-0 ${config.colorClass}`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="min-w-0 truncate">
                  <h4 className="font-semibold text-sm text-foreground truncate">
                    {account.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted">
                      {config.label}
                    </span>
                    {account.statement_day && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-secondary text-muted">
                        Sao kê: ngày {account.statement_day}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount and Actions */}
              <div className="flex items-center gap-2 text-right shrink-0">
                <div>
                  <p
                    className={`font-mono font-bold text-sm ${
                      isCredit ? 'text-danger' : 'text-foreground'
                    }`}
                  >
                    {isCredit && balance > 0 ? '-' : ''}
                    {formatVND(balance)}
                  </p>
                  {isCredit && creditLimit > 0 && (
                    <p className="text-[10px] text-muted font-mono mt-0.5">
                      Hạn mức còn: {formatVND(remainingLimit)}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId(isMenuOpen ? null : account.id)
                    }
                    className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                    aria-label="Tùy chọn tài khoản"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-7 w-32 bg-surface border border-border rounded-md shadow-lg py-1 z-10 text-xs">
                      <button
                        type="button"
                        onClick={() => onArchive(account.id)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-danger hover:bg-danger/10 transition-colors text-left"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Lưu trữ ví</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
