'use client';

import { Chip as HeroChip, cn } from '@heroui/react';

import type { ComponentProps } from 'react';

export interface BadgeProps extends ComponentProps<typeof HeroChip> {
  mono?: boolean;
}

export function Badge({
  size = 'sm',
  variant = 'secondary',
  mono = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <HeroChip
      size={size}
      variant={variant}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        mono && 'font-mono text-xs',
        className,
      )}
      {...props}
    >
      {children}
    </HeroChip>
  );
}
