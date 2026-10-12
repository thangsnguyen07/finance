'use client';

import { Pencil } from 'lucide-react';
import { Button, Card, Badge, CurrencyText } from '@/components/ui';
import { BUDGET_STATUS_CONFIG } from '../constants/budget.constants';
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
          <div className="py-10 text-center space-y-3">
            <p className="font-serif text-base font-bold text-foreground">
              Tháng này chưa có phong bì ngân sách nào
            </p>
            <p className="text-xs text-muted max-w-md mx-auto">
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
              const badge = BUDGET_STATUS_CONFIG[env.status];
              const StatusIcon = badge.icon;
              const clampedBar = Math.min(
                100,
                Math.max(0, env.usagePercentage),
              );

              return (
                <div key={env.id} className="py-4 flex flex-col gap-2.5 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm text-foreground">
                          {env.categoryName}
                        </h3>
                        <Badge
                          size="sm"
                          color={badge.color}
                          variant="soft"
                          className="flex items-center gap-1"
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                        className="w-7 h-7 min-w-7 text-muted hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden border border-border/50">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        env.status === 'EXCEEDED'
                          ? 'bg-danger'
                          : env.status === 'WARNING'
                            ? 'bg-warning'
                            : 'bg-success'
                      }`}
                      style={{ width: `${clampedBar}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted font-mono tabular-nums">
                    <span>Đã chi {env.usagePercentage}%</span>
                    <span
                      className={
                        env.remainingAmount >= 0
                          ? 'text-foreground font-medium'
                          : 'text-danger font-bold'
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
