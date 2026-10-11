'use client';

import { Card } from '@heroui/react';
import { Scale, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatVND } from '@/lib/formatters';

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
    <Card className="bg-surface border border-border rounded-xl p-5 shadow-xs">
      <Card.Header className="p-0 pb-3 mb-4 border-b border-border/60 flex items-center gap-2">
        <Scale className="w-4 h-4 text-accent" />
        <Card.Title className="text-xs font-semibold text-muted uppercase tracking-wider">
          Tài sản ròng (Net Worth)
        </Card.Title>
      </Card.Header>

      <Card.Content className="p-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-muted">Tổng giá trị ròng</span>
          <p
            className={`font-serif text-2xl font-bold mt-1 tracking-tight tabular-nums ${
              netWorth >= 0 ? 'text-foreground' : 'text-danger'
            }`}
          >
            {formatVND(netWorth)}
          </p>
        </div>

        <div className="sm:border-l sm:border-border/60 sm:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-success">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Tổng tài sản khả dụng</span>
          </div>
          <p className="font-mono text-lg font-semibold text-foreground mt-1 tabular-nums">
            {formatVND(totalAssets)}
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
          <p className="font-mono text-lg font-semibold text-danger mt-1 tabular-nums">
            {formatVND(totalDebt)}
          </p>
          <span className="text-[11px] text-muted">
            {creditCardCount} thẻ tín dụng
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}
