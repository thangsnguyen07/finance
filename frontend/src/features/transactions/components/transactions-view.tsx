'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Receipt, BarChart3 } from 'lucide-react';
import { Button, Alert, PageHeader } from '@/components/ui';
import { LedgerLoadingState, LedgerEmptyState } from '@/components/feedback';
import { useUiStore } from '@/stores/use-ui-store';
import { useAccounts } from '@/features/accounts';
import {
  useTransactions,
  useDeleteTransaction,
} from '../hooks/use-transactions';
import { TransactionSummaryCards } from './transaction-summary-cards';
import { TransactionFilterBar } from './transaction-filter-bar';
import { TransactionLedgerList } from './transaction-ledger-list';
import type { TransactionType } from '../types/transaction.types';

export function TransactionsView() {
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [filterAccountId, setFilterAccountId] = useState<string>('');
  const openQuickEntry = useUiStore((state) => state.openQuickEntry);

  const { data: accounts } = useAccounts();
  const {
    data: txData,
    isLoading,
    isError,
  } = useTransactions({
    type: filterType === 'ALL' ? undefined : filterType,
    accountId: filterAccountId || undefined,
    limit: 50,
  });
  const deleteMutation = useDeleteTransaction();

  const items = txData?.items || [];

  const totalIncome = items
    .filter((tx) => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = items
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleDelete = async (id: string, label: string) => {
    if (
      window.confirm(
        `Xóa giao dịch "${label}"? Số dư ví liên quan sẽ được hoàn lại tự động.`,
      )
    ) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader.Root>
        <PageHeader.Content
          title="Sổ Nhật Ký Giao Dịch"
          description="Ghi chép thu chi bút mực, tự động cập nhật số dư sổ cái"
        />
        <PageHeader.Actions>
          <Link
            href="/reports"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-ledger-border bg-paper-surface px-3 py-2 text-xs font-medium text-ink-primary shadow-2xs transition-colors hover:border-accent-coral"
          >
            <BarChart3 className="h-3.5 w-3.5 text-accent-coral" />
            <span>Xem báo cáo</span>
          </Link>

          <Button tone="primary" size="sm" onPress={openQuickEntry}>
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Ghi giao dịch mới</span>
          </Button>
        </PageHeader.Actions>
      </PageHeader.Root>

      <TransactionSummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />

      <TransactionFilterBar
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterAccountId={filterAccountId}
        onFilterAccountChange={setFilterAccountId}
        accounts={accounts || []}
      />

      {isLoading ? (
        <LedgerLoadingState message="Đang mở sổ nhật ký..." />
      ) : isError ? (
        <Alert variant="danger">
          Không thể tải dữ liệu giao dịch. Vui lòng kiểm tra kết nối máy chủ.
        </Alert>
      ) : items.length === 0 ? (
        <LedgerEmptyState
          icon={<Receipt className="h-10 w-10 stroke-[1.5]" />}
          title="Chưa có bút toán nào trong sổ"
          description="Nhấn vào nút Ghi giao dịch mới hoặc dấu + ở thanh điều hướng để ghi lại khoản thu chi đầu tiên."
          action={
            <Button tone="primary" size="sm" onPress={openQuickEntry}>
              + Ghi bút toán đầu tiên
            </Button>
          }
        />
      ) : (
        <TransactionLedgerList
          items={items}
          totalCount={txData?.total || items.length}
          isDeleting={deleteMutation.isPending}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
