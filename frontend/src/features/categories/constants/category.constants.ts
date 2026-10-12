import { CATEGORY_TYPE, type CategoryType } from '../types/category.types';

export const DEFAULT_CATEGORY_TYPE: CategoryType = CATEGORY_TYPE.EXPENSE;

export const DEFAULT_CATEGORY_COLORS: Record<CategoryType, string> = {
  [CATEGORY_TYPE.EXPENSE]: '#991B1B',
  [CATEGORY_TYPE.INCOME]: '#166534',
} as const;

export const CATEGORY_MESSAGES = {
  NAME_REQUIRED: 'Vui lòng nhập tên danh mục',
  INVALID_DATA: 'Dữ liệu không hợp lệ',
  CREATE_ERROR: 'Không thể tạo danh mục mới. Vui lòng thử lại.',
  CREATE_SUCCESS: (name: string) => `Đã thêm danh mục "${name}" vào sổ.`,
} as const;

export const CATEGORY_COLOR_SWATCHES = [
  { label: 'Đỏ mận', value: '#991B1B' },
  { label: 'Hổ phách', value: '#B45309' },
  { label: 'Xanh bút máy', value: '#1E3A8A' },
  { label: 'Xanh rừng', value: '#166534' },
  { label: 'Nâu đất', value: '#7C2D12' },
  { label: 'Tím chàm', value: '#4338CA' },
] as const;
