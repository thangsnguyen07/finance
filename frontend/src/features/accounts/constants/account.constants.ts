import {
  Wallet,
  Landmark,
  CreditCard,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

import { ACCOUNT_TYPE, type AccountType } from '../types/account.types';

import type { IconBoxTone } from '@/components/ui';

export const DEFAULT_ACCOUNT_TYPE: AccountType = ACCOUNT_TYPE.BANK;

export const DEFAULT_INITIAL_BALANCE_LABEL = 'Số dư ban đầu (VND)';

export const ACCOUNT_INITIAL_BALANCE_LABEL_OVERRIDES: Partial<
  Record<AccountType, string>
> = {
  [ACCOUNT_TYPE.CREDIT_CARD]: 'Dư nợ hiện tại (VND)',
};

export const ACCOUNT_TYPE_OPTIONS: ReadonlyArray<AccountType> = [
  ACCOUNT_TYPE.CASH,
  ACCOUNT_TYPE.BANK,
  ACCOUNT_TYPE.CREDIT_CARD,
  ACCOUNT_TYPE.E_WALLET,
  ACCOUNT_TYPE.INVESTMENT,
];

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [ACCOUNT_TYPE.CASH]: 'Tiền mặt',
  [ACCOUNT_TYPE.BANK]: 'Ngân hàng',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'Thẻ tín dụng',
  [ACCOUNT_TYPE.E_WALLET]: 'Ví điện tử',
  [ACCOUNT_TYPE.INVESTMENT]: 'Đầu tư',
};

export const ACCOUNT_TYPE_ICONS: Record<AccountType, LucideIcon> = {
  [ACCOUNT_TYPE.CASH]: Wallet,
  [ACCOUNT_TYPE.BANK]: Landmark,
  [ACCOUNT_TYPE.CREDIT_CARD]: CreditCard,
  [ACCOUNT_TYPE.E_WALLET]: Smartphone,
  [ACCOUNT_TYPE.INVESTMENT]: TrendingUp,
};

export const ACCOUNT_TYPE_TONES: Record<AccountType, IconBoxTone> = {
  [ACCOUNT_TYPE.CASH]: 'amber',
  [ACCOUNT_TYPE.BANK]: 'blue',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'rose',
  [ACCOUNT_TYPE.E_WALLET]: 'purple',
  [ACCOUNT_TYPE.INVESTMENT]: 'emerald',
};

export type AccountGroupVariant = 'asset' | 'credit';

export const ACCOUNT_MESSAGES = {
  LOAD_ERROR: 'Lỗi tải danh sách tài khoản',
  NAME_REQUIRED: 'Vui lòng nhập tên tài khoản / ví',
  INVALID_DATA: 'Dữ liệu không hợp lệ',
  CREATE_ERROR: 'Đã có lỗi xảy ra khi tạo tài khoản',
  CONFIRM_ARCHIVE: (name: string) =>
    `Bạn có chắc chắn muốn lưu trữ ví "${name}" không?`,
} as const;
