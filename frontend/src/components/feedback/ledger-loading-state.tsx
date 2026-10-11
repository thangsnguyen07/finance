'use client';

import { Spinner } from '@heroui/react';

export function LedgerLoadingState({
  message = 'Đang tải dữ liệu sổ cái...',
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted gap-2">
      <Spinner size="md" color="accent" />
      <p className="text-xs">{message}</p>
    </div>
  );
}
