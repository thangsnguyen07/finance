import { AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

import { BUDGET_STATUS, type BudgetStatus } from '../types/budget.types';

import type { AmountPresetItem } from '@/components/ui/vnd-amount-input';

export const BUDGET_LIMITS = {
  MIN_BUDGET_AMOUNT: 1000,
  DEFAULT_QUERY_MONTH_KEY: 'current',
} as const;

export const BUDGET_MESSAGES = {
  LOAD_ERROR: 'Không thể tải dữ liệu ngân sách tháng',
  CATEGORY_REQUIRED: 'Vui lòng chọn một danh mục chi tiêu',
  MIN_AMOUNT_REQUIRED: 'Vui lòng đặt hạn mức tối thiểu từ 1.000 ₫ trở lên',
  INVALID_DATA: 'Dữ liệu hạn mức không hợp lệ',
  UPSERT_ERROR: 'Không thể lưu hạn mức. Vui lòng thử lại.',
  DELETE_ERROR: 'Không thể xóa hạn mức này.',
} as const;

export const BUDGET_AMOUNT_PRESETS: ReadonlyArray<AmountPresetItem> = [
  { label: '1.000.000 ₫', value: 1000000, mode: 'replace' },
  { label: '2.000.000 ₫', value: 2000000, mode: 'replace' },
  { label: '3.000.000 ₫', value: 3000000, mode: 'replace' },
  { label: '5.000.000 ₫', value: 5000000, mode: 'replace' },
  { label: '10.000.000 ₫', value: 10000000, mode: 'replace' },
];

export const BUDGET_STATUS_CONFIG: Record<
  BudgetStatus,
  {
    label: string;
    color: 'success' | 'warning' | 'danger';
    icon: typeof CheckCircle2;
  }
> = {
  [BUDGET_STATUS.SAFE]: {
    label: 'Trong tầm kiểm soát',
    color: 'success',
    icon: CheckCircle2,
  },
  [BUDGET_STATUS.WARNING]: {
    label: 'Sắp chạm trần',
    color: 'warning',
    icon: AlertTriangle,
  },
  [BUDGET_STATUS.EXCEEDED]: {
    label: 'Vượt kế hoạch',
    color: 'danger',
    icon: Flame,
  },
};
