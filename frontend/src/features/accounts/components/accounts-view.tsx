'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Plus, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { LedgerLoadingState } from '@/components/feedback/ledger-loading-state';
import { LedgerEmptyState } from '@/components/feedback/ledger-empty-state';
import { useAccounts, useDeleteAccount } from '../hooks/use-accounts';
import { NetWorthSummaryCard } from './net-worth-summary-card';
import { AccountGroupSection } from './account-group-section';
import { CreateAccountModal } from './create-account-modal';

export function AccountsView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: accounts, isLoading, error } = useAccounts();
  const deleteMutation = useDeleteAccount();

  const allAccounts = accounts || [];
  const assetAccounts = allAccounts.filter((acc) => acc.type !== 'CREDIT_CARD');
  const creditCards = allAccounts.filter((acc) => acc.type === 'CREDIT_CARD');

  const totalAssets = assetAccounts.reduce(
    (sum, acc) => sum + (acc.currentBalance || 0),
    0,
  );
  const totalDebt = creditCards.reduce(
    (sum, acc) => sum + (acc.currentBalance || 0),
    0,
  );
  const netWorth = totalAssets - totalDebt;

  const cashAndWallets = allAccounts.filter(
    (acc) => acc.type === 'CASH' || acc.type === 'E_WALLET',
  );
  const bankAccounts = allAccounts.filter((acc) => acc.type === 'BANK');
  const investments = allAccounts.filter((acc) => acc.type === 'INVESTMENT');

  const handleArchive = async (id: string, name: string) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn lưu trữ ví "${name}" không?`)
    ) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader.Root>
        <PageHeader.Content
          title="Sổ Quản Lý Tài Khoản"
          description="Tổng hợp các nguồn tiền, tài khoản ngân hàng và thẻ tín dụng"
        />
        <PageHeader.Actions>
          <Button
            variant="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Mở tài khoản mới</span>
          </Button>
        </PageHeader.Actions>
      </PageHeader.Root>

      <NetWorthSummaryCard
        netWorth={netWorth}
        totalAssets={totalAssets}
        assetCount={assetAccounts.length}
        totalDebt={totalDebt}
        creditCardCount={creditCards.length}
      />

      {isLoading ? (
        <LedgerLoadingState message="Đang tải sổ tài khoản..." />
      ) : error ? (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger text-xs rounded-lg">
          {error instanceof Error
            ? error.message
            : 'Lỗi tải danh sách tài khoản'}
        </div>
      ) : allAccounts.length === 0 ? (
        <LedgerEmptyState
          icon={<Wallet className="w-10 h-10 stroke-[1.5]" />}
          title="Chưa có tài khoản nào"
          description="Tạo ví tiền mặt hoặc tài khoản ngân hàng đầu tiên để bắt đầu ghi chép thu chi."
          action={
            <Button
              variant="primary"
              size="sm"
              onPress={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-xs font-bold bg-amber-900 text-amber-100 rounded-lg"
            >
              + Mở tài khoản ngay
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <AccountGroupSection
            title="Tiền mặt & Ví điện tử"
            accounts={cashAndWallets}
            onArchive={handleArchive}
          />
          <AccountGroupSection
            title="Tài khoản Ngân hàng"
            accounts={bankAccounts}
            onArchive={handleArchive}
          />
          <AccountGroupSection
            title="Thẻ tín dụng"
            accounts={creditCards}
            onArchive={handleArchive}
            variant="credit"
          />
          <AccountGroupSection
            title="Tài khoản Đầu tư"
            accounts={investments}
            onArchive={handleArchive}
          />
        </div>
      )}

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
