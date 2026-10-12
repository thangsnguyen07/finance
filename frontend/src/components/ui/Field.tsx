'use client';

import { cn } from '@heroui/react';

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react';

export interface SelectOptionItem {
  value: string;
  label: ReactNode;
}

function FieldRoot({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('space-y-1.5', className)}>{children}</div>;
}

function FieldLabel({
  icon,
  uppercase = false,
  className,
  children,
}: {
  icon?: ReactNode;
  uppercase?: boolean;
  className?: string;
  children: ReactNode;
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

export interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  icon?: ReactNode;
  uppercaseLabel?: boolean;
  mono?: boolean;
  containerClassName?: string;
}

function FieldInput({
  label,
  icon,
  uppercaseLabel = false,
  mono = false,
  containerClassName,
  className,
  ...props
}: FieldInputProps) {
  const inputElement = (
    <input
      className={cn(
        'w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-foreground transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-none',
        mono && 'font-mono tabular-nums',
        className,
      )}
      {...props}
    />
  );

  if (!label) {
    return inputElement;
  }

  return (
    <FieldRoot className={containerClassName}>
      <FieldLabel icon={icon} uppercase={uppercaseLabel}>
        {label}
      </FieldLabel>
      {inputElement}
    </FieldRoot>
  );
}

export interface FieldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  icon?: ReactNode;
  uppercaseLabel?: boolean;
  options?: ReadonlyArray<SelectOptionItem>;
  placeholderOption?: string;
  containerClassName?: string;
}

function FieldSelect({
  label,
  icon,
  uppercaseLabel = false,
  options,
  placeholderOption,
  containerClassName,
  className,
  children,
  ...props
}: FieldSelectProps) {
  const selectElement = (
    <select
      className={cn(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors focus:border-accent focus:outline-none',
        className,
      )}
      {...props}
    >
      {placeholderOption !== undefined ? (
        <option value="">{placeholderOption}</option>
      ) : null}
      {options
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  );

  if (!label) {
    return selectElement;
  }

  return (
    <FieldRoot className={containerClassName}>
      <FieldLabel icon={icon} uppercase={uppercaseLabel}>
        {label}
      </FieldLabel>
      {selectElement}
    </FieldRoot>
  );
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Input: FieldInput,
  Select: FieldSelect,
};
