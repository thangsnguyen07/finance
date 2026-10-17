'use client';

import { Card as HeroCard, cn } from '@heroui/react';

import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';

type HeroCardRootProps = ComponentProps<typeof HeroCard>;
type HeroCardHeaderProps = ComponentProps<typeof HeroCard.Header>;
type HeroCardTitleProps = ComponentProps<typeof HeroCard.Title>;
type HeroCardDescriptionProps = ComponentProps<typeof HeroCard.Description>;
type HeroCardContentProps = ComponentProps<typeof HeroCard.Content>;
type HeroCardFooterProps = ComponentProps<typeof HeroCard.Footer>;

export type CardVariant =
  | 'default'
  | 'compact'
  | 'subtle'
  | 'muted'
  | 'flush'
  | 'dashed'
  | 'postIt'
  | 'post-it';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs',
  compact: 'bg-surface border border-border rounded-xl p-4 shadow-xs',
  subtle:
    'bg-surface-secondary/40 border border-border rounded-xl p-5 shadow-2xs',
  muted:
    'bg-surface-secondary/40 border border-border rounded-xl p-5 shadow-2xs',
  flush:
    'bg-surface border border-border rounded-xl p-0 overflow-hidden shadow-xs',
  dashed:
    'bg-surface/50 border border-dashed border-border rounded-xl p-5 shadow-none',
  postIt:
    'relative bg-post-it text-post-it-foreground border border-[#FDE047] dark:border-[#5C5627] rounded-lg p-5 shadow-sm overflow-visible',
  'post-it':
    'relative bg-post-it text-post-it-foreground border border-[#FDE047] dark:border-[#5C5627] rounded-lg p-5 shadow-sm overflow-visible',
};

const CARD_PADDING_CLASSES: Record<CardPadding, string> = {
  none: 'p-0 sm:p-0',
  sm: 'p-3.5 sm:p-3.5',
  md: 'p-4 sm:p-4',
  lg: 'p-6 sm:p-8',
};

export interface CardRootProps extends Omit<
  HeroCardRootProps,
  'variant' | 'title'
> {
  variant?: CardVariant;
  padding?: CardPadding;
  title?: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  borderedHeader?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  divided?: boolean;
  footer?: ReactNode;
  footerClassName?: string;
}

function CardHeader({
  className,
  bordered = false,
  children,
  ...props
}: HeroCardHeaderProps & { bordered?: boolean }) {
  return (
    <HeroCard.Header
      className={cn(
        'flex items-center justify-between gap-3 p-0',
        bordered && 'mb-3.5 border-b border-border/80 pb-3.5',
        className,
      )}
      {...props}
    >
      {children}
    </HeroCard.Header>
  );
}

function CardTitle({ className, children, ...props }: HeroCardTitleProps) {
  return (
    <HeroCard.Title
      className={cn(
        'font-serif text-base font-bold tracking-tight text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </HeroCard.Title>
  );
}

function CardEyebrow({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'block text-xs font-semibold tracking-wider text-muted uppercase',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

function CardDescription({
  className,
  children,
  ...props
}: HeroCardDescriptionProps) {
  return (
    <HeroCard.Description
      className={cn('mt-0.5 text-xs text-muted', className)}
      {...props}
    >
      {children}
    </HeroCard.Description>
  );
}

function CardContent({ className, children, ...props }: HeroCardContentProps) {
  return (
    <HeroCard.Content className={cn('p-0', className)} {...props}>
      {children}
    </HeroCard.Content>
  );
}

function CardFooter({ className, children, ...props }: HeroCardFooterProps) {
  return (
    <HeroCard.Footer
      className={cn(
        'mt-4 flex items-center justify-between gap-3 border-t border-border/70 p-0 pt-3',
        className,
      )}
      {...props}
    >
      {children}
    </HeroCard.Footer>
  );
}

function CardRoot({
  variant = 'default',
  padding,
  title,
  eyebrow,
  description,
  headerAction,
  borderedHeader = false,
  headerClassName,
  contentClassName,
  divided = false,
  footer,
  footerClassName,
  className,
  children,
  ...props
}: CardRootProps) {
  const hasFlatHeader = Boolean(
    title || eyebrow || description || headerAction,
  );
  const hasFlatSlots = Boolean(
    hasFlatHeader || footer || contentClassName || divided,
  );

  return (
    <HeroCard
      className={cn(
        CARD_VARIANT_CLASSES[variant],
        padding && CARD_PADDING_CLASSES[padding],
        className,
      )}
      {...props}
    >
      {hasFlatHeader ? (
        <CardHeader bordered={borderedHeader} className={headerClassName}>
          <div>
            {eyebrow ? <CardEyebrow>{eyebrow}</CardEyebrow> : null}
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {headerAction}
        </CardHeader>
      ) : null}

      {hasFlatSlots ? (
        <CardContent
          className={cn(
            divided && 'divide-y divide-border/70',
            contentClassName,
          )}
        >
          {children}
        </CardContent>
      ) : (
        children
      )}

      {footer ? (
        <CardFooter className={footerClassName}>{footer}</CardFooter>
      ) : null}
    </HeroCard>
  );
}

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Eyebrow: CardEyebrow,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
