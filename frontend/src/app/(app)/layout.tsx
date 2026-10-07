'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { BottomNav } from '@/components/navigation/bottom-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [_isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Left Sidebar */}
      <Sidebar onQuickEntryClick={() => setIsQuickEntryOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav onQuickEntryClick={() => setIsQuickEntryOpen(true)} />
    </div>
  );
}
