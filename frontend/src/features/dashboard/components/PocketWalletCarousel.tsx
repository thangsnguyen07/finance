'use client';

import { Paperclip, Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge, Card, CurrencyText, Row, Stack, Text } from '@/components/ui';
import {
  ACCOUNT_TYPE,
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_TYPE_LABELS,
  type AccountResponse,
} from '@/features/accounts';

interface PocketWalletCarouselProps {
  accounts: AccountResponse[];
  isLoading: boolean;
}

export function PocketWalletCarousel({
  accounts,
  isLoading,
}: PocketWalletCarouselProps) {
  return (
    <Stack as="section" gap="sm">
      <Row justify="between" className="px-1">
        <Row gap="sm">
          <Paperclip className="h-4 w-4 rotate-45 text-muted" />
          <Text as="h2" variant="eyebrow">
            Khay Kẹp Ví & Thẻ Thanh Toán
          </Text>
        </Row>
        <Link
          href="/accounts"
          className="text-xs font-medium text-accent hover:underline"
        >
          Quản lý tất cả →
        </Link>
      </Row>

      <Row scrollX gap="md" className="pt-1 pb-2">
        {isLoading ? (
          <Card variant="compact" className="rounded-lg text-xs text-muted">
            Đang tải danh sách ví...
          </Card>
        ) : accounts.length === 0 ? (
          <Card
            variant="compact"
            className="flex flex-row items-center gap-3 rounded-lg text-xs text-muted"
          >
            <span>Chưa có ví nào được tạo.</span>
            <Link
              href="/accounts"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Tạo ví đầu tiên →
            </Link>
          </Card>
        ) : (
          <>
            {accounts.map((acc, idx) => {
              const TypeIcon = ACCOUNT_TYPE_ICONS[acc.type];
              const typeLabel = ACCOUNT_TYPE_LABELS[acc.type];
              const isCreditCard = acc.type === ACCOUNT_TYPE.CREDIT_CARD;

              return (
                <Card
                  key={acc.id}
                  padding="sm"
                  className="group relative w-48 shrink-0 overflow-visible rounded-lg transition-all hover:border-accent sm:w-56"
                >
                  <div className="absolute -top-1.5 left-4 h-3.5 w-2 rounded-full bg-amber-800/80" />

                  <Row justify="between" className="mb-2 text-xs text-muted">
                    <span className="font-mono text-xs tracking-wider uppercase">
                      Thẻ #{idx + 1}
                    </span>
                    <Badge
                      size="sm"
                      variant={isCreditCard ? 'soft' : 'secondary'}
                      color={isCreditCard ? 'danger' : 'default'}
                      className="h-5 px-1.5 text-xs"
                    >
                      <TypeIcon className="h-3 w-3" />
                      <span>{typeLabel}</span>
                    </Badge>
                  </Row>

                  <Text
                    as="h3"
                    variant="body"
                    weight="medium"
                    truncate
                    className="text-xs sm:text-sm"
                  >
                    {acc.name}
                  </Text>

                  <div className="mt-2">
                    <CurrencyText
                      amount={acc.currentBalance || 0}
                      className="font-serif text-base font-bold text-foreground"
                    />
                  </div>
                </Card>
              );
            })}

            <Link
              href="/accounts"
              className="group flex w-32 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/50 p-3.5 text-center text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform group-hover:scale-110">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">Thêm ví mới</span>
            </Link>
          </>
        )}
      </Row>
    </Stack>
  );
}
