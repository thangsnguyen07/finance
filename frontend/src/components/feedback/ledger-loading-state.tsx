'use client';

import { Spinner as HeroSpinner } from '@heroui/react';

export function LedgerLoadingState({
  message = 'Đang tải dữ liệu sổ cái...',
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted">
      <HeroSpinner size="md" color="accent" />
      <p className="text-xs">{message}</p>
    </div>
  );
}
