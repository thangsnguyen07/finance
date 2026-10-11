'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { NotebookTabs, Settings } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xs border-b border-border/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
          <div className="w-8 h-8 rounded-lg bg-amber-900 text-amber-100 flex items-center justify-center font-bold shadow-2xs shrink-0 group-hover:opacity-90 transition-opacity">
            <NotebookTabs className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-muted font-sans uppercase tracking-wider block font-semibold leading-tight">
              SỔ TAY TÀI CHÍNH CÁ NHÂN
            </span>
            <h2 className="text-xs sm:text-sm font-bold font-serif text-foreground leading-tight truncate">
              {formattedDate || 'Đang tải ngày...'}
            </h2>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider border-2 border-dashed border-danger/80 text-danger rotate-[2deg] shadow-2xs select-none hover:rotate-0 transition-transform">
            ✓ SỔ ĐÃ KIỂM KÊ
          </div>

          <Link
            href="/settings"
            title="Cài đặt sổ & Danh mục"
            aria-label="Cài đặt sổ & Danh mục"
            className={`lg:hidden p-1.5 rounded-md border transition-colors ${
              isSettingsActive
                ? 'bg-accent text-accent-foreground border-accent'
                : 'bg-surface text-muted hover:text-foreground border-border'
            }`}
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
