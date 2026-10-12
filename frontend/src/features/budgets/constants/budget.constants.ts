import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  type LucideIcon,
} from 'lucide-react';

import { BUDGET_STATUS, type BudgetStatus } from '../types/budget.types';

import type { AmountPresetItem } from '@/components/ui';

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

export const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  [BUDGET_STATUS.SAFE]: 'Trong tầm kiểm soát',
  [BUDGET_STATUS.WARNING]: 'Sắp chạm trần',
  [BUDGET_STATUS.EXCEEDED]: 'Vượt kế hoạch',
};

export const BUDGET_STATUS_ICONS: Record<BudgetStatus, LucideIcon> = {
  [BUDGET_STATUS.SAFE]: CheckCircle2,
  [BUDGET_STATUS.WARNING]: AlertTriangle,
  [BUDGET_STATUS.EXCEEDED]: Flame,
};

export const BUDGET_STATUS_TONES: Record<
  BudgetStatus,
  'success' | 'warning' | 'danger'
> = {
  [BUDGET_STATUS.SAFE]: 'success',
  [BUDGET_STATUS.WARNING]: 'warning',
  [BUDGET_STATUS.EXCEEDED]: 'danger',
};
