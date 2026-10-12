'use client';

import { cn } from '@heroui/react';

import type { ElementType, ComponentPropsWithoutRef } from 'react';

export type LayoutSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LayoutPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type FlexAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type GridColumns = 1 | 2 | 3 | 4;

const STACK_GAP_CLASSES: Record<LayoutSpacing, string> = {
  none: 'space-y-0',
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4',
  xl: 'space-y-6',
};

const FLEX_GAP_CLASSES: Record<LayoutSpacing, string> = {
  none: 'gap-0',
  xs: 'gap-1.5',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
};

const PADDING_CLASSES: Record<LayoutPadding, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const ALIGN_CLASSES: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const JUSTIFY_CLASSES: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

const GRID_COL_CLASSES: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
};

type PolymorphicProps<E extends ElementType, P> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P | 'as'> & {
    as?: E;
  };

interface StackBaseProps {
  gap?: LayoutSpacing;
  align?: FlexAlign;
  justify?: FlexJustify;
  padding?: LayoutPadding;
  divided?: boolean;
}

export function Stack<E extends ElementType = 'div'>({
  as,
  gap = 'lg',
  align,
  justify,
  padding,
  divided = false,
  className,
  children,
  ...props
}: PolymorphicProps<E, StackBaseProps>) {
  const Component = as ?? 'div';
  return (
    <Component
      className={cn(
        (align || justify) && 'flex flex-col',
        align && ALIGN_CLASSES[align],
        justify && JUSTIFY_CLASSES[justify],
        !divided && STACK_GAP_CLASSES[gap],
        divided && 'divide-y divide-border/70',
        padding && PADDING_CLASSES[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface RowBaseProps {
  gap?: LayoutSpacing;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
  scrollX?: boolean;
  padding?: LayoutPadding;
}

export function Row<E extends ElementType = 'div'>({
  as,
  gap = 'sm',
  align = 'center',
  justify = 'start',
  wrap = false,
  scrollX = false,
  padding,
  className,
  children,
  ...props
}: PolymorphicProps<E, RowBaseProps>) {
  const Component = as ?? 'div';
  return (
    <Component
      className={cn(
        'flex',
        FLEX_GAP_CLASSES[gap],
        ALIGN_CLASSES[align],
        JUSTIFY_CLASSES[justify],
        wrap && 'flex-wrap',
        scrollX && 'no-scrollbar overflow-x-auto scroll-smooth',
        padding && PADDING_CLASSES[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface GridBaseProps {
  cols?: GridColumns;
  gap?: LayoutSpacing;
  padding?: LayoutPadding;
}

export function Grid<E extends ElementType = 'div'>({
  as,
  cols = 2,
  gap = 'md',
  padding,
  className,
  children,
  ...props
}: PolymorphicProps<E, GridBaseProps>) {
  const Component = as ?? 'div';
  return (
    <Component
      className={cn(
        'grid',
        GRID_COL_CLASSES[cols],
        FLEX_GAP_CLASSES[gap],
        padding && PADDING_CLASSES[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
