'use client';

import { Archive } from 'lucide-react';

import { Button, Card, Badge, CurrencyText } from '@/components/ui';

import { ACCOUNT_TYPE_CONFIG } from '../constants/account.constants';

import type { AccountResponse } from '../types/account.types';

interface AccountGroupSectionProps {
  title: string;
  accounts: AccountResponse[];
  onArchive: (id: string, name: string) => void;
  variant?: 'asset' | 'credit';
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
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">
        {title} ({accounts.length})
      </h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {accounts.map((account) => {
          const config = ACCOUNT_TYPE_CONFIG[account.type];
          const Icon = config.icon;
          const balance = account.currentBalance || 0;
          const creditLimit = account.creditLimit || 0;
          const remainingLimit = creditLimit - balance;

          return (
            <Card
              key={account.id}
              variant="compact"
              className="transition-all hover:border-border/80"
            >
              <Card.Content className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${config.colorClass}`}
                  >
                    <Icon className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-foreground">
                      {account.name}
                    </h4>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-muted">
                        {config.label}
                      </span>
                      {account.statementDay ? (
                        <Badge
                          size="sm"
                          variant="secondary"
                          mono
                          className="h-4 px-1.5"
                        >
                          Sao kê: ngày {account.statementDay}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-right">
                  <div>
                    <p>
                      <CurrencyText
                        amount={balance}
                        type={isCredit ? 'EXPENSE' : undefined}
                        signed={isCredit && balance > 0}
                        className={`text-sm font-bold ${
                          isCredit ? 'text-danger' : 'text-foreground'
                        }`}
                      />
                    </p>
                    {isCredit && creditLimit > 0 ? (
                      <p className="mt-0.5 font-mono text-[10px] text-muted tabular-nums">
                        Còn hạn mức: <CurrencyText amount={remainingLimit} />
                      </p>
                    ) : null}
                  </div>

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
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
