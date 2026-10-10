'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { NotebookHeader } from '@/components/navigation/notebook-header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setIsQuickEntryOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Left Sidebar */}
      <Sidebar onQuickEntryClick={() => setIsQuickEntryOpen(true)} />

      {/* Main Content Area with Sticky Notebook Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <NotebookHeader />
        <main className="flex-1 min-w-0 pb-20 lg:pb-8 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onQuickEntryClick={() => setIsQuickEntryOpen(true)} />
    </div>
  );
}
