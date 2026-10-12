'use client';

import { cn } from '@heroui/react';

import type { ElementType, ComponentPropsWithoutRef } from 'react';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'eyebrow'
  | 'mono';

export type TextTone =
  | 'default'
  | 'muted'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'black';

const VARIANT_CLASSES: Record<TextVariant, string> = {
  display:
    'font-serif text-2xl sm:text-3xl font-black tracking-tight tabular-nums',
  heading: 'font-serif text-xl sm:text-2xl font-bold tracking-tight',
  title: 'font-serif text-base font-bold tracking-tight',
  subtitle: 'text-xs sm:text-sm font-semibold',
  body: 'text-xs leading-relaxed',
  caption: 'text-[11px]',
  eyebrow: 'text-[11px] font-bold tracking-wider uppercase',
  mono: 'font-mono text-xs tabular-nums',
};

const DEFAULT_ELEMENT: Record<TextVariant, ElementType> = {
  display: 'h2',
  heading: 'h2',
  title: 'h3',
  subtitle: 'h4',
  body: 'p',
  caption: 'span',
  eyebrow: 'span',
  mono: 'span',
};

const TONE_CLASSES: Record<TextTone, string> = {
  default: 'text-foreground',
  muted: 'text-muted',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const WEIGHT_CLASSES: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
};

interface TextOwnProps<E extends ElementType> {
  as?: E;
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextWeight;
  truncate?: boolean;
}

type PolymorphicTextProps<E extends ElementType> = TextOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps<E>>;

export function Text<E extends ElementType = 'span'>({
  as,
  variant = 'body',
  tone = 'default',
  weight,
  truncate = false,
  className,
  children,
  ...props
}: PolymorphicTextProps<E>) {
  const Component = as ?? DEFAULT_ELEMENT[variant];

  return (
    <Component
      className={cn(
        VARIANT_CLASSES[variant],
        TONE_CLASSES[tone],
        weight && WEIGHT_CLASSES[weight],
        truncate && 'block truncate',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
