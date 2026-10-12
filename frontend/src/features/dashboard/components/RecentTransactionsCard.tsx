'use client';

import Link from 'next/link';

import { Card, CurrencyText, ListItem, Stack, Text } from '@/components/ui';
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
    <Card
      className="lg:col-span-2"
      eyebrow="📖 Nhật Ký Ghi Sổ Gần Nhất"
      headerAction={
        <Link
          href="/transactions"
          className="text-xs font-medium text-accent hover:underline"
        >
          Xem toàn bộ sổ →
        </Link>
      }
      borderedHeader
    >
      {isLoading ? (
        <Text variant="caption" tone="muted" className="py-6 text-center">
          Đang tải nhật ký giao dịch...
        </Text>
      ) : transactions.length === 0 ? (
        <Text variant="caption" tone="muted" className="py-6 text-center">
          Chưa có bút toán nào được ghi nhận. Nhấn nút <strong>+</strong> để ghi
          nhanh!
        </Text>
      ) : (
        <Stack divided gap="none">
          {transactions.map((tx) => {
            const TxIcon = TRANSACTION_TYPE_ICONS[tx.type];
            const tone = TRANSACTION_TYPE_TONES[tx.type];
            const displayTitle = getTransactionDisplayTitle(tx);
            const subtitle = `${formatShortDate(tx.transactionDate)} • ${
              tx.account?.name || 'Ví'
            }${
              tx.type === TRANSACTION_TYPE.TRANSFER && tx.targetAccount
                ? ` → ${tx.targetAccount.name}`
                : ''
            }`;

            return (
              <ListItem
                key={tx.id}
                compact
                icon={TxIcon}
                iconTone={tone}
                iconSize="sm"
                iconShape="circle"
                title={displayTitle}
                subtitle={subtitle}
                trailing={
                  <CurrencyText
                    amount={tx.amount}
                    type={tx.type}
                    signed
                    className="font-bold"
                  />
                }
              />
            );
          })}
        </Stack>
      )}
    </Card>
  );
}
