'use client';

import { createContext, use, type PropsWithChildren } from 'react';

import { Card, CurrencyText, Row, Stack, Text } from '@/components/ui';

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
      'CategoryProportion subcomponents must be used within CategoryProportionSheet',
    );
  }
  return ctx;
}

function CategoryProportionRoot({
  items,
  totalAmount,
  emptyMessage,
  children,
}: PropsWithChildren<CategoryProportionContextValue>) {
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
    <Card.Header bordered className="mb-0 items-baseline pb-3">
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
    <div className="mt-4 flex h-3 w-full gap-0.5 overflow-hidden rounded-xs border border-border/60 bg-surface-secondary p-0.5">
      {items.map((item) => (
        <div
          key={item.categoryId}
          style={{
            width: `${Math.max(2, item.percentage)}%`,
            backgroundColor: item.color,
          }}
          title={`${item.categoryName}: ${item.percentage}%`}
          className="first:rounded-l-2xs last:rounded-r-2xs h-full transition-all duration-300"
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
        <Text variant="caption" tone="muted">
          {emptyMessage}
        </Text>
      </Card.Content>
    );
  }

  return (
    <Stack divided gap="none" className="pt-3">
      {items.map((item) => (
        <Row
          key={item.categoryId}
          justify="between"
          gap="md"
          className="py-2.5 text-xs"
        >
          <Row gap="sm" className="min-w-0">
            <span
              className="rounded-2xs h-2.5 w-2.5 shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <Stack gap="none" className="min-w-0">
              <Text variant="caption" weight="medium" truncate>
                {item.categoryName}
              </Text>
              <Text variant="mono" tone="muted">
                {item.count} bút toán
              </Text>
            </Stack>
          </Row>

          <Stack
            gap="none"
            className="shrink-0 text-right font-mono tabular-nums"
          >
            <CurrencyText
              amount={item.amount}
              className="block font-bold text-foreground"
            />
            <Text variant="mono" tone="muted">
              {item.percentage}%
            </Text>
          </Stack>
        </Row>
      ))}
    </Stack>
  );
}

export interface CategoryProportionSheetProps {
  title: string;
  subtitle: string;
  items: CategoryBreakdownItem[];
  totalAmount: number;
  emptyMessage: string;
}

function CategoryProportionSheetFlat({
  title,
  subtitle,
  items,
  totalAmount,
  emptyMessage,
}: CategoryProportionSheetProps) {
  return (
    <CategoryProportionRoot
      items={items}
      totalAmount={totalAmount}
      emptyMessage={emptyMessage}
    >
      <div>
        <CategoryProportionHeader title={title} subtitle={subtitle} />
        <CategoryProportionSegmentedBar />
        <CategoryProportionList />
      </div>
    </CategoryProportionRoot>
  );
}

export const CategoryProportionSheet = Object.assign(
  CategoryProportionSheetFlat,
  {
    Root: CategoryProportionRoot,
    Header: CategoryProportionHeader,
    SegmentedBar: CategoryProportionSegmentedBar,
    List: CategoryProportionList,
  },
);
