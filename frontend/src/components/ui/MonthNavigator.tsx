'use client';

import { Surface as HeroSurface } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { shiftMonth } from '@/lib/date-utils';
import { formatMonthDisplay } from '@/lib/formatters';

import { Button } from './Button';

interface MonthNavigatorProps {
  month: string;
  onChange: (nextMonth: string) => void;
}

export function MonthNavigator({ month, onChange }: MonthNavigatorProps) {
  return (
    <HeroSurface className="inline-flex items-center rounded-lg border border-border bg-surface p-1 shadow-2xs">
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Tháng trước"
        onPress={() => onChange(shiftMonth(month, -1))}
        className="h-7 w-7 min-w-7 rounded-md text-muted hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[116px] px-3 text-center font-serif text-xs font-bold text-foreground select-none">
        {formatMonthDisplay(month)}
      </span>
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Tháng sau"
        onPress={() => onChange(shiftMonth(month, 1))}
        className="h-7 w-7 min-w-7 rounded-md text-muted hover:text-foreground"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </HeroSurface>
  );
}
