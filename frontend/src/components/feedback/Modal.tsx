'use client';

import { Surface as HeroSurface, cn } from '@heroui/react';
import { X } from 'lucide-react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

import type { FormEvent, PropsWithChildren, ReactNode } from 'react';

export interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: ReactNode;
  error?: string | null;
  onSubmit?: (e: FormEvent) => void;
  submitLabel?: ReactNode;
  cancelLabel?: ReactNode;
  isSubmitting?: boolean;
  footerLeading?: ReactNode;
  maxWidthClass?: string;
}

function ModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface-secondary/50 px-5 py-3.5">
      <div>
        <h2 className="font-serif text-base font-bold text-foreground sm:text-lg">
          {title}
        </h2>
        {subtitle ? (
          <div className="mt-0.5 text-[11px] text-muted">{subtitle}</div>
        ) : null}
      </div>
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Đóng cửa sổ"
        onPress={onClose}
        className="h-8 w-8 min-w-8 rounded-md text-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ModalBody({ children }: PropsWithChildren) {
  return <div className="space-y-4 overflow-y-auto p-5">{children}</div>;
}

function ModalFooter({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
      {children}
    </div>
  );
}

function ModalRoot({
  isOpen,
  onClose,
  title,
  subtitle,
  error,
  onSubmit,
  submitLabel,
  cancelLabel = 'Hủy',
  isSubmitting = false,
  footerLeading,
  maxWidthClass = 'max-w-lg',
  children,
}: ModalProps) {
  if (!isOpen) return null;

  const isFlatModal = Boolean(title || onSubmit || submitLabel);

  const innerContent = isFlatModal ? (
    <>
      {title ? (
        <ModalHeader title={title} subtitle={subtitle} onClose={onClose} />
      ) : null}
      <ModalBody>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {children}
        {submitLabel ? (
          <ModalFooter>
            <div>{footerLeading}</div>
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                tone="ghost"
                size="sm"
                isDisabled={isSubmitting}
                onPress={onClose}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                tone="primary"
                size="sm"
                isLoading={isSubmitting}
                className="px-5 py-2"
              >
                <span>{submitLabel}</span>
              </Button>
            </div>
          </ModalFooter>
        ) : null}
      </ModalBody>
    </>
  ) : (
    children
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex animate-in items-end justify-center bg-foreground/30 p-0 backdrop-blur-xs duration-150 fade-in sm:items-center sm:p-4"
    >
      <HeroSurface
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex max-h-[92vh] w-full animate-in flex-col overflow-hidden rounded-t-2xl border-t border-border bg-surface text-foreground shadow-2xl duration-150 slide-in-from-bottom-4 sm:rounded-xl sm:border sm:zoom-in-95',
          maxWidthClass,
        )}
        role="dialog"
        aria-modal="true"
      >
        {onSubmit ? (
          <form onSubmit={onSubmit} className="flex flex-col overflow-hidden">
            {innerContent}
          </form>
        ) : (
          innerContent
        )}
      </HeroSurface>
    </div>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
