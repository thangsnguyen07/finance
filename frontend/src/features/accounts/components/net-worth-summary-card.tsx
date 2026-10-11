'use client';

import { Scale, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CurrencyText } from '@/components/ui';

interface NetWorthSummaryCardProps {
  netWorth: number;
  totalAssets: number;
  assetCount: number;
  totalDebt: number;
  creditCardCount: number;
}

export function NetWorthSummaryCard({
  netWorth,
  totalAssets,
  assetCount,
  totalDebt,
  creditCardCount,
}: NetWorthSummaryCardProps) {
  return (
    <Card>
      <Card.Header bordered className="flex-row items-center justify-start gap-2">
        <Scale className="h-4 w-4 text-accent-coral" />
        <Card.Eyebrow>Tài sản ròng (Net Worth)</Card.Eyebrow>
      </Card.Header>

      <Card.Content className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <span className="text-xs text-ink-secondary">Tổng giá trị ròng</span>
          <p className="mt-1">
            <CurrencyText
              amount={netWorth}
              className={`font-serif text-2xl font-bold ${
                netWorth >= 0 ? 'text-ink-primary' : 'text-accent-coral'
              }`}
            />
          </p>
        </div>

        <div className="sm:border-l sm:border-ledger-border/60 sm:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-accent-teal">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Tổng tài sản khả dụng</span>
          </div>
          <p className="mt-1">
            <CurrencyText
              amount={totalAssets}
              className="text-lg font-semibold text-ink-primary"
            />
          </p>
          <span className="text-[11px] text-ink-secondary">
            {assetCount} nguồn tiền
          </span>
        </div>

        <div className="sm:border-l sm:border-ledger-border/60 sm:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-accent-coral">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>Tổng dư nợ thẻ</span>
          </div>
          <p className="mt-1">
            <CurrencyText
              amount={totalDebt}
              type="EXPENSE"
              className="text-lg font-semibold"
            />
          </p>
          <span className="text-[11px] text-ink-secondary">
            {creditCardCount} thẻ tín dụng
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
