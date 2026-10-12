export const REPORT_DEFAULTS = {
  TRANSACTIONS_FETCH_LIMIT: 100,
  DEFAULT_EXPENSE_COLOR: '#991B1B',
  DEFAULT_INCOME_COLOR: '#166534',
} as const;

export const REPORT_FALLBACK_CATEGORIES = {
  UNCATEGORIZED_EXPENSE_ID: 'uncategorized-expense',
  UNCATEGORIZED_EXPENSE_LABEL: 'Chưa phân loại',
  UNCATEGORIZED_INCOME_ID: 'uncategorized-income',
  UNCATEGORIZED_INCOME_LABEL: 'Thu nhập khác',
} as const;

export const EXPENSE_PALETTE = [
  '#991B1B',
  '#B45309',
  '#1E3A8A',
  '#7C2D12',
  '#4338CA',
  '#BE123C',
  '#6E665E',
] as const;

export const INCOME_PALETTE = [
  '#166534',
  '#15803D',
  '#047857',
  '#0F766E',
  '#1E3A8A',
] as const;
