'use client';

import { Card, CurrencyText } from '@/components/ui';
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
    <Card variant="subtle">
      <Card.Header className="pb-3">
        <div>
          <Card.Title className="text-sm">
            Danh mục chưa đặt hạn mức ({categories.length})
          </Card.Title>
          <Card.Description>
            Chọn một danh mục bên dưới để thiết lập phong bì hạn mức ngay
          </Card.Description>
        </div>
      </Card.Header>

      <Card.Content className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {categories.map((cat) => {
            const suggestedAmount =
              cat.spentAmount > 0
                ? Math.ceil(cat.spentAmount / 500000) * 500000
                : 2000000;

            return (
              <button
                key={cat.categoryId}
                type="button"
                onClick={() =>
                  onSelectCategory(cat.categoryId, suggestedAmount)
                }
                className="flex items-center justify-between p-3 bg-surface border border-border hover:border-accent rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-foreground block truncate group-hover:text-accent">
                    {cat.categoryName}
                  </span>
                  <span className="text-[11px] font-mono text-muted tabular-nums">
                    {cat.spentAmount > 0 ? (
                      <>
                        Tháng này đã chi:{' '}
                        <CurrencyText amount={cat.spentAmount} />
                      </>
                    ) : (
                      'Chưa phát sinh chi tiêu'
                    )}
                  </span>
                </div>
                <span className="text-xs font-semibold text-accent shrink-0">
                  + Đặt hạn mức
                </span>
              </button>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
}
