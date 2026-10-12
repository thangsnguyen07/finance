'use client';

import type { ReactNode } from 'react';
import { Surface as HeroSurface, cn } from '@heroui/react';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  activeClassName?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  size = 'md',
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <HeroSurface
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-secondary p-1',
        fullWidth && 'grid w-full',
        fullWidth && options.length === 2 && 'grid-cols-2',
        fullWidth && options.length === 3 && 'grid-cols-3',
        className,
      )}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer',
              size === 'sm' ? 'px-3 py-1.5' : 'px-3.5 py-2',
              isActive
                ? opt.activeClassName ??
                    'bg-accent text-accent-foreground shadow-xs'
                : 'text-muted hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </HeroSurface>
  );
}
