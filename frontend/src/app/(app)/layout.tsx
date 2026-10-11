'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { NotebookHeader } from '@/components/layout/notebook-header';
import { QuickEntryModal } from '@/features/transactions';
import { useUiStore } from '@/stores/use-ui-store';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isQuickEntryOpen = useUiStore((state) => state.isQuickEntryOpen);
  const closeQuickEntry = useUiStore((state) => state.closeQuickEntry);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <NotebookHeader />
        <main className="flex-1 min-w-0 pb-20 lg:pb-8 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
          {children}
        </main>
      </div>

      <BottomNav />

      <QuickEntryModal isOpen={isQuickEntryOpen} onClose={closeQuickEntry} />
    </div>
  );
}
