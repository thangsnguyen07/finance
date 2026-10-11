import {
  Wallet,
  Landmark,
  CreditCard,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import type { AccountType } from '../types/account.types';

export const ACCOUNT_TYPE_CONFIG: Record<
  AccountType,
  { label: string; icon: typeof Wallet; colorClass: string }
> = {
  CASH: {
    label: 'Tiền mặt',
    icon: Wallet,
    colorClass: 'text-amber-700 bg-amber-500/10 border-amber-600/20',
  },
  BANK: {
    label: 'Ngân hàng',
    icon: Landmark,
    colorClass: 'text-blue-700 bg-blue-500/10 border-blue-600/20',
  },
  CREDIT_CARD: {
    label: 'Thẻ tín dụng',
    icon: CreditCard,
    colorClass: 'text-rose-700 bg-rose-500/10 border-rose-600/20',
  },
  E_WALLET: {
    label: 'Ví điện tử',
    icon: Smartphone,
    colorClass: 'text-purple-700 bg-purple-500/10 border-purple-600/20',
  },
  INVESTMENT: {
    label: 'Đầu tư',
    icon: TrendingUp,
    colorClass: 'text-emerald-700 bg-emerald-500/10 border-emerald-600/20',
  },
};

export const ACCOUNT_TYPE_OPTIONS: ReadonlyArray<{
  type: AccountType;
  label: string;
  icon: typeof Wallet;
}> = [
  { type: 'CASH', label: 'Tiền mặt', icon: Wallet },
  { type: 'BANK', label: 'Ngân hàng', icon: Landmark },
  { type: 'CREDIT_CARD', label: 'Thẻ tín dụng', icon: CreditCard },
  { type: 'E_WALLET', label: 'Ví điện tử', icon: Smartphone },
  { type: 'INVESTMENT', label: 'Đầu tư', icon: TrendingUp },
];
