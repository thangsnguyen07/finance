'use client';

import { Filter } from 'lucide-react';
import { Card, Field, SegmentedControl } from '@/components/ui';
import type { AccountResponse } from '@/features/accounts';
import type { TransactionType } from '../types/transaction.types';

interface TransactionFilterBarProps {
  filterType: TransactionType | 'ALL';
  onFilterTypeChange: (next: TransactionType | 'ALL') => void;
  filterAccountId: string;
  onFilterAccountChange: (next: string) => void;
  accounts: AccountResponse[];
}

const FILTER_OPTIONS = [
  { value: 'ALL' as const, label: 'Tất cả' },
  { value: 'EXPENSE' as const, label: 'Chi tiêu' },
  { value: 'INCOME' as const, label: 'Thu nhập' },
  { value: 'TRANSFER' as const, label: 'Chuyển khoản' },
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
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="mr-1 h-3.5 w-3.5 text-ink-secondary" />
          <SegmentedControl
            value={filterType}
            onChange={onFilterTypeChange}
            options={FILTER_OPTIONS}
            size="sm"
          />
        </div>

        <Field.Select
          value={filterAccountId}
          onChange={(e) => onFilterAccountChange(e.target.value)}
          className="w-auto min-w-[180px] py-1.5"
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
