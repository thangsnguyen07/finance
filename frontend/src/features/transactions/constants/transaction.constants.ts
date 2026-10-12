import { ArrowDownRight, ArrowUpRight, ArrowRightLeft } from 'lucide-react';

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

export const TRANSACTION_TYPE_UI_CONFIG: Record<
  TransactionType,
  {
    label: string;
    icon: typeof ArrowDownRight;
    activeSegmentClass: string;
    badgeClass: string;
    accountFieldLabel: string;
    categorySectionLabel: string;
    amountClassName: string;
  }
> = {
  [TRANSACTION_TYPE.EXPENSE]: {
    label: 'Chi tiêu',
    icon: ArrowDownRight,
    activeSegmentClass: 'bg-danger text-white shadow-xs',
    badgeClass: 'bg-danger/10 text-danger',
    accountFieldLabel: 'Ví / Tài khoản',
    categorySectionLabel: 'Danh mục (Chi tiêu)',
    amountClassName: '',
  },
  [TRANSACTION_TYPE.INCOME]: {
    label: 'Thu nhập',
    icon: ArrowUpRight,
    activeSegmentClass: 'bg-success text-white shadow-xs',
    badgeClass: 'bg-success/10 text-success',
    accountFieldLabel: 'Ví / Tài khoản',
    categorySectionLabel: 'Danh mục (Thu nhập)',
    amountClassName: '',
  },
  [TRANSACTION_TYPE.TRANSFER]: {
    label: 'Chuyển khoản',
    icon: ArrowRightLeft,
    activeSegmentClass: 'bg-accent text-white shadow-xs',
    badgeClass: 'bg-accent/10 text-accent',
    accountFieldLabel: 'Từ ví nguồn',
    categorySectionLabel: '',
    amountClassName: 'text-foreground',
  },
};

export const TRANSACTION_TYPE_OPTIONS: ReadonlyArray<TransactionType> = [
  TRANSACTION_TYPE.EXPENSE,
  TRANSACTION_TYPE.INCOME,
  TRANSACTION_TYPE.TRANSFER,
];

export const TRANSACTION_FILTER_TABS: ReadonlyArray<{
  key: TransactionFilterType;
  label: string;
}> = [
  { key: TRANSACTION_FILTER_TYPE.ALL, label: 'Tất cả' },
  {
    key: TRANSACTION_FILTER_TYPE.EXPENSE,
    label: TRANSACTION_TYPE_UI_CONFIG[TRANSACTION_TYPE.EXPENSE].label,
  },
  {
    key: TRANSACTION_FILTER_TYPE.INCOME,
    label: TRANSACTION_TYPE_UI_CONFIG[TRANSACTION_TYPE.INCOME].label,
  },
  {
    key: TRANSACTION_FILTER_TYPE.TRANSFER,
    label: TRANSACTION_TYPE_UI_CONFIG[TRANSACTION_TYPE.TRANSFER].label,
  },
];

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
