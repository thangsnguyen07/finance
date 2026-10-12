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
    <HeroSurface className="inline-flex items-center bg-surface border border-border rounded-lg p-1 shadow-2xs">
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Tháng trước"
        onPress={() => onChange(shiftMonth(month, -1))}
        className="w-7 h-7 min-w-7 rounded-md text-muted hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="px-3 text-xs font-serif font-bold text-foreground min-w-[116px] text-center select-none">
        {formatMonthDisplay(month)}
      </span>
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Tháng sau"
        onPress={() => onChange(shiftMonth(month, 1))}
        className="w-7 h-7 min-w-7 rounded-md text-muted hover:text-foreground"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </HeroSurface>
  );
}
