'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Trash2,
} from 'lucide-react';
import { Button, Card, Badge, CurrencyText } from '@/components/ui';
import type { TransactionResponse } from '../types/transaction.types';

interface TransactionLedgerListProps {
  items: TransactionResponse[];
  totalCount: number;
  isDeleting: boolean;
  onDelete: (id: string, label: string) => void;
}

export function TransactionLedgerList({
  items,
  totalCount,
  isDeleting,
  onDelete,
}: TransactionLedgerListProps) {
  return (
    <Card variant="flush">
      <div className="px-5 py-3 bg-surface-secondary/40 border-b border-border flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
        <span>Nội dung & Danh mục</span>
        <span>Số tiền (VND)</span>
      </div>

      <div className="divide-y divide-border/70">
        {items.map((tx) => {
          const isExpense = tx.type === 'EXPENSE';
          const isIncome = tx.type === 'INCOME';
          const displayTitle =
            tx.description ||
            tx.category?.name ||
            (tx.type === 'TRANSFER'
              ? `Chuyển khoản: ${tx.account?.name || ''} → ${tx.targetAccount?.name || ''}`
              : 'Giao dịch');

          return (
            <div
              key={tx.id}
              className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-surface-secondary/20 transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isExpense
                      ? 'bg-danger/10 text-danger'
                      : isIncome
                        ? 'bg-success/10 text-success'
                        : 'bg-accent/10 text-accent'
                  }`}
                >
                  {isExpense ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : isIncome ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {displayTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted mt-0.5">
                    <span className="font-mono">{tx.transactionDate}</span>
                    <span>•</span>
                    <span>{tx.account?.name || 'Ví đã lưu'}</span>
                    {tx.type === 'TRANSFER' && tx.targetAccount ? (
                      <>
                        <span>→</span>
                        <span className="font-medium text-foreground">
                          {tx.targetAccount.name}
                        </span>
                      </>
                    ) : null}
                    {tx.category ? (
                      <>
                        <span>•</span>
                        <Badge
                          size="sm"
                          variant="secondary"
                          className="text-[10px] h-4 px-1.5"
                        >
                          {tx.category.name}
                        </Badge>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <CurrencyText
                  amount={tx.amount}
                  type={tx.type}
                  signed
                  className="font-bold text-xs sm:text-sm"
                />

                <Button
                  isIconOnly
                  size="sm"
                  tone="ghost"
                  isDisabled={isDeleting}
                  onPress={() => onDelete(tx.id, displayTitle)}
                  aria-label="Xóa & hoàn lại số dư"
                  className="w-7 h-7 min-w-7 text-muted hover:text-danger opacity-60 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-surface-secondary/30 border-t border-border text-[11px] text-muted flex justify-between font-mono">
        <span>Hiển thị {items.length} bút toán gần nhất</span>
        <span>Tổng cộng: {totalCount} bút toán</span>
      </div>
    </Card>
  );
}
