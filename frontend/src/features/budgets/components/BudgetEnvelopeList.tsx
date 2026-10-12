'use client';

import { Pencil } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CurrencyText,
  ProgressBar,
  Row,
  Stack,
  Text,
} from '@/components/ui';

import {
  BUDGET_STATUS_ICONS,
  BUDGET_STATUS_LABELS,
  BUDGET_STATUS_TONES,
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
    <Card
      title={`Phong bì đã đặt hạn mức (${envelopes.length})`}
      description="Sắp xếp tự động theo mức độ sử dụng từ cao xuống thấp"
      borderedHeader
    >
      {envelopes.length === 0 ? (
        <Stack align="center" gap="md" className="py-10 text-center">
          <Text variant="heading">
            Tháng này chưa có phong bì ngân sách nào
          </Text>
          <Text variant="caption" tone="muted" className="mx-auto max-w-md">
            Đặt hạn mức cho các danh mục chi tiêu lớn như Ăn uống, Tiền nhà hoặc
            Di chuyển để thước đo K3 theo dõi tự động mỗi khi bạn ghi sổ.
          </Text>
          <Button tone="primary" size="sm" onPress={onOpenCreate}>
            Đặt hạn mức đầu tiên
          </Button>
        </Stack>
      ) : (
        <Stack divided gap="none">
          {envelopes.map((env) => {
            const StatusIcon = BUDGET_STATUS_ICONS[env.status];
            const statusLabel = BUDGET_STATUS_LABELS[env.status];
            const statusTone = BUDGET_STATUS_TONES[env.status];

            return (
              <Stack key={env.id} gap="sm" className="group py-4">
                <Row align="start" justify="between" gap="md">
                  <Row wrap gap="sm">
                    <Text as="h3" variant="title">
                      {env.categoryName}
                    </Text>
                    <Badge
                      size="sm"
                      color={statusTone}
                      variant="soft"
                      className="flex items-center gap-1"
                    >
                      <StatusIcon className="h-3 w-3" />
                      <span>{statusLabel}</span>
                    </Badge>
                  </Row>

                  <Row gap="sm" className="shrink-0">
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
                  </Row>
                </Row>

                <ProgressBar
                  value={env.usagePercentage}
                  tone={statusTone}
                  leftLabel={`Đã chi ${env.usagePercentage}%`}
                  rightLabel={
                    <Text
                      as="span"
                      variant="mono"
                      tone={env.remainingAmount >= 0 ? 'default' : 'danger'}
                      weight={env.remainingAmount >= 0 ? 'medium' : 'bold'}
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
                    </Text>
                  }
                />
              </Stack>
            );
          })}
        </Stack>
      )}
    </Card>
  );
}
