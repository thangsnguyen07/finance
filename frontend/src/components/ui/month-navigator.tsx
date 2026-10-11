'use client';

import { Surface as HeroSurface } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthDisplay } from '@/lib/formatters';
import { shiftMonth } from '@/lib/date-utils';
import { Button } from './button';

interface MonthNavigatorProps {
  month: string;
  onChange: (nextMonth: string) => void;
}

export function MonthNavigator({ month, onChange }: MonthNavigatorProps) {
  return (
    <HeroSurface className="inline-flex items-center rounded-lg border border-ledger-border bg-paper-surface p-1 shadow-2xs">
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Tháng trước"
        onPress={() => onChange(shiftMonth(month, -1))}
        className="h-7 w-7 min-w-7 rounded-md"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[116px] select-none px-3 text-center font-serif text-xs font-bold text-ink-primary">
        {formatMonthDisplay(month)}
      </span>
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Tháng sau"
        onPress={() => onChange(shiftMonth(month, 1))}
        className="h-7 w-7 min-w-7 rounded-md"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </HeroSurface>
  );
}
