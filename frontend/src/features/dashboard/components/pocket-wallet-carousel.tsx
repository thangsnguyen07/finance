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
          <Paperclip className="w-4 h-4 text-muted rotate-45" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            Khay Kẹp Ví & Thẻ Thanh Toán
          </h2>
        </div>
        <Link
          href="/accounts"
          className="text-xs text-accent hover:underline font-medium"
        >
          Quản lý tất cả →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {isLoading ? (
          <Card variant="compact" className="rounded-lg text-xs text-muted">
            Đang tải danh sách ví...
          </Card>
        ) : accounts.length === 0 ? (
          <Card
            variant="compact"
            className="rounded-lg text-xs text-muted flex flex-row items-center gap-3"
          >
            <span>Chưa có ví nào được tạo.</span>
            <Link
              href="/accounts"
              className="text-xs text-accent font-semibold hover:underline"
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
                className="shrink-0 w-48 sm:w-56 rounded-lg relative group hover:border-accent transition-all overflow-visible"
              >
                <div className="absolute -top-1.5 left-4 w-2 h-3.5 bg-amber-800/80 rounded-full" />

                <Card.Content>
                  <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      Thẻ #{idx + 1}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/10 text-muted flex items-center gap-1">
                      {acc.type === 'CASH' ? (
                        <>
                          <Banknote className="w-3 h-3 text-emerald-600" />
                          <span>Tiền mặt</span>
                        </>
                      ) : acc.type === 'CREDIT_CARD' ? (
                        <>
                          <CreditCard className="w-3 h-3 text-danger" />
                          <span className="text-danger font-bold">
                            Thẻ tín dụng
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3 h-3 text-accent" />
                          <span>Ngân hàng</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-medium text-xs sm:text-sm text-foreground truncate">
                    {acc.name}
                  </h3>

                  <div className="mt-2">
                    <CurrencyText
                      amount={acc.currentBalance || 0}
                      className="text-base font-serif font-bold text-foreground"
                    />
                  </div>
                </Card.Content>
              </Card>
            ))}

            <Link
              href="/accounts"
              className="shrink-0 w-32 border border-dashed border-border hover:border-accent rounded-lg p-3.5 flex flex-col items-center justify-center text-center text-muted hover:text-accent transition-colors group cursor-pointer bg-surface/50"
            >
              <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">Thêm ví mới</span>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
