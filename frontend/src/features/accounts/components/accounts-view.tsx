'use client';

import { Plus, Wallet } from 'lucide-react';
import { useState } from 'react';

import { LedgerLoadingState, LedgerEmptyState } from '@/components/feedback';
import { Button, Alert, PageHeader } from '@/components/ui';

import { useAccounts, useDeleteAccount } from '../hooks/use-accounts';
import { AccountGroupSection } from './account-group-section';
import { CreateAccountModal } from './create-account-modal';
import { NetWorthSummaryCard } from './net-worth-summary-card';

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
    if (window.confirm(`Bạn có chắc chắn muốn lưu trữ ví "${name}" không?`)) {
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
            tone="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
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
        <Alert variant="danger">
          {error instanceof Error
            ? error.message
            : 'Lỗi tải danh sách tài khoản'}
        </Alert>
      ) : allAccounts.length === 0 ? (
        <LedgerEmptyState
          icon={<Wallet className="h-10 w-10 stroke-[1.5]" />}
          title="Chưa có tài khoản nào"
          description="Tạo ví tiền mặt hoặc tài khoản ngân hàng đầu tiên để bắt đầu ghi chép thu chi."
          action={
            <Button
              tone="primary"
              size="sm"
              onPress={() => setIsCreateModalOpen(true)}
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
