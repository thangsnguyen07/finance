'use client';

import { Pencil } from 'lucide-react';

import { Button, Card, Badge, CurrencyText } from '@/components/ui';

import {
  BUDGET_STATUS_BADGE_COLORS,
  BUDGET_STATUS_BAR_CLASSES,
  BUDGET_STATUS_ICONS,
  BUDGET_STATUS_LABELS,
} from '../constants/budget.constants';

import type { BudgetEnvelopeResponse } from '../types/budget.types';

interface BudgetEnvelopeListProps {
  envelopes: BudgetEnvelopeResponse[];
  onOpenCreate: () => void;
  onOpenEdit: (envelope: BudgetEnvelopeResponse) => void;
}

export function BudgetEnvelopeList({
  envelopes,
  onOpenCreate,
  onOpenEdit,
}: BudgetEnvelopeListProps) {
  return (
    <Card>
      <Card.Header bordered className="mb-0 pb-3">
        <div>
          <Card.Title>Phong bì đã đặt hạn mức ({envelopes.length})</Card.Title>
          <Card.Description>
            Sắp xếp tự động theo mức độ sử dụng từ cao xuống thấp
          </Card.Description>
        </div>
      </Card.Header>

      <Card.Content>
        {envelopes.length === 0 ? (
          <div className="space-y-3 py-10 text-center">
            <p className="font-serif text-base font-bold text-foreground">
              Tháng này chưa có phong bì ngân sách nào
            </p>
            <p className="mx-auto max-w-md text-xs text-muted">
              Đặt hạn mức cho các danh mục chi tiêu lớn như Ăn uống, Tiền nhà
              hoặc Di chuyển để thước đo K3 theo dõi tự động mỗi khi bạn ghi sổ.
            </p>
            <Button tone="primary" size="sm" onPress={onOpenCreate}>
              Đặt hạn mức đầu tiên
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {envelopes.map((env) => {
              const StatusIcon = BUDGET_STATUS_ICONS[env.status];
              const statusLabel = BUDGET_STATUS_LABELS[env.status];
              const badgeColor = BUDGET_STATUS_BADGE_COLORS[env.status];
              const barColorClass = BUDGET_STATUS_BAR_CLASSES[env.status];
              const clampedBar = Math.min(
                100,
                Math.max(0, env.usagePercentage),
              );

              return (
                <div key={env.id} className="group flex flex-col gap-2.5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {env.categoryName}
                        </h3>
                        <Badge
                          size="sm"
                          color={badgeColor}
                          variant="soft"
                          className="flex items-center gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusLabel}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right font-mono tabular-nums">
                        <CurrencyText
                          amount={env.spentAmount}
                          className="text-sm font-bold text-foreground"
                        />
                        <span className="text-xs text-muted">
                          {' '}
                          / <CurrencyText amount={env.budgetAmount} />
                        </span>
                      </div>

                      <Button
                        isIconOnly
                        size="sm"
                        tone="ghost"
                        onPress={() => onOpenEdit(env)}
                        aria-label={`Điều chỉnh hạn mức ${env.categoryName}`}
                        className="h-7 w-7 min-w-7 text-muted hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full border border-border/50 bg-surface-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColorClass}`}
                      style={{ width: `${clampedBar}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs text-muted tabular-nums">
                    <span>Đã chi {env.usagePercentage}%</span>
                    <span
                      className={
                        env.remainingAmount >= 0
                          ? 'font-medium text-foreground'
                          : 'font-bold text-danger'
                      }
                    >
                      {env.remainingAmount >= 0 ? (
                        <>
                          Còn được chi{' '}
                          <CurrencyText amount={env.remainingAmount} />
                        </>
                      ) : (
                        <>
                          Vượt hạn mức{' '}
                          <CurrencyText
                            amount={Math.abs(env.remainingAmount)}
                          />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
