import {
  Wallet,
  Landmark,
  CreditCard,
  Smartphone,
  TrendingUp,
} from 'lucide-react';

import { ACCOUNT_TYPE, type AccountType } from '../types/account.types';

export const DEFAULT_ACCOUNT_TYPE: AccountType = ACCOUNT_TYPE.BANK;

export const ACCOUNT_MESSAGES = {
  LOAD_ERROR: 'Lỗi tải danh sách tài khoản',
  NAME_REQUIRED: 'Vui lòng nhập tên tài khoản / ví',
  INVALID_DATA: 'Dữ liệu không hợp lệ',
  CREATE_ERROR: 'Đã có lỗi xảy ra khi tạo tài khoản',
  CONFIRM_ARCHIVE: (name: string) =>
    `Bạn có chắc chắn muốn lưu trữ ví "${name}" không?`,
} as const;

export const ACCOUNT_TYPE_CONFIG: Record<
  AccountType,
  {
    label: string;
    icon: typeof Wallet;
    colorClass: string;
    initialBalanceLabel: string;
    pocketIconClass: string;
    pocketLabelClass: string;
  }
> = {
  [ACCOUNT_TYPE.CASH]: {
    label: 'Tiền mặt',
    icon: Wallet,
    colorClass: 'text-amber-700 bg-amber-500/10 border-amber-600/20',
    initialBalanceLabel: 'Số dư ban đầu (VND)',
    pocketIconClass: 'text-emerald-600',
    pocketLabelClass: '',
  },
  [ACCOUNT_TYPE.BANK]: {
    label: 'Ngân hàng',
    icon: Landmark,
    colorClass: 'text-blue-700 bg-blue-500/10 border-blue-600/20',
    initialBalanceLabel: 'Số dư ban đầu (VND)',
    pocketIconClass: 'text-accent',
    pocketLabelClass: '',
  },
  [ACCOUNT_TYPE.CREDIT_CARD]: {
    label: 'Thẻ tín dụng',
    icon: CreditCard,
    colorClass: 'text-rose-700 bg-rose-500/10 border-rose-600/20',
    initialBalanceLabel: 'Dư nợ hiện tại (VND)',
    pocketIconClass: 'text-danger',
    pocketLabelClass: 'font-bold text-danger',
  },
  [ACCOUNT_TYPE.E_WALLET]: {
    label: 'Ví điện tử',
    icon: Smartphone,
    colorClass: 'text-purple-700 bg-purple-500/10 border-purple-600/20',
    initialBalanceLabel: 'Số dư ban đầu (VND)',
    pocketIconClass: 'text-accent',
    pocketLabelClass: '',
  },
  [ACCOUNT_TYPE.INVESTMENT]: {
    label: 'Đầu tư',
    icon: TrendingUp,
    colorClass: 'text-emerald-700 bg-emerald-500/10 border-emerald-600/20',
    initialBalanceLabel: 'Số dư ban đầu (VND)',
    pocketIconClass: 'text-emerald-600',
    pocketLabelClass: '',
  },
};

export const ACCOUNT_GROUP_VARIANT_CONFIG: Record<
  'asset' | 'credit',
  {
    amountType: 'EXPENSE' | undefined;
    amountClassName: string;
    showCreditLimit: boolean;
  }
> = {
  asset: {
    amountType: undefined,
    amountClassName: 'text-sm font-bold text-foreground',
    showCreditLimit: false,
  },
  credit: {
    amountType: 'EXPENSE',
    amountClassName: 'text-sm font-bold text-danger',
    showCreditLimit: true,
  },
};

export const ACCOUNT_TYPE_OPTIONS: ReadonlyArray<{
  type: AccountType;
  label: string;
  icon: typeof Wallet;
}> = [
  { type: ACCOUNT_TYPE.CASH, label: 'Tiền mặt', icon: Wallet },
  { type: ACCOUNT_TYPE.BANK, label: 'Ngân hàng', icon: Landmark },
  { type: ACCOUNT_TYPE.CREDIT_CARD, label: 'Thẻ tín dụng', icon: CreditCard },
  { type: ACCOUNT_TYPE.E_WALLET, label: 'Ví điện tử', icon: Smartphone },
  { type: ACCOUNT_TYPE.INVESTMENT, label: 'Đầu tư', icon: TrendingUp },
];
