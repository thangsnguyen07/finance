'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { NotebookHeader } from '@/components/layout/NotebookHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import { QuickEntryModal } from '@/features/transactions';
import { useUiStore } from '@/stores/use-ui-store';

import type { PropsWithChildren } from 'react';

export default function AppLayout({ children }: PropsWithChildren) {
  const isQuickEntryOpen = useUiStore((state) => state.isQuickEntryOpen);
  const closeQuickEntry = useUiStore((state) => state.closeQuickEntry);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <NotebookHeader />
        <main className="mx-auto w-full max-w-5xl min-w-0 flex-1 px-4 pt-5 pb-20 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      <BottomNav />

      <QuickEntryModal isOpen={isQuickEntryOpen} onClose={closeQuickEntry} />
    </div>
  );
}
