'use client';

import Link from 'next/link';
import { Card } from '@heroui/react';
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { formatShortDate, formatVND } from '@/lib/formatters';
import type { TransactionResponse } from '@/features/transactions';

interface RecentTransactionsCardProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
}

export function RecentTransactionsCard({
  transactions,
  isLoading,
}: RecentTransactionsCardProps) {
  return (
    <Card className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 shadow-xs">
      <Card.Header className="p-0 pb-3 border-b border-border/80 flex items-center justify-between">
        <Card.Title className="text-xs font-bold uppercase tracking-wider text-muted font-sans flex items-center gap-1.5">
          <span>📖 Nhật Ký Ghi Sổ Gần Nhất</span>
        </Card.Title>
        <Link
          href="/transactions"
          className="text-xs text-accent hover:underline font-medium"
        >
          Xem toàn bộ sổ →
        </Link>
      </Card.Header>

      <Card.Content className="p-0 divide-y divide-border/60 mt-1">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-muted">
            Đang tải nhật ký giao dịch...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted">
            Chưa có bút toán nào được ghi nhận. Nhấn nút <strong>+</strong> để
            ghi nhanh!
          </div>
        ) : (
          transactions.map((tx) => {
            const isExpense = tx.type === 'EXPENSE';
            const isIncome = tx.type === 'INCOME';
            return (
              <div
                key={tx.id}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
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
                      <ArrowLeftRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-foreground block truncate">
                      {tx.description ||
                        tx.category?.name ||
                        (tx.type === 'TRANSFER'
                          ? 'Chuyển khoản nội bộ'
                          : 'Giao dịch')}
                    </span>
                    <span className="text-[10px] text-muted font-sans">
                      {formatShortDate(tx.transactionDate)} •{' '}
                      {tx.account?.name || 'Ví'}
                      {tx.type === 'TRANSFER' && tx.targetAccount
                        ? ` → ${tx.targetAccount.name}`
                        : ''}
                    </span>
                  </div>
                </div>
                <span
                  className={`font-mono font-bold shrink-0 ml-2 tabular-nums ${
                    isExpense
                      ? 'text-danger'
                      : isIncome
                        ? 'text-success'
                        : 'text-foreground'
                  }`}
                >
                  {isExpense ? '-' : isIncome ? '+' : ''}
                  {formatVND(tx.amount)}
                </span>
              </div>
            );
          })
        )}
      </Card.Content>
    </Card>
  );
}
