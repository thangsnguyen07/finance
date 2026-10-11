'use client';

import { Button, Card, Chip } from '@heroui/react';
import { Pencil } from 'lucide-react';
import { formatVND } from '@/lib/formatters';
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
    <Card className="bg-surface border border-border rounded-xl p-5 shadow-xs">
      <Card.Header className="p-0 pb-3 border-b border-border flex items-center justify-between">
        <div>
          <Card.Title className="font-serif font-bold text-base text-foreground">
            Phong bì đã đặt hạn mức ({envelopes.length})
          </Card.Title>
          <Card.Description className="text-xs text-muted mt-0.5">
            Sắp xếp tự động theo mức độ sử dụng từ cao xuống thấp
          </Card.Description>
        </div>
      </Card.Header>

      <Card.Content className="p-0">
        {envelopes.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="font-serif text-base font-bold text-foreground">
              Tháng này chưa có phong bì ngân sách nào
            </p>
            <p className="text-xs text-muted max-w-md mx-auto">
              Đặt hạn mức cho các danh mục chi tiêu lớn như Ăn uống, Tiền nhà
              hoặc Di chuyển để thước đo K3 theo dõi tự động mỗi khi bạn ghi sổ.
            </p>
            <Button
              variant="primary"
              size="sm"
              onPress={onOpenCreate}
              className="px-4 py-2 text-xs font-bold bg-amber-900 text-amber-100 rounded-lg"
            >
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
                        <Chip
                          size="sm"
                          color={badge.color}
                          variant="soft"
                          className="text-[11px] font-medium flex items-center gap-1"
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </Chip>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right font-mono tabular-nums">
                        <span className="text-sm font-bold text-foreground">
                          {formatVND(env.spentAmount)}
                        </span>
                        <span className="text-xs text-muted">
                          {' '}
                          / {formatVND(env.budgetAmount)}
                        </span>
                      </div>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
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
                      {env.remainingAmount >= 0
                        ? `Còn được chi ${formatVND(env.remainingAmount)}`
                        : `Vượt hạn mức ${formatVND(Math.abs(env.remainingAmount))}`}
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
