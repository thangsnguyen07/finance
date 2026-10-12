'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

import {
  Badge,
  Card,
  CurrencyText,
  Grid,
  StatCard,
  Stack,
  Text,
} from '@/components/ui';
import { formatMonthDisplay } from '@/lib/formatters';

function SurplusSavingsBadge({ rate }: { rate: number }) {
  return (
    <Badge
      size="sm"
      color="success"
      variant="soft"
      mono
      className="text-xs font-semibold"
    >
      Giữ lại được {rate}% thu nhập
    </Badge>
  );
}

function DeficitSavingsBadge() {
  return (
    <Badge
      size="sm"
      color="danger"
      variant="soft"
      mono
      className="text-xs font-semibold"
    >
      Chi vượt thu trong kỳ
    </Badge>
  );
}

interface CashflowBalanceCardProps {
  selectedMonth: string;
  monthNet: number;
  monthIncome: number;
  monthExpense: number;
  savingsRate: number;
  incomeGroupCount: number;
  expenseGroupCount: number;
}

export function CashflowBalanceCard({
  selectedMonth,
  monthNet,
  monthIncome,
  monthExpense,
  savingsRate,
  incomeGroupCount,
  expenseGroupCount,
}: CashflowBalanceCardProps) {
  return (
    <Card>
      <Card.Header
        bordered
        className="flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <Stack gap="xs">
          <Text variant="caption" tone="muted">
            Thặng dư / Thâm hụt ròng • {formatMonthDisplay(selectedMonth)}
          </Text>
          <Card.Title className="font-serif text-2xl font-black sm:text-3xl">
            <CurrencyText
              amount={Math.abs(monthNet)}
              type={monthNet >= 0 ? 'INCOME' : 'EXPENSE'}
              signed={monthNet !== 0}
              className={monthNet >= 0 ? 'text-foreground' : 'text-danger'}
            />
          </Card.Title>
        </Stack>

        {monthIncome > 0 ? (
          monthNet >= 0 ? (
            <SurplusSavingsBadge rate={savingsRate} />
          ) : (
            <DeficitSavingsBadge />
          )
        ) : null}
      </Card.Header>

      <Grid cols={2} gap="lg">
        <StatCard
          variant="inset"
          icon={ArrowUpRight}
          iconTone="success"
          label="Tổng dòng thu"
          sublabel={`${incomeGroupCount} nhóm nguồn thu`}
          amount={monthIncome}
          amountType="INCOME"
          signed
        />

        <StatCard
          variant="inset"
          icon={ArrowDownRight}
          iconTone="danger"
          label="Tổng dòng chi"
          sublabel={`${expenseGroupCount} nhóm chi tiêu`}
          amount={monthExpense}
          amountType="EXPENSE"
          signed
        />
      </Grid>
    </Card>
  );
}
