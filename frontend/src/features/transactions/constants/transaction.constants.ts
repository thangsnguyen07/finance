import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  type LucideIcon,
} from 'lucide-react';

import {
  TRANSACTION_FILTER_TYPE,
  TRANSACTION_TYPE,
  type TransactionFilterType,
  type TransactionType,
} from '../types/transaction.types';

import type { AmountPresetItem } from '@/components/ui/vnd-amount-input';

export const TRANSACTION_DEFAULTS = {
  LEDGER_LIMIT: 50,
  RECENT_DASHBOARD_LIMIT: 5,
  DEFAULT_TYPE: TRANSACTION_TYPE.EXPENSE,
  DEFAULT_FILTER_TYPE: TRANSACTION_FILTER_TYPE.ALL,
} as const;

export const TRANSACTION_TYPE_OPTIONS: ReadonlyArray<TransactionType> = [
  TRANSACTION_TYPE.EXPENSE,
  TRANSACTION_TYPE.INCOME,
  TRANSACTION_TYPE.TRANSFER,
];

export const TRANSACTION_FILTER_OPTIONS: ReadonlyArray<TransactionFilterType> =
  [
    TRANSACTION_FILTER_TYPE.ALL,
    TRANSACTION_FILTER_TYPE.EXPENSE,
    TRANSACTION_FILTER_TYPE.INCOME,
    TRANSACTION_FILTER_TYPE.TRANSFER,
  ];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.EXPENSE]: 'Chi tiêu',
  [TRANSACTION_TYPE.INCOME]: 'Thu nhập',
  [TRANSACTION_TYPE.TRANSFER]: 'Chuyển khoản',
};

export const TRANSACTION_FILTER_LABELS: Record<TransactionFilterType, string> =
  {
    [TRANSACTION_FILTER_TYPE.ALL]: 'Tất cả',
    [TRANSACTION_FILTER_TYPE.EXPENSE]:
      TRANSACTION_TYPE_LABELS[TRANSACTION_TYPE.EXPENSE],
    [TRANSACTION_FILTER_TYPE.INCOME]:
      TRANSACTION_TYPE_LABELS[TRANSACTION_TYPE.INCOME],
    [TRANSACTION_FILTER_TYPE.TRANSFER]:
      TRANSACTION_TYPE_LABELS[TRANSACTION_TYPE.TRANSFER],
  };

export const TRANSACTION_ACCOUNT_FIELD_LABELS: Record<TransactionType, string> =
  {
    [TRANSACTION_TYPE.EXPENSE]: 'Ví / Tài khoản',
    [TRANSACTION_TYPE.INCOME]: 'Ví / Tài khoản',
    [TRANSACTION_TYPE.TRANSFER]: 'Từ ví nguồn',
  };

export const TRANSACTION_CATEGORY_SECTION_LABELS: Record<
  TransactionType,
  string
> = {
  [TRANSACTION_TYPE.EXPENSE]: 'Danh mục (Chi tiêu)',
  [TRANSACTION_TYPE.INCOME]: 'Danh mục (Thu nhập)',
  [TRANSACTION_TYPE.TRANSFER]: '',
};

export const TRANSACTION_TYPE_ICONS: Record<TransactionType, LucideIcon> = {
  [TRANSACTION_TYPE.EXPENSE]: ArrowDownRight,
  [TRANSACTION_TYPE.INCOME]: ArrowUpRight,
  [TRANSACTION_TYPE.TRANSFER]: ArrowRightLeft,
};

export const TRANSACTION_SEGMENT_ACTIVE_CLASSES: Record<
  TransactionType,
  string
> = {
  [TRANSACTION_TYPE.EXPENSE]: 'bg-danger text-white shadow-xs',
  [TRANSACTION_TYPE.INCOME]: 'bg-success text-white shadow-xs',
  [TRANSACTION_TYPE.TRANSFER]: 'bg-accent text-white shadow-xs',
};

export const TRANSACTION_BADGE_CLASSES: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.EXPENSE]: 'bg-danger/10 text-danger',
  [TRANSACTION_TYPE.INCOME]: 'bg-success/10 text-success',
  [TRANSACTION_TYPE.TRANSFER]: 'bg-accent/10 text-accent',
};

export const TRANSACTION_AMOUNT_CLASSES: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.EXPENSE]: '',
  [TRANSACTION_TYPE.INCOME]: '',
  [TRANSACTION_TYPE.TRANSFER]: 'text-foreground',
};

export const TRANSACTION_MESSAGES = {
  AMOUNT_REQUIRED: 'Vui lòng nhập số tiền lớn hơn 0 ₫',
  SOURCE_ACCOUNT_REQUIRED: 'Vui lòng chọn ví / tài khoản nguồn',
  TARGET_ACCOUNT_REQUIRED: 'Vui lòng chọn ví đích để chuyển khoản',
  SAME_ACCOUNT_ERROR: 'Ví nguồn và ví đích phải khác nhau',
  INVALID_DATA: 'Dữ liệu giao dịch không hợp lệ',
  CREATE_ERROR: 'Không thể lưu giao dịch. Vui lòng thử lại.',
  FALLBACK_TITLE: 'Giao dịch',
  TRANSFER_TITLE: (sourceName = '', targetName = '') =>
    `Chuyển khoản: ${sourceName} → ${targetName}`,
  CONFIRM_DELETE: (label: string) =>
    `Xóa giao dịch "${label}"? Số dư ví liên quan sẽ được hoàn lại tự động.`,
} as const;

export const TRANSACTION_AMOUNT_PRESETS: ReadonlyArray<AmountPresetItem> = [
  { label: '+20k', value: 20000, mode: 'add' },
  { label: '+50k', value: 50000, mode: 'add' },
  { label: '+100k', value: 100000, mode: 'add' },
  { label: '+200k', value: 200000, mode: 'add' },
  { label: '+500k', value: 500000, mode: 'add' },
];
