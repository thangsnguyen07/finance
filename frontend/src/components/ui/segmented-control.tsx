'use client';

import type { ReactNode } from 'react';
import { Button as HeroButton, Surface as HeroSurface, cn } from '@heroui/react';

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
        'inline-flex items-center gap-1 rounded-xl border border-ledger-border bg-paper-muted/70 p-1',
        fullWidth && 'flex w-full',
        className,
      )}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <HeroButton
            key={opt.value}
            type="button"
            size="sm"
            variant={isActive ? 'primary' : 'ghost'}
            onPress={() => onChange(opt.value)}
            className={cn(
              'rounded-lg font-medium transition-colors',
              size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-3.5 text-xs font-semibold',
              fullWidth && 'flex-1 justify-center',
              isActive
                ? opt.activeClassName ?? 'bg-ink-primary text-paper-surface shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary',
            )}
          >
            {opt.label}
          </HeroButton>
        );
      })}
    </HeroSurface>
  );
}
