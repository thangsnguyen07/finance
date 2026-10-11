'use client';

import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@heroui/react';

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
          'text-[11px] font-bold uppercase tracking-wider text-muted',
        className,
      )}
    >
      {icon ? <span className="text-muted shrink-0">{icon}</span> : null}
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
        'w-full px-3.5 py-2 text-xs bg-surface border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors',
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
        'w-full px-3 py-2 text-xs font-medium bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors',
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
