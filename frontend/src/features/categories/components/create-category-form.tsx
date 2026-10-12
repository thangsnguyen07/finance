'use client';

import { useState } from 'react';
import { Plus, Tag, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import {
  Card,
  Button,
  Field,
  Alert,
  SegmentedControl,
} from '@/components/ui';
import { CATEGORY_COLOR_SWATCHES } from '../constants/category.constants';
import { useCreateCategory } from '../hooks/use-categories';
import type { CategoryType } from '../types/category.types';

export function CreateCategoryForm() {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryType, setCategoryType] = useState<CategoryType>('EXPENSE');
  const [selectedColor, setSelectedColor] = useState<string>('#991B1B');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const createCategoryMutation = useCreateCategory();

  const handleTypeChange = (nextType: CategoryType) => {
    setCategoryType(nextType);
    setSelectedColor(nextType === 'EXPENSE' ? '#991B1B' : '#166534');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmed = categoryName.trim();
    if (!trimmed) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: trimmed,
        type: categoryType,
        color: selectedColor,
      });
      setCategoryName('');
      setSuccessMsg(`Đã thêm danh mục "${trimmed}" vào sổ.`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể tạo danh mục mới. Vui lòng thử lại.');
      }
    }
  };

  return (
    <Card>
      <Card.Header bordered>
        <div>
          <Card.Title className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent" />
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field.Root>
              <Field.Label>Nhóm danh mục</Field.Label>
              <SegmentedControl<CategoryType>
                value={categoryType}
                onChange={handleTypeChange}
                fullWidth
                size="sm"
                options={[
                  {
                    value: 'EXPENSE',
                    label: (
                      <>
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>Chi tiêu</span>
                      </>
                    ),
                    activeClassName: 'bg-danger text-white shadow-2xs',
                  },
                  {
                    value: 'INCOME',
                    label: (
                      <>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Thu nhập</span>
                      </>
                    ),
                    activeClassName: 'bg-success text-white shadow-2xs',
                  },
                ]}
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted mr-1">Màu mực đánh dấu:</span>
              {CATEGORY_COLOR_SWATCHES.map((swatch) => {
                const isSelected = selectedColor === swatch.value;
                return (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => setSelectedColor(swatch.value)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-foreground bg-surface-secondary font-bold text-foreground'
                        : 'border-border bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
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
              isLoading={createCategoryMutation.isPending}
              className="self-end sm:self-auto"
            >
              {!createCategoryMutation.isPending ? (
                <Plus className="w-4 h-4" />
              ) : null}
              <span>Thêm danh mục</span>
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
