'use client';

import type { ComponentProps } from 'react';
import { Chip as HeroChip, cn } from '@heroui/react';

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
        'text-[11px] font-medium inline-flex items-center gap-1',
        mono && 'font-mono text-[10px]',
        className,
      )}
      {...props}
    >
      {children}
    </HeroChip>
  );
}
