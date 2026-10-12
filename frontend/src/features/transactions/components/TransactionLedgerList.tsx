'use client';

import { Trash2 } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CurrencyText,
  ListItem,
  Row,
  Stack,
  Text,
} from '@/components/ui';

import {
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPE_TONES,
} from '../constants/transaction.constants';
import {
  TRANSACTION_TYPE,
  type TransactionResponse,
} from '../types/transaction.types';
import { getTransactionDisplayTitle } from '../utils/transaction.utils';

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
      <Row
        justify="between"
        className="border-b border-border bg-surface-secondary/40 px-5 py-3"
      >
        <Text variant="eyebrow">Nội dung & Danh mục</Text>
        <Text variant="eyebrow">Số tiền (VND)</Text>
      </Row>

      <Stack divided gap="none">
        {items.map((tx) => {
          const TxIcon = TRANSACTION_TYPE_ICONS[tx.type];
          const tone = TRANSACTION_TYPE_TONES[tx.type];
          const displayTitle = getTransactionDisplayTitle(tx);

          return (
            <ListItem
              key={tx.id}
              icon={TxIcon}
              iconTone={tone}
              iconShape="circle"
              iconSize="md"
              hoverable
              className="group px-5 py-3.5"
              title={displayTitle}
              subtitle={
                <Row wrap gap="xs" className="text-[11px] text-muted">
                  <span className="font-mono">{tx.transactionDate}</span>
                  <span>•</span>
                  <span>{tx.account?.name || 'Ví đã lưu'}</span>
                  {tx.type === TRANSACTION_TYPE.TRANSFER && tx.targetAccount ? (
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
                </Row>
              }
              trailing={
                <CurrencyText
                  amount={tx.amount}
                  type={tx.type}
                  signed
                  className="text-xs font-bold sm:text-sm"
                />
              }
              action={
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
              }
            />
          );
        })}
      </Stack>

      <Row
        justify="between"
        className="border-t border-border bg-surface-secondary/30 px-5 py-3 font-mono text-[11px] text-muted"
      >
        <span>Hiển thị {items.length} bút toán gần nhất</span>
        <span>Tổng cộng: {totalCount} bút toán</span>
      </Row>
    </Card>
  );
}
