'use client';

import { Card } from '@heroui/react';
import { formatVND } from '@/lib/formatters';
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
    <Card className="bg-surface-secondary/40 border border-border rounded-xl p-5 shadow-2xs">
      <Card.Header className="p-0 pb-3">
        <Card.Title className="font-serif font-bold text-sm text-foreground">
          Danh mục chưa đặt hạn mức ({categories.length})
        </Card.Title>
        <Card.Description className="text-xs text-muted mt-0.5">
          Chọn một danh mục bên dưới để thiết lập phong bì hạn mức ngay
        </Card.Description>
      </Card.Header>

      <Card.Content className="p-0 pt-2">
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
                    {cat.spentAmount > 0
                      ? `Tháng này đã chi: ${formatVND(cat.spentAmount)}`
                      : 'Chưa phát sinh chi tiêu'}
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
