'use client';

import { Archive } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CurrencyText,
  Grid,
  ListItem,
  Stack,
  Text,
} from '@/components/ui';

import {
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_TONES,
  type AccountGroupVariant,
} from '../constants/account.constants';

import type { AccountResponse } from '../types/account.types';

interface AccountGroupSectionProps {
  title: string;
  accounts: AccountResponse[];
  onArchive: (id: string, name: string) => void;
  variant?: AccountGroupVariant;
}

export function AccountGroupSection({
  title,
  accounts,
  onArchive,
  variant = 'asset',
}: AccountGroupSectionProps) {
  if (accounts.length === 0) return null;

  const isCredit = variant === 'credit';

  return (
    <Stack as="section" gap="md">
      <Text as="h3" variant="eyebrow">
        {title} ({accounts.length})
      </Text>

      <Grid cols={2} gap="md">
        {accounts.map((account) => {
          const Icon = ACCOUNT_TYPE_ICONS[account.type];
          const tone = ACCOUNT_TYPE_TONES[account.type];
          const typeLabel = ACCOUNT_TYPE_LABELS[account.type];
          const balance = account.currentBalance || 0;
          const creditLimit = account.creditLimit || 0;
          const remainingLimit = creditLimit - balance;

          return (
            <Card
              key={account.id}
              variant="flush"
              className="transition-all hover:border-border/80"
            >
              <ListItem
                icon={Icon}
                iconTone={tone}
                iconShape="rounded"
                iconSize="lg"
                title={account.name}
                subtitle={typeLabel}
                badge={
                  account.statementDay ? (
                    <Badge
                      size="sm"
                      variant="secondary"
                      mono
                      className="h-4 px-1.5"
                    >
                      Sao kê: ngày {account.statementDay}
                    </Badge>
                  ) : null
                }
                trailing={
                  <CurrencyText
                    amount={balance}
                    type={isCredit ? 'EXPENSE' : undefined}
                    signed={isCredit && balance > 0}
                    className="text-sm font-bold"
                  />
                }
                trailingSubtitle={
                  isCredit && creditLimit > 0 ? (
                    <Text as="span" variant="mono" tone="muted">
                      Còn hạn mức: <CurrencyText amount={remainingLimit} />
                    </Text>
                  ) : null
                }
                action={
                  <Button
                    isIconOnly
                    size="sm"
                    tone="ghost"
                    aria-label={`Lưu trữ ví ${account.name}`}
                    onPress={() => onArchive(account.id, account.name)}
                    className="h-8 w-8 min-w-8 text-muted hover:text-danger"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                }
              />
            </Card>
          );
        })}
      </Grid>
    </Stack>
  );
}
