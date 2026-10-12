import {
  Wallet,
  Landmark,
  CreditCard,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

import { ACCOUNT_TYPE, type AccountType } from '../types/account.types';

export const DEFAULT_ACCOUNT_TYPE: AccountType = ACCOUNT_TYPE.BANK;

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

export const ACCOUNT_INITIAL_BALANCE_LABELS: Record<AccountType, string> = {
  [ACCOUNT_TYPE.CASH]: 'Số dư ban đầu (VND)',
  [ACCOUNT_TYPE.BANK]: 'Số dư ban đầu (VND)',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'Dư nợ hiện tại (VND)',
  [ACCOUNT_TYPE.E_WALLET]: 'Số dư ban đầu (VND)',
  [ACCOUNT_TYPE.INVESTMENT]: 'Số dư ban đầu (VND)',
};

export const ACCOUNT_TYPE_ICONS: Record<AccountType, LucideIcon> = {
  [ACCOUNT_TYPE.CASH]: Wallet,
  [ACCOUNT_TYPE.BANK]: Landmark,
  [ACCOUNT_TYPE.CREDIT_CARD]: CreditCard,
  [ACCOUNT_TYPE.E_WALLET]: Smartphone,
  [ACCOUNT_TYPE.INVESTMENT]: TrendingUp,
};

export const ACCOUNT_TYPE_BADGE_CLASSES: Record<AccountType, string> = {
  [ACCOUNT_TYPE.CASH]: 'text-amber-700 bg-amber-500/10 border-amber-600/20',
  [ACCOUNT_TYPE.BANK]: 'text-blue-700 bg-blue-500/10 border-blue-600/20',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'text-rose-700 bg-rose-500/10 border-rose-600/20',
  [ACCOUNT_TYPE.E_WALLET]:
    'text-purple-700 bg-purple-500/10 border-purple-600/20',
  [ACCOUNT_TYPE.INVESTMENT]:
    'text-emerald-700 bg-emerald-500/10 border-emerald-600/20',
};

export const ACCOUNT_POCKET_ICON_CLASSES: Record<AccountType, string> = {
  [ACCOUNT_TYPE.CASH]: 'text-emerald-600',
  [ACCOUNT_TYPE.BANK]: 'text-accent',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'text-danger',
  [ACCOUNT_TYPE.E_WALLET]: 'text-accent',
  [ACCOUNT_TYPE.INVESTMENT]: 'text-emerald-600',
};

export const ACCOUNT_POCKET_LABEL_CLASSES: Record<AccountType, string> = {
  [ACCOUNT_TYPE.CASH]: '',
  [ACCOUNT_TYPE.BANK]: '',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'font-bold text-danger',
  [ACCOUNT_TYPE.E_WALLET]: '',
  [ACCOUNT_TYPE.INVESTMENT]: '',
};

export type AccountGroupVariant = 'asset' | 'credit';

export const ACCOUNT_GROUP_AMOUNT_TYPES: Record<
  AccountGroupVariant,
  'EXPENSE' | undefined
> = {
  asset: undefined,
  credit: 'EXPENSE',
};

export const ACCOUNT_GROUP_AMOUNT_CLASSES: Record<AccountGroupVariant, string> =
  {
    asset: 'text-sm font-bold text-foreground',
    credit: 'text-sm font-bold text-danger',
  };

export const ACCOUNT_GROUP_SHOW_CREDIT_LIMIT: Record<
  AccountGroupVariant,
  boolean
> = {
  asset: false,
  credit: true,
};

export const ACCOUNT_MESSAGES = {
  LOAD_ERROR: 'Lỗi tải danh sách tài khoản',
  NAME_REQUIRED: 'Vui lòng nhập tên tài khoản / ví',
  INVALID_DATA: 'Dữ liệu không hợp lệ',
  CREATE_ERROR: 'Đã có lỗi xảy ra khi tạo tài khoản',
  CONFIRM_ARCHIVE: (name: string) =>
    `Bạn có chắc chắn muốn lưu trữ ví "${name}" không?`,
} as const;
