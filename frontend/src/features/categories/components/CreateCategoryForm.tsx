'use client';

import { Plus, Tag } from 'lucide-react';

import {
  Alert,
  Button,
  Card,
  ChoiceGroup,
  Field,
  Grid,
  Row,
  SegmentedControl,
  Stack,
  Text,
} from '@/components/ui';

import {
  CATEGORY_COLOR_SWATCHES,
  CATEGORY_TYPE_ICONS,
  CATEGORY_TYPE_LABELS,
  CATEGORY_TYPE_OPTIONS,
  CATEGORY_TYPE_TONES,
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

  const colorChoices = CATEGORY_COLOR_SWATCHES.map((swatch) => ({
    value: swatch.value,
    label: swatch.label,
    color: swatch.value,
  }));

  return (
    <Card
      title={
        <Row gap="sm">
          <Tag className="h-4 w-4 text-accent" />
          <span>Tạo danh mục tùy chỉnh mới</span>
        </Row>
      }
      description="Danh mục mới sẽ xuất hiện ngay trong cửa sổ Ghi sổ nhanh và Sổ ngân sách tháng"
      borderedHeader
    >
      <Stack as="form" onSubmit={handleSubmit} gap="lg">
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {successMsg ? <Alert variant="success">{successMsg}</Alert> : null}

        <Grid cols={3} gap="lg">
          <Field.Root>
            <Field.Label>Nhóm danh mục</Field.Label>
            <SegmentedControl<CategoryType>
              value={categoryType}
              onChange={handleTypeChange}
              fullWidth
              size="sm"
              options={CATEGORY_TYPE_OPTIONS.map((typeOption) => {
                const Icon = CATEGORY_TYPE_ICONS[typeOption];
                return {
                  value: typeOption,
                  label: (
                    <>
                      <Icon className="h-3.5 w-3.5" />
                      <span>{CATEGORY_TYPE_LABELS[typeOption]}</span>
                    </>
                  ),
                  tone: CATEGORY_TYPE_TONES[typeOption],
                };
              })}
            />
          </Field.Root>

          <Field.Input
            containerClassName="sm:col-span-2"
            label="Tên danh mục"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="VD: Gửi xe tháng, Hiếu hỉ, Freelance..."
            maxLength={100}
          />
        </Grid>

        <Row justify="between" wrap gap="lg" className="pt-1">
          <Row wrap gap="sm">
            <Text variant="caption" tone="muted" className="mr-1">
              Màu mực đánh dấu:
            </Text>
            <ChoiceGroup
              variant="swatch"
              value={selectedColor}
              onChange={setSelectedColor}
              items={colorChoices}
            />
          </Row>

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
        </Row>
      </Stack>
    </Card>
  );
}
