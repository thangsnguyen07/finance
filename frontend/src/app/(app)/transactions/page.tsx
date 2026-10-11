'use client';

import { useState } from 'react';
import {
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Trash2,
  Receipt,
  Loader2,
  Filter,
} from 'lucide-react';
import { useTransactions, useDeleteTransaction } from '@/hooks/use-transactions';
import { useAccounts } from '@/hooks/use-accounts';
import { QuickEntryModal } from '@/components/transactions/quick-entry-modal';
import type { TransactionType } from '@/types/api';

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TransactionsPage() {
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [filterAccountId, setFilterAccountId] = useState<string>('');
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);

  const { data: accounts } = useAccounts();
  const { data: txData, isLoading, isError } = useTransactions({
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif font-bold text-2xl text-foreground tracking-tight">
            Sổ Nhật Ký Giao Dịch
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Ghi chép thu chi bút mực, tự động cập nhật số dư sổ cái
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickEntryOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Ghi giao dịch mới</span>
        </button>
      </div>

      {/* Summary Cards: Inflow vs Outflow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface border border-border rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Tổng Thu Nhập (+)
          </span>
          <span className="text-xl font-serif font-bold text-success mt-1 block tabular-nums">
            +{formatVND(totalIncome)}
          </span>
        </div>

        <div className="p-4 bg-surface border border-border rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Tổng Chi Tiêu (-)
          </span>
          <span className="text-xl font-serif font-bold text-danger mt-1 block tabular-nums">
            -{formatVND(totalExpense)}
          </span>
        </div>

        <div className="p-4 bg-surface border border-border rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Chênh Lệch Dòng Tiền
          </span>
          <span className="text-xl font-serif font-bold text-foreground mt-1 block tabular-nums">
            {formatVND(totalIncome - totalExpense)}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-border rounded-xl p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'ALL', label: 'Tất cả' },
              { key: 'EXPENSE', label: 'Chi tiêu' },
              { key: 'INCOME', label: 'Thu nhập' },
              { key: 'TRANSFER', label: 'Chuyển khoản' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterType === tab.key
                  ? 'bg-amber-900 text-amber-100 font-bold'
                  : 'text-muted hover:text-foreground hover:bg-surface-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted shrink-0" />
          <select
            value={filterAccountId}
            onChange={(e) => setFilterAccountId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface-secondary/50 border border-border rounded-md text-foreground focus:outline-none focus:border-accent"
          >
            <option value="">Tất cả ví & tài khoản</option>
            {(accounts || []).map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ruled Paper Transaction List */}
      <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <span className="text-xs">Đang tải sổ giao dịch...</span>
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-xs text-danger">
            Không thể tải dữ liệu giao dịch. Vui lòng kiểm tra kết nối backend.
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <div className="w-11 h-11 rounded-full bg-surface-secondary flex items-center justify-center text-muted mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-serif font-bold text-foreground">
              Chưa có dòng ghi chép nào
            </h3>
            <p className="text-xs text-muted mt-1 max-w-xs">
              Bấm nút (+) ở dưới hoặc nút &ldquo;Ghi giao dịch mới&rdquo; để bắt đầu ghi sổ thu chi đầu tiên.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {items.map((tx) => {
              const title =
                tx.description ||
                tx.category?.name ||
                (tx.type === 'TRANSFER' ? 'Chuyển khoản nội bộ' : 'Giao dịch');

              const accountLabel =
                tx.type === 'TRANSFER' && tx.targetAccount
                  ? `${tx.account?.name || 'Ví nguồn'} → ${tx.targetAccount.name}`
                  : tx.account?.name || 'Ví';

              return (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-surface-secondary/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'EXPENSE'
                          ? 'bg-danger/10 text-danger'
                          : tx.type === 'INCOME'
                          ? 'bg-success/10 text-success'
                          : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {tx.type === 'EXPENSE' ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : tx.type === 'INCOME' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowRightLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {title}
                        </span>
                        {tx.category && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-surface-secondary text-[10px] text-muted font-medium">
                            {tx.category.name}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{tx.transactionDate}</span>
                        <span>•</span>
                        <span className="truncate">{accountLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold tabular-nums ${
                        tx.type === 'EXPENSE'
                          ? 'text-danger'
                          : tx.type === 'INCOME'
                          ? 'text-success'
                          : 'text-accent'
                      }`}
                    >
                      {tx.type === 'EXPENSE'
                        ? `-${formatVND(tx.amount)}`
                        : tx.type === 'INCOME'
                        ? `+${formatVND(tx.amount)}`
                        : formatVND(tx.amount)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(tx.id, title)}
                      disabled={deleteMutation.isPending}
                      aria-label="Xóa giao dịch"
                      className="p-1.5 rounded text-muted hover:text-danger hover:bg-danger/10 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Entry Modal */}
      <QuickEntryModal
        isOpen={isQuickEntryOpen}
        onClose={() => setIsQuickEntryOpen(false)}
      />
    </div>
  );
}
