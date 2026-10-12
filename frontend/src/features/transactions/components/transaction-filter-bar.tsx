'use client';

import { Filter } from 'lucide-react';
import { Card, Field } from '@/components/ui';
import type { AccountResponse } from '@/features/accounts';
import type { TransactionType } from '../types/transaction.types';

interface TransactionFilterBarProps {
  filterType: TransactionType | 'ALL';
  onFilterTypeChange: (next: TransactionType | 'ALL') => void;
  filterAccountId: string;
  onFilterAccountChange: (next: string) => void;
  accounts: AccountResponse[];
}

const FILTER_TABS: ReadonlyArray<{
  key: TransactionType | 'ALL';
  label: string;
}> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'EXPENSE', label: 'Chi tiêu' },
  { key: 'INCOME', label: 'Thu nhập' },
  { key: 'TRANSFER', label: 'Chuyển khoản' },
];

export function TransactionFilterBar({
  filterType,
  onFilterTypeChange,
  filterAccountId,
  onFilterAccountChange,
  accounts,
}: TransactionFilterBarProps) {
  return (
    <Card padding="sm">
      <Card.Content className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-muted mr-1" />
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterTypeChange(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                filterType === tab.key
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'bg-surface-secondary/60 text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Field.Select
          value={filterAccountId}
          onChange={(e) => onFilterAccountChange(e.target.value)}
          className="w-auto min-w-[160px] py-1.5 bg-surface-secondary/40 rounded-md"
        >
          <option value="">Tất cả các ví</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </Field.Select>
      </Card.Content>
    </Card>
  );
}
