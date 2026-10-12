'use client';

import { Plus, Receipt, BarChart3 } from 'lucide-react';
import Link from 'next/link';

import { LedgerLoadingState, LedgerEmptyState } from '@/components/feedback';
import { Button, Alert, PageHeader } from '@/components/ui';

import { useTransactionLedger } from '../hooks/use-transactions';
import { TransactionFilterBar } from './transaction-filter-bar';
import { TransactionLedgerList } from './transaction-ledger-list';
import { TransactionSummaryCards } from './transaction-summary-cards';

export function TransactionsView() {
  const {
    filterType,
    setFilterType,
    filterAccountId,
    setFilterAccountId,
    accounts,
    items,
    totalCount,
    totalIncome,
    totalExpense,
    isLoading,
    isError,
    isDeleting,
    openQuickEntry,
    handleDelete,
  } = useTransactionLedger();

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
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground shadow-2xs transition-colors hover:border-accent"
          >
            <BarChart3 className="h-3.5 w-3.5 text-accent" />
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
        accounts={accounts}
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
          totalCount={totalCount}
          isDeleting={isDeleting}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
