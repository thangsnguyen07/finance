'use client';

import { cn } from '@heroui/react';

import type { ReactNode } from 'react';

export type IconBoxTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'amber'
  | 'blue'
  | 'rose'
  | 'purple'
  | 'emerald';

export type IconBoxSize = 'sm' | 'md' | 'lg';
export type IconBoxShape = 'circle' | 'rounded';

const TONE_CLASSES: Record<IconBoxTone, string> = {
  neutral: 'bg-surface-secondary text-muted border-border',
  accent: 'bg-accent/10 text-accent border-accent/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  amber: 'bg-amber-500/10 text-amber-700 border-amber-600/20',
  blue: 'bg-blue-500/10 text-blue-700 border-blue-600/20',
  rose: 'bg-rose-500/10 text-rose-700 border-rose-600/20',
  purple: 'bg-purple-500/10 text-purple-700 border-purple-600/20',
  emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-600/20',
};

const SIZE_CLASSES: Record<IconBoxSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
};

const SHAPE_CLASSES: Record<IconBoxShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-lg border',
};

export interface IconBoxProps {
  tone?: IconBoxTone;
  size?: IconBoxSize;
  shape?: IconBoxShape;
  className?: string;
  children: ReactNode;
}

export function IconBox({
  tone = 'neutral',
  size = 'md',
  shape = 'circle',
  className,
  children,
}: IconBoxProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center',
        SIZE_CLASSES[size],
        SHAPE_CLASSES[shape],
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
