'use client';

import Link from 'next/link';
import { Paperclip, Plus, CreditCard, Banknote } from 'lucide-react';
import { Card, CurrencyText } from '@/components/ui';
import type { AccountResponse } from '@/features/accounts';

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
          <Paperclip className="h-4 w-4 rotate-45 text-ink-secondary" />
          <h2 className="font-sans text-xs font-bold tracking-wider text-ink-secondary uppercase">
            Khay Kẹp Ví & Thẻ Thanh Toán
          </h2>
        </div>
        <Link
          href="/accounts"
          className="text-xs font-medium text-accent-coral hover:underline"
        >
          Quản lý tất cả →
        </Link>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pt-1 pb-2 scroll-smooth">
        {isLoading ? (
          <Card padding="md" className="text-xs text-ink-secondary">
            Đang tải danh sách ví...
          </Card>
        ) : accounts.length === 0 ? (
          <Card
            padding="md"
            className="flex flex-row items-center gap-3 text-xs text-ink-secondary"
          >
            <span>Chưa có ví nào được tạo.</span>
            <Link
              href="/accounts"
              className="text-xs font-semibold text-accent-coral hover:underline"
            >
              Tạo ví đầu tiên →
            </Link>
          </Card>
        ) : (
          <>
            {accounts.map((acc, idx) => (
              <Card
                key={acc.id}
                padding="sm"
                className="group relative w-48 shrink-0 overflow-visible rounded-lg transition-all hover:border-accent-coral sm:w-56"
              >
                <div className="absolute -top-1.5 left-4 h-3.5 w-2 rounded-full bg-amber-800/80" />

                <Card.Content>
                  <div className="mb-2 flex items-center justify-between text-xs text-ink-secondary">
                    <span className="font-mono text-[10px] tracking-wider uppercase">
                      Thẻ #{idx + 1}
                    </span>
                    <span className="flex items-center gap-1 rounded bg-paper-muted px-1.5 py-0.5 text-[10px] font-medium text-ink-secondary">
                      {acc.type === 'CASH' ? (
                        <>
                          <Banknote className="h-3 w-3 text-emerald-600" />
                          <span>Tiền mặt</span>
                        </>
                      ) : acc.type === 'CREDIT_CARD' ? (
                        <>
                          <CreditCard className="h-3 w-3 text-accent-coral" />
                          <span className="font-bold text-accent-coral">
                            Thẻ tín dụng
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-3 w-3 text-accent-coral" />
                          <span>Ngân hàng</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="truncate text-xs font-medium text-ink-primary sm:text-sm">
                    {acc.name}
                  </h3>

                  <div className="mt-2">
                    <CurrencyText
                      amount={acc.currentBalance || 0}
                      className="font-serif text-base font-bold text-ink-primary"
                    />
                  </div>
                </Card.Content>
              </Card>
            ))}

            <Link
              href="/accounts"
              className="group flex w-32 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ledger-border bg-paper-surface/50 p-3.5 text-center text-ink-secondary transition-colors hover:border-accent-coral hover:text-accent-coral"
            >
              <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent-coral/10 text-accent-coral transition-transform group-hover:scale-110">
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
