'use client';

import { createContext, use } from 'react';
import { Card } from '@heroui/react';
import { formatVND } from '@/lib/formatters';
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
      <Card className="bg-surface border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
        {children}
      </Card>
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
    <Card.Header className="p-0 pb-3 border-b border-border flex items-baseline justify-between gap-2">
      <div>
        <Card.Title className="font-serif font-bold text-base text-foreground">
          {title}
        </Card.Title>
        <Card.Description className="text-xs text-muted mt-0.5">
          {subtitle}
        </Card.Description>
      </div>
      <span className="font-mono text-sm font-bold text-foreground tabular-nums">
        {formatVND(totalAmount)}
      </span>
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
      <Card.Content className="p-0 py-10 text-center">
        <p className="text-xs text-muted">{emptyMessage}</p>
      </Card.Content>
    );
  }

  return (
    <Card.Content className="p-0 pt-3 divide-y divide-border/60">
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
            <span className="font-bold text-foreground block">
              {formatVND(item.amount)}
            </span>
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
