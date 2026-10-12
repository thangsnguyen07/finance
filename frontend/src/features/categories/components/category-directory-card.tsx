'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
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
    <Card>
      <Card.Header bordered className="mb-0 pb-3">
        <div className="flex items-center gap-2">
          {type === 'EXPENSE' ? (
            <ArrowDownRight className="w-4 h-4 text-danger" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-success" />
          )}
          <Card.Title>
            {title} ({categories.length})
          </Card.Title>
        </div>
      </Card.Header>
      <Card.Content className="pt-2 divide-y divide-border/60">
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
            <Badge size="sm" variant="secondary" mono>
              {cat.isSystemDefault ? 'Mặc định' : 'Tùy chỉnh'}
            </Badge>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}
