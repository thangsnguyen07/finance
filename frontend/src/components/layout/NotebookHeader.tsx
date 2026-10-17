'use client';

import { NotebookTabs, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const WEEKDAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

function formatVietnameseDate(date: Date): string {
  const dayName = WEEKDAYS[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${dayName}, ${day} Tháng ${month}, ${year}`;
}

const emptySubscribe = () => () => {};

export function NotebookHeader() {
  const pathname = usePathname();
  const formattedDate = useSyncExternalStore(
    emptySubscribe,
    () => formatVietnameseDate(new Date()),
    () => '',
  );

  const isSettingsActive = pathname.startsWith('/settings');

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-900 font-bold text-amber-100 shadow-2xs transition-opacity group-hover:opacity-90">
            <NotebookTabs className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="block font-sans text-xs leading-tight font-semibold tracking-wider text-muted uppercase">
              SỔ TAY TÀI CHÍNH CÁ NHÂN
            </span>
            <h2 className="truncate font-serif text-xs leading-tight font-bold text-foreground sm:text-sm">
              {formattedDate || 'Đang tải ngày...'}
            </h2>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <div className="rotate-[2deg] rounded border-2 border-dashed border-danger/80 px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-danger shadow-2xs transition-transform select-none hover:rotate-0">
            ✓ SỔ ĐÃ KIỂM KÊ
          </div>

          <Link
            href="/settings"
            title="Cài đặt sổ & Danh mục"
            aria-label="Cài đặt sổ & Danh mục"
            className={`rounded-md border p-1.5 transition-colors lg:hidden ${
              isSettingsActive
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border bg-surface text-muted hover:text-foreground'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
