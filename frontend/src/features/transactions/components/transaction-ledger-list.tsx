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
      <div className="flex items-center justify-between border-b border-border bg-surface-secondary/40 px-5 py-3 text-[11px] font-bold tracking-wider text-muted uppercase">
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
              className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-secondary/20"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isExpense
                      ? 'bg-danger/10 text-danger'
                      : isIncome
                        ? 'bg-success/10 text-success'
                        : 'bg-accent/10 text-accent'
                  }`}
                >
                  {isExpense ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : isIncome ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowRightLeft className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {displayTitle}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
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
                          className="h-4 px-1.5 text-[10px]"
                        >
                          {tx.category.name}
                        </Badge>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <CurrencyText
                  amount={tx.amount}
                  type={tx.type}
                  signed
                  className="text-xs font-bold sm:text-sm"
                />

                <Button
                  isIconOnly
                  size="sm"
                  tone="ghost"
                  isDisabled={isDeleting}
                  onPress={() => onDelete(tx.id, displayTitle)}
                  aria-label="Xóa & hoàn lại số dư"
                  className="h-7 w-7 min-w-7 text-muted opacity-60 group-hover:opacity-100 hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between border-t border-border bg-surface-secondary/30 px-5 py-3 font-mono text-[11px] text-muted">
        <span>Hiển thị {items.length} bút toán gần nhất</span>
        <span>Tổng cộng: {totalCount} bút toán</span>
      </div>
    </Card>
  );
}
