'use client';

import { Paperclip, Plus } from 'lucide-react';
import Link from 'next/link';

import { Card, CurrencyText } from '@/components/ui';
import { ACCOUNT_TYPE_CONFIG, type AccountResponse } from '@/features/accounts';

interface PocketWalletCarouselProps {
  accounts: AccountResponse[];
  isLoading: boolean;
}

export function PocketWalletCarousel({
  accounts,
  isLoading,
}: PocketWalletCarouselProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 rotate-45 text-muted" />
          <h2 className="font-sans text-xs font-bold tracking-wider text-muted uppercase">
            Khay Kẹp Ví & Thẻ Thanh Toán
          </h2>
        </div>
        <Link
          href="/accounts"
          className="text-xs font-medium text-accent hover:underline"
        >
          Quản lý tất cả →
        </Link>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pt-1 pb-2">
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
              const typeConfig = ACCOUNT_TYPE_CONFIG[acc.type];
              const TypeIcon = typeConfig.icon;

              return (
                <Card
                  key={acc.id}
                  padding="sm"
                  className="group relative w-48 shrink-0 overflow-visible rounded-lg transition-all hover:border-accent sm:w-56"
                >
                  <div className="absolute -top-1.5 left-4 h-3.5 w-2 rounded-full bg-amber-800/80" />

                  <Card.Content>
                    <div className="mb-2 flex items-center justify-between text-xs text-muted">
                      <span className="font-mono text-[10px] tracking-wider uppercase">
                        Thẻ #{idx + 1}
                      </span>
                      <span className="flex items-center gap-1 rounded bg-muted/10 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                        <TypeIcon
                          className={`h-3 w-3 ${typeConfig.pocketIconClass}`}
                        />
                        <span className={typeConfig.pocketLabelClass}>
                          {typeConfig.label}
                        </span>
                      </span>
                    </div>

                    <h3 className="truncate text-xs font-medium text-foreground sm:text-sm">
                      {acc.name}
                    </h3>

                    <div className="mt-2">
                      <CurrencyText
                        amount={acc.currentBalance || 0}
                        className="font-serif text-base font-bold text-foreground"
                      />
                    </div>
                  </Card.Content>
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
              <span className="text-[11px] font-medium">Thêm ví mới</span>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
