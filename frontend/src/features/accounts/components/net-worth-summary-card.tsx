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
      <Card.Header
        bordered
        className="justify-start gap-2 pb-3 mb-4 border-border/60"
      >
        <Scale className="w-4 h-4 text-accent" />
        <Card.Eyebrow className="text-xs font-semibold">
          Tài sản ròng (Net Worth)
        </Card.Eyebrow>
      </Card.Header>

      <Card.Content className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-muted">Tổng giá trị ròng</span>
          <p className="mt-1">
            <CurrencyText
              amount={netWorth}
              className={`font-serif text-2xl font-bold ${
                netWorth >= 0 ? 'text-foreground' : 'text-danger'
              }`}
            />
          </p>
        </div>

        <div className="sm:border-l sm:border-border/60 sm:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-success">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Tổng tài sản khả dụng</span>
          </div>
          <p className="mt-1">
            <CurrencyText
              amount={totalAssets}
              className="text-lg font-semibold text-foreground"
            />
          </p>
          <span className="text-[11px] text-muted">
            {assetCount} nguồn tiền
          </span>
        </div>

        <div className="sm:border-l sm:border-border/60 sm:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-danger">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Tổng dư nợ thẻ</span>
          </div>
          <p className="mt-1">
            <CurrencyText
              amount={totalDebt}
              type="EXPENSE"
              className="text-lg font-semibold"
            />
          </p>
          <span className="text-[11px] text-muted">
            {creditCardCount} thẻ tín dụng
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
