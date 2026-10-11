import { AlertTriangle, CheckCircle2, Flame } from 'lucide-react';
import type { AmountPresetItem } from '@/components/ui/vnd-amount-input';
import type { BudgetStatus } from '../types/budget.types';

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
  SAFE: {
    label: 'Trong tầm kiểm soát',
    color: 'success',
    icon: CheckCircle2,
  },
  WARNING: {
    label: 'Sắp chạm trần',
    color: 'warning',
    icon: AlertTriangle,
  },
  EXCEEDED: {
    label: 'Vượt kế hoạch',
    color: 'danger',
    icon: Flame,
  },
};
