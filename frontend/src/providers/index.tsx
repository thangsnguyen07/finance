'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { makeQueryClient } from '@/lib/query-client';

import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
