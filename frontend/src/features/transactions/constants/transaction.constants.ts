import {
  TRANSACTION_FILTER_TYPE,
  TRANSACTION_TYPE,
} from '../types/transaction.types';

import type { AmountPresetItem } from '@/components/ui/vnd-amount-input';

export const TRANSACTION_DEFAULTS = {
  LEDGER_LIMIT: 50,
  RECENT_DASHBOARD_LIMIT: 5,
  DEFAULT_TYPE: TRANSACTION_TYPE.EXPENSE,
  DEFAULT_FILTER_TYPE: TRANSACTION_FILTER_TYPE.ALL,
} as const;

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
