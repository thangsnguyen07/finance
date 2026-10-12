'use client';

import { cn } from '@heroui/react';

import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

function FieldRoot({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('space-y-1.5', className)}>{children}</div>;
}

function FieldLabel({
  icon,
  uppercase = false,
  className,
  children,
}: {
  icon?: React.ReactNode;
  uppercase?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        'flex items-center gap-1.5 text-xs font-semibold text-foreground',
        uppercase &&
          'text-[11px] font-bold tracking-wider text-muted uppercase',
        className,
      )}
    >
      {icon ? <span className="shrink-0 text-muted">{icon}</span> : null}
      <span>{children}</span>
    </label>
  );
}

function FieldInput({
  mono = false,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-foreground transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-none',
        mono && 'font-mono tabular-nums',
        className,
      )}
      {...props}
    />
  );
}

function FieldSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors focus:border-accent focus:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Input: FieldInput,
  Select: FieldSelect,
};
