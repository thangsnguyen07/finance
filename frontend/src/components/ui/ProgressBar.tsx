'use client';

import { cn } from '@heroui/react';

import { Row, Stack } from './Layout';

import type { HTMLAttributes, ReactNode } from 'react';

export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';

const PROGRESS_TONE_CLASSES: Record<ProgressTone, string> = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export interface ProgressBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'color'
> {
  value: number;
  tone?: ProgressTone;
  color?: string;
  size?: 'sm' | 'md';
  leftLabel?: ReactNode;
  rightLabel?: ReactNode;
}

export function ProgressBar({
  value,
  tone = 'accent',
  color,
  size = 'md',
  leftLabel,
  rightLabel,
  className,
  ...props
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const bar = (
    <div
      className={cn(
        'w-full overflow-hidden rounded-full border border-border/50 bg-surface-secondary',
        size === 'sm' ? 'h-1.5' : 'h-2',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300',
          !color && PROGRESS_TONE_CLASSES[tone],
        )}
        style={{
          width: `${clamped}%`,
          ...(color ? { backgroundColor: color } : {}),
        }}
      />
    </div>
  );

  if (!leftLabel && !rightLabel) {
    return bar;
  }

  return (
    <Stack gap="xs">
      {bar}
      <Row
        justify="between"
        className="font-mono text-xs text-muted tabular-nums"
      >
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </Row>
    </Stack>
  );
}
