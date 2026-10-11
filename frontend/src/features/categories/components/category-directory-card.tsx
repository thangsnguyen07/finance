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
      <Card.Header bordered>
        <div className="flex items-center gap-2">
          {type === 'EXPENSE' ? (
            <ArrowDownRight className="h-4 w-4 text-accent-coral" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-accent-teal" />
          )}
          <Card.Title>
            {title} ({categories.length})
          </Card.Title>
        </div>
      </Card.Header>
      <Card.Content className="divide-y divide-ledger-border/60">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between py-2.5 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color || defaultColor }}
              />
              <span className="font-medium text-ink-primary">{cat.name}</span>
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
