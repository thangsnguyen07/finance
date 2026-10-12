'use client';

import { Filter } from 'lucide-react';

import { Card, ChoiceGroup, Field, Row } from '@/components/ui';

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
  const filterItems = TRANSACTION_FILTER_OPTIONS.map((filterOption) => ({
    value: filterOption,
    label: TRANSACTION_FILTER_LABELS[filterOption],
  }));

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.name,
  }));

  return (
    <Card padding="sm">
      <Row justify="between" wrap gap="md">
        <Row wrap gap="xs">
          <Filter className="mr-1 h-3.5 w-3.5 text-muted" />
          <ChoiceGroup
            variant="pill"
            value={filterType}
            onChange={onFilterTypeChange}
            items={filterItems}
          />
        </Row>

        <Field.Select
          value={filterAccountId}
          onChange={(e) => onFilterAccountChange(e.target.value)}
          placeholderOption="Tất cả các ví"
          options={accountOptions}
          className="w-auto min-w-[160px] rounded-md bg-surface-secondary/40 py-1.5"
        />
      </Row>
    </Card>
  );
}
