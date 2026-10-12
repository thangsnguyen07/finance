'use client';

import type { ReactNode } from 'react';
import { Surface as HeroSurface, cn } from '@heroui/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidthClass?: string;
  children: ReactNode;
}

function ModalRoot({
  isOpen,
  onClose,
  maxWidthClass = 'max-w-lg',
  children,
}: ModalRootProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/30 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <HeroSurface
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full bg-surface text-foreground border-t sm:border border-border rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150',
          maxWidthClass,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </HeroSurface>
    </div>
  );
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
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-secondary/50 shrink-0">
      <div>
        <h2 className="font-serif font-bold text-base sm:text-lg text-foreground">
          {title}
        </h2>
        {subtitle ? (
          <div className="text-[11px] text-muted mt-0.5">{subtitle}</div>
        ) : null}
      </div>
      <Button
        isIconOnly
        size="sm"
        tone="ghost"
        aria-label="Đóng cửa sổ"
        onPress={onClose}
        className="w-8 h-8 min-w-8 rounded-md text-muted hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

function ModalBody({ children }: { children: ReactNode }) {
  return <div className="p-5 space-y-4 overflow-y-auto">{children}</div>;
}

function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
      {children}
    </div>
  );
}

export const Modal = {
  Root: ModalRoot,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
};
