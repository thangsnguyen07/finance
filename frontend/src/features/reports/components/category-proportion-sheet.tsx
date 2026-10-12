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
    <Card.Header bordered className="items-baseline mb-0 pb-3">
      <div>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{subtitle}</Card.Description>
      </div>
      <CurrencyText
        amount={totalAmount}
        className="text-sm font-bold text-foreground"
      />
    </Card.Header>
  );
}

function CategoryProportionSegmentedBar() {
  const { items, totalAmount } = useCategoryProportionContext();
  if (items.length === 0 || totalAmount <= 0) return null;

  return (
    <div className="mt-4 h-3 w-full rounded-xs overflow-hidden flex bg-surface-secondary border border-border/60 p-0.5 gap-0.5">
      {items.map((item) => (
        <div
          key={item.categoryId}
          style={{
            width: `${Math.max(2, item.percentage)}%`,
            backgroundColor: item.color,
          }}
          title={`${item.categoryName}: ${item.percentage}%`}
          className="h-full first:rounded-l-2xs last:rounded-r-2xs transition-all duration-300"
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
        <p className="text-xs text-muted">{emptyMessage}</p>
      </Card.Content>
    );
  }

  return (
    <Card.Content className="pt-3 divide-y divide-border/60">
      {items.map((item) => (
        <div
          key={item.categoryId}
          className="py-2.5 flex items-center justify-between text-xs gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-2xs shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <span className="font-medium text-foreground truncate block">
                {item.categoryName}
              </span>
              <span className="text-[11px] text-muted">
                {item.count} bút toán
              </span>
            </div>
          </div>

          <div className="text-right font-mono tabular-nums shrink-0">
            <CurrencyText
              amount={item.amount}
              className="font-bold text-foreground block"
            />
            <span className="text-[11px] text-muted">{item.percentage}%</span>
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
