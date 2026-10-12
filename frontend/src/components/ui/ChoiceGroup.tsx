'use client';

import { cn } from '@heroui/react';

import { Field } from './Field';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ChoiceItem<T extends string> {
  value: T;
  label: ReactNode;
  icon?: LucideIcon;
  colorSwatch?: string;
}

export type ChoiceGroupVariant =
  | 'icon-grid'
  | 'compact-grid'
  | 'pill'
  | 'swatch';

export interface ChoiceGroupProps<T extends string> {
  label?: ReactNode;
  labelIcon?: ReactNode;
  uppercaseLabel?: boolean;
  value: T;
  onChange: (value: T) => void;
  items: ReadonlyArray<ChoiceItem<T>>;
  variant?: ChoiceGroupVariant;
  cols?: 2 | 3;
  scrollable?: boolean;
  className?: string;
}

export function ChoiceGroup<T extends string>({
  label,
  labelIcon,
  uppercaseLabel = false,
  value,
  onChange,
  items,
  variant = 'compact-grid',
  cols = 2,
  scrollable = false,
  className,
}: ChoiceGroupProps<T>) {
  const isGrid = variant === 'icon-grid' || variant === 'compact-grid';
  const gridColsClass = cols === 3 ? 'grid-cols-3' : 'grid-cols-2';

  const content = (
    <div
      className={cn(
        isGrid
          ? cn('grid gap-2', gridColsClass)
          : 'flex flex-wrap items-center gap-1.5',
        scrollable && 'max-h-40 flex-1 content-start overflow-y-auto p-0.5',
        className,
      )}
    >
      {items.map((item) => {
        const isSelected = value === item.value;
        const Icon = item.icon;

        if (variant === 'icon-grid') {
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border p-2.5 text-xs transition-all',
                isSelected
                  ? 'border-accent bg-accent/10 font-semibold text-accent shadow-2xs'
                  : 'border-border bg-surface text-muted hover:text-foreground',
              )}
            >
              {Icon ? <Icon className="mb-1 h-4 w-4" /> : null}
              <span>{item.label}</span>
            </button>
          );
        }

        if (variant === 'swatch') {
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-all',
                isSelected
                  ? 'border-foreground bg-surface-secondary font-bold text-foreground'
                  : 'border-border bg-surface text-muted hover:text-foreground',
              )}
            >
              {item.colorSwatch ? (
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.colorSwatch }}
                />
              ) : null}
              <span>{item.label}</span>
            </button>
          );
        }

        if (variant === 'pill') {
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                isSelected
                  ? 'bg-accent font-semibold text-accent-foreground'
                  : 'bg-surface-secondary/60 text-muted hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          );
        }

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'h-9 cursor-pointer truncate rounded-lg border px-3 text-left text-xs transition-all',
              isSelected
                ? 'border-accent bg-accent/10 font-bold text-accent shadow-2xs'
                : 'border-border bg-surface text-foreground hover:border-border/80',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );

  if (!label) {
    return content;
  }

  return (
    <Field.Root
      className={scrollable ? 'flex flex-1 flex-col space-y-1.5' : undefined}
    >
      <Field.Label icon={labelIcon} uppercase={uppercaseLabel}>
        {label}
      </Field.Label>
      {content}
    </Field.Root>
  );
}
