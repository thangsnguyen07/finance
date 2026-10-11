'use client';

import { Card, Chip } from '@heroui/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { CategoryResponse, CategoryType } from '../types/category.types';

interface CategoryDirectoryCardProps {
  title: string;
  type: CategoryType;
  categories: CategoryResponse[];
}

export function CategoryDirectoryCard({
  title,
  type,
  categories,
}: CategoryDirectoryCardProps) {
  const defaultColor = type === 'EXPENSE' ? '#991B1B' : '#166534';

  return (
    <Card className="bg-surface border border-border rounded-xl p-5 shadow-xs">
      <Card.Header className="p-0 pb-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === 'EXPENSE' ? (
            <ArrowDownRight className="w-4 h-4 text-danger" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-success" />
          )}
          <Card.Title className="font-serif font-bold text-base text-foreground">
            {title} ({categories.length})
          </Card.Title>
        </div>
      </Card.Header>
      <Card.Content className="p-0 pt-2 divide-y divide-border/60">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="py-2.5 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color || defaultColor }}
              />
              <span className="font-medium text-foreground">{cat.name}</span>
            </div>
            <Chip
              size="sm"
              variant="secondary"
              className="text-[10px] font-mono"
            >
              {cat.isSystemDefault ? 'Mặc định' : 'Tùy chỉnh'}
            </Chip>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
