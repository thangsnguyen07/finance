'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { Badge, Card, Row, Stack, Text } from '@/components/ui';

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
    <Card
      title={
        <Row gap="sm">
          {type === 'EXPENSE' ? (
            <ArrowDownRight className="h-4 w-4 text-danger" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-success" />
          )}
          <span>
            {title} ({categories.length})
          </span>
        </Row>
      }
      borderedHeader
    >
      <Stack divided gap="none">
        {categories.map((cat) => (
          <Row key={cat.id} justify="between" className="py-2.5 text-xs">
            <Row gap="sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color || defaultColor }}
              />
              <Text variant="caption" weight="medium">
                {cat.name}
              </Text>
            </Row>
            <Badge size="sm" variant="secondary" mono>
              {cat.isSystemDefault ? 'Mặc định' : 'Tùy chỉnh'}
            </Badge>
          </Row>
        ))}
      </Stack>
    </Card>
  );
}
