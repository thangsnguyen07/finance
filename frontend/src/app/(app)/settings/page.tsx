'use client';

import { useState } from 'react';
import { Button, Card, Chip } from '@heroui/react';
import {
  Plus,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useCategories, useCreateCategory } from '@/hooks/use-categories';
import type { CategoryType } from '@/types/api';

const COLOR_SWATCHES = [
  { label: 'Đỏ mận', value: '#991B1B' },
  { label: 'Hổ phách', value: '#B45309' },
  { label: 'Xanh bút máy', value: '#1E3A8A' },
  { label: 'Xanh rừng', value: '#166534' },
  { label: 'Nâu đất', value: '#7C2D12' },
  { label: 'Tím chàm', value: '#4338CA' },
];

export default function SettingsPage() {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryType, setCategoryType] = useState<CategoryType>('EXPENSE');
  const [selectedColor, setSelectedColor] = useState<string>('#991B1B');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();

  const expenseCategories = (categories || []).filter(
    (c) => c.type === 'EXPENSE',
  );
  const incomeCategories = (categories || []).filter(
    (c) => c.type === 'INCOME',
  );

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
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
          Cài Đặt Sổ & Danh Mục Thu Chi
        </h1>
        <p className="text-xs text-muted mt-1">
          Quản lý các nhãn phân loại bút toán thu nhập, chi tiêu và quy ước sổ
          cái
        </p>
      </div>

      {/* 2. Create Custom Category Form Card */}
      <Card className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs">
        <Card.Header className="p-0 pb-4 border-b border-border/70">
          <Card.Title className="font-serif font-bold text-base text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent" />
            <span>Tạo danh mục tùy chỉnh mới</span>
          </Card.Title>
          <Card.Description className="text-xs text-muted mt-0.5">
            Danh mục mới sẽ xuất hiện ngay trong cửa sổ Ghi sổ nhanh và Sổ ngân
            sách tháng
          </Card.Description>
        </Card.Header>

        <Card.Content className="p-0 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="p-3 text-xs text-danger bg-danger/10 border border-danger/20 rounded-md">
                {error}
              </div>
            ) : null}

            {successMsg ? (
              <div className="p-3 text-xs text-success bg-success/10 border border-success/20 rounded-md flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Type Selector */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Nhóm danh mục
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-secondary rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryType('EXPENSE');
                      setSelectedColor('#991B1B');
                    }}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      categoryType === 'EXPENSE'
                        ? 'bg-danger text-white shadow-2xs'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Chi tiêu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryType('INCOME');
                      setSelectedColor('#166534');
                    }}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      categoryType === 'INCOME'
                        ? 'bg-success text-white shadow-2xs'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Thu nhập</span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="VD: Gửi xe tháng, Hiếu hỉ, Freelance..."
                  maxLength={100}
                  className="w-full px-3.5 py-2 text-xs bg-surface border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Ink Swatches & Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted mr-1">Màu mực đánh dấu:</span>
                {COLOR_SWATCHES.map((swatch) => {
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
                variant="primary"
                size="sm"
                isDisabled={createCategoryMutation.isPending}
                className="px-4 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg shadow-xs flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
              >
                {createCategoryMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Thêm danh mục</span>
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>

      {/* 3. Existing Categories Directory */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-xs">Đang tải danh bạ danh mục...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Expense Categories */}
          <Card className="bg-surface border border-border rounded-xl p-5 shadow-xs">
            <Card.Header className="p-0 pb-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-danger" />
                <Card.Title className="font-serif font-bold text-base text-foreground">
                  Danh mục Chi tiêu ({expenseCategories.length})
                </Card.Title>
              </div>
            </Card.Header>
            <Card.Content className="p-0 pt-2 divide-y divide-border/60">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#991B1B' }}
                    />
                    <span className="font-medium text-foreground">
                      {cat.name}
                    </span>
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

          {/* Income Categories */}
          <Card className="bg-surface border border-border rounded-xl p-5 shadow-xs">
            <Card.Header className="p-0 pb-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-success" />
                <Card.Title className="font-serif font-bold text-base text-foreground">
                  Danh mục Thu nhập ({incomeCategories.length})
                </Card.Title>
              </div>
            </Card.Header>
            <Card.Content className="p-0 pt-2 divide-y divide-border/60">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#166534' }}
                    />
                    <span className="font-medium text-foreground">
                      {cat.name}
                    </span>
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
        </div>
      )}
    </div>
  );
}
