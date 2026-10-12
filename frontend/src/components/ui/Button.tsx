'use client';

import { Button as HeroButton, cn } from '@heroui/react';
import { Loader2 } from 'lucide-react';

import type { ComponentProps, PropsWithChildren } from 'react';

type HeroButtonProps = ComponentProps<typeof HeroButton>;

export type ButtonTone = 'primary' | 'brand' | 'outline' | 'ghost' | 'danger';

const BUTTON_TONE_CLASSES: Record<ButtonTone, string> = {
  primary: 'bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold shadow-xs',
  brand:
    'bg-accent hover:opacity-95 text-accent-foreground font-semibold shadow-xs',
  outline:
    'bg-surface border border-border hover:border-accent text-foreground font-medium shadow-2xs',
  ghost: 'text-muted hover:text-foreground font-medium',
  danger: 'text-danger bg-danger/10 hover:bg-danger/15 font-medium',
};

const BUTTON_TO_HERO_VARIANT: Record<ButtonTone, HeroButtonProps['variant']> = {
  primary: 'primary',
  brand: 'primary',
  outline: 'secondary',
  ghost: 'ghost',
  danger: 'danger-soft',
};

export interface ButtonProps extends PropsWithChildren<
  Omit<HeroButtonProps, 'children'>
> {
  tone?: ButtonTone;
  isLoading?: boolean;
}

export function Button({
  tone = 'primary',
  size = 'sm',
  isLoading = false,
  isDisabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <HeroButton
      size={size}
      variant={BUTTON_TO_HERO_VARIANT[tone]}
      isDisabled={Boolean(isDisabled || isLoading)}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg text-xs transition-all',
        !props.isIconOnly && 'px-4 py-2',
        BUTTON_TONE_CLASSES[tone],
        className,
      )}
      {...props}
    >
      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
      {children}
    </HeroButton>
  );
}
