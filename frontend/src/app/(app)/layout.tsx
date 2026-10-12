'use client';

import { BottomNav } from '@/components/layout/bottom-nav';
import { NotebookHeader } from '@/components/layout/notebook-header';
import { Sidebar } from '@/components/layout/sidebar';
import { QuickEntryModal } from '@/features/transactions';
import { useUiStore } from '@/stores/use-ui-store';

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
