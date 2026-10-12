'use client';

import Link from 'next/link';

import { Card, CurrencyText, IconBox } from '@/components/ui';
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPE_TONES,
  getTransactionDisplayTitle,
  type TransactionResponse,
} from '@/features/transactions';
import { formatShortDate } from '@/lib/formatters';

interface RecentTransactionsCardProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
}

export function RecentTransactionsCard({
  transactions,
  isLoading,
}: RecentTransactionsCardProps) {
  return (
    <Card className="lg:col-span-2">
      <Card.Header bordered className="mb-1 pb-3">
        <Card.Eyebrow className="flex items-center gap-1.5 font-sans text-xs">
          <span>📖 Nhật Ký Ghi Sổ Gần Nhất</span>
        </Card.Eyebrow>
        <Link
          href="/transactions"
          className="text-xs font-medium text-accent hover:underline"
        >
          Xem toàn bộ sổ →
        </Link>
      </Card.Header>

      <Card.Content className="divide-y divide-border/60">
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
            const TxIcon = TRANSACTION_TYPE_ICONS[tx.type];
            const tone = TRANSACTION_TYPE_TONES[tx.type];
            const displayTitle = getTransactionDisplayTitle(tx);

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2.5 text-xs"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <IconBox tone={tone} size="sm" shape="circle">
                    <TxIcon className="h-4 w-4" />
                  </IconBox>
                  <div className="min-w-0">
                    <span className="block truncate font-medium text-foreground">
                      {displayTitle}
                    </span>
                    <span className="font-sans text-[10px] text-muted">
                      {formatShortDate(tx.transactionDate)} •{' '}
                      {tx.account?.name || 'Ví'}
                      {tx.type === TRANSACTION_TYPE.TRANSFER && tx.targetAccount
                        ? ` → ${tx.targetAccount.name}`
                        : ''}
                    </span>
                  </div>
                </div>
                <CurrencyText
                  amount={tx.amount}
                  type={tx.type}
                  signed
                  className="ml-2 shrink-0 font-bold"
                />
              </div>
            );
          })
        )}
      </Card.Content>
    </Card>
  );
}
