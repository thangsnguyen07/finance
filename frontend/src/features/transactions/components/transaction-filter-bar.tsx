'use client';

import { Filter } from 'lucide-react';

import { Card, Field } from '@/components/ui';

import {
  TRANSACTION_FILTER_LABELS,
  TRANSACTION_FILTER_OPTIONS,
} from '../constants/transaction.constants';

import type { TransactionFilterType } from '../types/transaction.types';
import type { AccountResponse } from '@/features/accounts';

interface TransactionFilterBarProps {
  filterType: TransactionFilterType;
  onFilterTypeChange: (next: TransactionFilterType) => void;
  filterAccountId: string;
  onFilterAccountChange: (next: string) => void;
  accounts: AccountResponse[];
}

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
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="mr-1 h-3.5 w-3.5 text-muted" />
          {TRANSACTION_FILTER_OPTIONS.map((filterOption) => (
            <button
              key={filterOption}
              type="button"
              onClick={() => onFilterTypeChange(filterOption)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === filterOption
                  ? 'bg-accent font-semibold text-accent-foreground'
                  : 'bg-surface-secondary/60 text-muted hover:text-foreground'
              }`}
            >
              {TRANSACTION_FILTER_LABELS[filterOption]}
            </button>
          ))}
        </div>

        <Field.Select
          value={filterAccountId}
          onChange={(e) => onFilterAccountChange(e.target.value)}
          className="w-auto min-w-[160px] rounded-md bg-surface-secondary/40 py-1.5"
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
