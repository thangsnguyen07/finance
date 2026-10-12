'use client';

import { Scale, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import {
  Card,
  CurrencyText,
  Grid,
  Row,
  StatCard,
  Stack,
  Text,
} from '@/components/ui';

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
      <Row gap="sm" className="mb-4 border-b border-border/60 pb-3">
        <Scale className="h-4 w-4 text-accent" />
        <Text variant="eyebrow" weight="semibold">
          Tài sản ròng (Net Worth)
        </Text>
      </Row>

      <Grid cols={3} gap="lg">
        <Stack gap="xs">
          <Text variant="caption" tone="muted">
            Tổng giá trị ròng
          </Text>
          <CurrencyText
            amount={netWorth}
            className={`font-serif text-2xl font-bold ${
              netWorth >= 0 ? 'text-foreground' : 'text-danger'
            }`}
          />
        </Stack>

        <StatCard
          variant="inset"
          icon={ArrowUpRight}
          iconTone="success"
          label="Tổng tài sản khả dụng"
          amount={totalAssets}
          sublabel={`${assetCount} nguồn tiền`}
        />

        <StatCard
          variant="inset"
          icon={ArrowDownRight}
          iconTone="danger"
          label="Tổng dư nợ thẻ"
          amount={totalDebt}
          amountType="EXPENSE"
          sublabel={`${creditCardCount} thẻ tín dụng`}
        />
      </Grid>
    </Card>
  );
}
