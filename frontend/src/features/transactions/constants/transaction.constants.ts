import type { AmountPresetItem } from '@/components/ui/vnd-amount-input';

export const TRANSACTION_AMOUNT_PRESETS: ReadonlyArray<AmountPresetItem> = [
  { label: '+20k', value: 20000, mode: 'add' },
  { label: '+50k', value: 50000, mode: 'add' },
  { label: '+100k', value: 100000, mode: 'add' },
  { label: '+200k', value: 200000, mode: 'add' },
  { label: '+500k', value: 500000, mode: 'add' },
];
