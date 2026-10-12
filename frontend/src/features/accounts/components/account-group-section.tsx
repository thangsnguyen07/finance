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
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
        {title} ({accounts.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              className="hover:border-border/80 transition-all"
            >
              <Card.Content className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${config.colorClass}`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {account.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
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

                <div className="flex items-center gap-2 text-right shrink-0">
                  <div>
                    <p>
                      <CurrencyText
                        amount={balance}
                        type={isCredit ? 'EXPENSE' : undefined}
                        signed={isCredit && balance > 0}
                        className={`font-bold text-sm ${
                          isCredit ? 'text-danger' : 'text-foreground'
                        }`}
                      />
                    </p>
                    {isCredit && creditLimit > 0 ? (
                      <p className="text-[10px] text-muted font-mono mt-0.5 tabular-nums">
                        Còn hạn mức:{' '}
                        <CurrencyText amount={remainingLimit} />
                      </p>
                    ) : null}
                  </div>

                  <Button
                    isIconOnly
                    size="sm"
                    tone="ghost"
                    aria-label={`Lưu trữ ví ${account.name}`}
                    onPress={() => onArchive(account.id, account.name)}
                    className="w-8 h-8 min-w-8 text-muted hover:text-danger"
                  >
                    <Archive className="w-4 h-4" />
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
