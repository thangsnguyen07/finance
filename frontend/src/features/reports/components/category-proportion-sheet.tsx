'use client';

import { createContext, use } from 'react';
import { Card, CurrencyText } from '@/components/ui';
import type { CategoryBreakdownItem } from '../types/report.types';

interface CategoryProportionContextValue {
  items: CategoryBreakdownItem[];
  totalAmount: number;
  emptyMessage: string;
}

const CategoryProportionContext =
  createContext<CategoryProportionContextValue | null>(null);

function useCategoryProportionContext(): CategoryProportionContextValue {
  const ctx = use(CategoryProportionContext);
  if (!ctx) {
    throw new Error(
      'CategoryProportion subcomponents must be used within CategoryProportionSheet.Root',
    );
  }
  return ctx;
}

function CategoryProportionRoot({
  items,
  totalAmount,
  emptyMessage,
  children,
}: {
  items: CategoryBreakdownItem[];
  totalAmount: number;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <CategoryProportionContext value={{ items, totalAmount, emptyMessage }}>
      <Card className="flex flex-col justify-between">{children}</Card>
    </CategoryProportionContext>
  );
}

function CategoryProportionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { totalAmount } = useCategoryProportionContext();
  return (
    <Card.Header bordered className="items-baseline">
      <div>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{subtitle}</Card.Description>
      </div>
      <CurrencyText
        amount={totalAmount}
        className="text-sm font-bold text-ink-primary"
      />
    </Card.Header>
  );
}

function CategoryProportionSegmentedBar() {
  const { items, totalAmount } = useCategoryProportionContext();
  if (items.length === 0 || totalAmount <= 0) return null;

  return (
    <div className="mb-3 flex h-3 w-full gap-0.5 overflow-hidden rounded-xs border border-ledger-border/60 bg-paper-muted p-0.5">
      {items.map((item) => (
        <div
          key={item.categoryId}
          style={{
            width: `${Math.max(2, item.percentage)}%`,
            backgroundColor: item.color,
          }}
          title={`${item.categoryName}: ${item.percentage}%`}
          className="h-full transition-all duration-300 first:rounded-l-2xs last:rounded-r-2xs"
        />
      ))}
    </div>
  );
}

function CategoryProportionList() {
  const { items, emptyMessage } = useCategoryProportionContext();

  if (items.length === 0) {
    return (
      <Card.Content className="py-10 text-center">
        <p className="text-xs text-ink-secondary">{emptyMessage}</p>
      </Card.Content>
    );
  }

  return (
    <Card.Content className="divide-y divide-ledger-border/60">
      {items.map((item) => (
        <div
          key={item.categoryId}
          className="flex items-center justify-between gap-3 py-2.5 text-xs"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-2xs"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <span className="block truncate font-medium text-ink-primary">
                {item.categoryName}
              </span>
              <span className="text-[11px] text-ink-secondary">
                {item.count} bút toán
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right font-mono tabular-nums">
            <CurrencyText
              amount={item.amount}
              className="block font-bold text-ink-primary"
            />
            <span className="text-[11px] text-ink-secondary">
              {item.percentage}%
            </span>
          </div>
        </div>
      ))}
    </Card.Content>
  );
}

export const CategoryProportionSheet = {
  Root: CategoryProportionRoot,
  Header: CategoryProportionHeader,
  SegmentedBar: CategoryProportionSegmentedBar,
  List: CategoryProportionList,
};
