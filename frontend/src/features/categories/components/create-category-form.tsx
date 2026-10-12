'use client';

import { Plus, Tag } from 'lucide-react';

import { Card, Button, Field, Alert, SegmentedControl } from '@/components/ui';

import {
  CATEGORY_COLOR_SWATCHES,
  CATEGORY_TYPE_OPTIONS,
  CATEGORY_TYPE_UI_CONFIG,
} from '../constants/category.constants';
import { useCreateCategoryForm } from '../hooks/use-categories';

import type { CategoryType } from '../types/category.types';

export function CreateCategoryForm() {
  const {
    categoryName,
    setCategoryName,
    categoryType,
    handleTypeChange,
    selectedColor,
    setSelectedColor,
    error,
    successMsg,
    isPending,
    handleSubmit,
  } = useCreateCategoryForm();

  return (
    <Card>
      <Card.Header bordered>
        <div>
          <Card.Title className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-accent" />
            <span>Tạo danh mục tùy chỉnh mới</span>
          </Card.Title>
          <Card.Description>
            Danh mục mới sẽ xuất hiện ngay trong cửa sổ Ghi sổ nhanh và Sổ ngân
            sách tháng
          </Card.Description>
        </div>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <Alert variant="danger">{error}</Alert> : null}
          {successMsg ? <Alert variant="success">{successMsg}</Alert> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field.Root>
              <Field.Label>Nhóm danh mục</Field.Label>
              <SegmentedControl<CategoryType>
                value={categoryType}
                onChange={handleTypeChange}
                fullWidth
                size="sm"
                options={CATEGORY_TYPE_OPTIONS.map((typeOption) => {
                  const config = CATEGORY_TYPE_UI_CONFIG[typeOption];
                  const Icon = config.icon;
                  return {
                    value: typeOption,
                    label: (
                      <>
                        <Icon className="h-3.5 w-3.5" />
                        <span>{config.label}</span>
                      </>
                    ),
                    activeClassName: config.activeSegmentClass,
                  };
                })}
              />
            </Field.Root>

            <Field.Root className="sm:col-span-2">
              <Field.Label>Tên danh mục</Field.Label>
              <Field.Input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="VD: Gửi xe tháng, Hiếu hỉ, Freelance..."
                maxLength={100}
              />
            </Field.Root>
          </div>

          <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs text-muted">Màu mực đánh dấu:</span>
              {CATEGORY_COLOR_SWATCHES.map((swatch) => {
                const isSelected = selectedColor === swatch.value;
                return (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => setSelectedColor(swatch.value)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-all ${
                      isSelected
                        ? 'border-foreground bg-surface-secondary font-bold text-foreground'
                        : 'border-border bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: swatch.value }}
                    />
                    <span>{swatch.label}</span>
                  </button>
                );
              })}
            </div>

            <Button
              type="submit"
              tone="primary"
              size="sm"
              isLoading={isPending}
              className="self-end sm:self-auto"
            >
              {!isPending ? <Plus className="h-4 w-4" /> : null}
              <span>Thêm danh mục</span>
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
