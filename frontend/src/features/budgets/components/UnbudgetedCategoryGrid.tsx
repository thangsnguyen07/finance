'use client';

import { Card, CurrencyText, Grid, Stack, Text } from '@/components/ui';

import type { UnbudgetedCategoryResponse } from '../types/budget.types';

interface UnbudgetedCategoryGridProps {
  categories: UnbudgetedCategoryResponse[];
  onSelectCategory: (categoryId: string, suggestedAmount: number) => void;
}

export function UnbudgetedCategoryGrid({
  categories,
  onSelectCategory,
}: UnbudgetedCategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <Card
      variant="subtle"
      title={`Danh mục chưa đặt hạn mức (${categories.length})`}
      description="Chọn một danh mục bên dưới để thiết lập phong bì hạn mức ngay"
    >
      <Grid cols={3} gap="sm">
        {categories.map((cat) => {
          const suggestedAmount =
            cat.spentAmount > 0
              ? Math.ceil(cat.spentAmount / 500000) * 500000
              : 2000000;

          return (
            <button
              key={cat.categoryId}
              type="button"
              onClick={() => onSelectCategory(cat.categoryId, suggestedAmount)}
              className="group flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-accent"
            >
              <Stack gap="none" className="min-w-0 pr-2">
                <Text
                  as="span"
                  variant="caption"
                  weight="semibold"
                  truncate
                  className="group-hover:text-accent"
                >
                  {cat.categoryName}
                </Text>
                <Text as="span" variant="mono" tone="muted">
                  {cat.spentAmount > 0 ? (
                    <>
                      Tháng này đã chi:{' '}
                      <CurrencyText amount={cat.spentAmount} />
                    </>
                  ) : (
                    'Chưa phát sinh chi tiêu'
                  )}
                </Text>
              </Stack>
              <Text
                as="span"
                variant="caption"
                tone="accent"
                weight="semibold"
                className="shrink-0"
              >
                + Đặt hạn mức
              </Text>
            </button>
          );
        })}
      </Grid>
    </Card>
  );
}
