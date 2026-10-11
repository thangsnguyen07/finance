'use client';

import { useState } from 'react';
import { Button, Card, Chip } from '@heroui/react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Loader2,
  Ruler,
} from 'lucide-react';
import { useBudgets } from '@/hooks/use-budgets';
import { UpsertBudgetModal } from '@/components/budgets/upsert-budget-modal';
import type { BudgetEnvelopeResponse, BudgetStatus } from '@/types/api';

function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function shiftMonth(month: string, delta: number): string {
  const parts = month.split('-');
  const year = Number(parts[0]);
  const m = Number(parts[1]);
  const d = new Date(year, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthDisplay(month: string): string {
  const parts = month.split('-');
  return `Tháng ${Number(parts[1])}/${parts[0]}`;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getMonthDayProgress(month: string): {
  currentDay: number;
  daysInMonth: number;
  dayPercentage: number;
  isCurrentMonth: boolean;
} {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}`;
  const parts = month.split('-');
  const year = Number(parts[0]);
  const m = Number(parts[1]);
  const daysInMonth = new Date(year, m, 0).getDate();

  if (month === currentMonthStr) {
    const currentDay = now.getDate();
    return {
      currentDay,
      daysInMonth,
      dayPercentage: Math.round((currentDay / daysInMonth) * 100),
      isCurrentMonth: true,
    };
  }

  return {
    currentDay: daysInMonth,
    daysInMonth,
    dayPercentage: 100,
    isCurrentMonth: false,
  };
}

function getStatusBadgeProps(status: BudgetStatus): {
  label: string;
  color: 'success' | 'warning' | 'danger';
  icon: typeof CheckCircle2;
} {
  if (status === 'EXCEEDED') {
    return {
      label: 'Vượt kế hoạch',
      color: 'danger',
      icon: Flame,
    };
  }
  if (status === 'WARNING') {
    return {
      label: 'Sắp chạm trần',
      color: 'warning',
      icon: AlertTriangle,
    };
  }
  return {
    label: 'Trong tầm kiểm soát',
    color: 'success',
    icon: CheckCircle2,
  };
}

export default function BudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentMonthString,
  );
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    categoryId?: string;
    amount?: number;
    budgetId?: string;
  }>({ isOpen: false });

  const { data: summary, isLoading, error } = useBudgets(selectedMonth);

  const dayProgress = getMonthDayProgress(selectedMonth);
  const totalBudgeted = summary?.totalBudgeted ?? 0;
  const totalSpent = summary?.totalSpentInBudgeted ?? 0;
  const remainingBudget = summary?.remainingBudget ?? 0;
  const overallPercent = summary?.overallUsagePercentage ?? 0;
  const clampedOverallWidth = Math.min(100, Math.max(0, overallPercent));
  const envelopes = summary?.envelopes ?? [];
  const unbudgeted = summary?.unbudgetedCategories ?? [];

  const openCreateModal = (categoryId?: string, suggestedAmount?: number) => {
    setModalState({
      isOpen: true,
      categoryId,
      amount: suggestedAmount,
      budgetId: undefined,
    });
  };

  const openEditModal = (env: BudgetEnvelopeResponse) => {
    setModalState({
      isOpen: true,
      categoryId: env.categoryId,
      amount: env.budgetAmount,
      budgetId: env.id,
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Month Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Sổ Ngân Sách Tháng
          </h1>
          <p className="text-xs text-muted mt-1">
            Phân bổ hạn mức chi tiêu theo từng phong bì danh mục và đối chiếu
            nhịp độ thực tế
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Month Selector */}
          <div className="inline-flex items-center bg-surface border border-border rounded-lg p-1 shadow-2xs">
            <button
              type="button"
              onClick={() =>
                setSelectedMonth((prev) => shiftMonth(prev, -1))
              }
              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-serif font-bold text-foreground min-w-[116px] text-center">
              {formatMonthDisplay(selectedMonth)}
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedMonth((prev) => shiftMonth(prev, 1))
              }
              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onPress={() => openCreateModal()}
            className="px-3.5 py-2 text-xs font-bold bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Đặt hạn mức</span>
          </Button>
        </div>
      </div>

      {/* 2. Focal Point: K3 Wooden Metric Ruler Master Card */}
      <Card className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs">
        <Card.Header className="p-0 pb-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted mb-1">
              <Ruler className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
              <span>
                Tổng kế hoạch chi tiêu • {formatMonthDisplay(selectedMonth)}
              </span>
              {dayProgress.isCurrentMonth ? (
                <span className="font-mono text-[11px] text-muted">
                  (Ngày {dayProgress.currentDay}/{dayProgress.daysInMonth})
                </span>
              ) : null}
            </div>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <Card.Title className="text-2xl sm:text-3xl font-serif font-black text-foreground tabular-nums">
                {isLoading ? '...' : formatVND(totalSpent)}
              </Card.Title>
              <span className="text-xs sm:text-sm font-mono text-muted tabular-nums">
                / hạn mức {formatVND(totalBudgeted)}
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] text-muted block">
              {remainingBudget >= 0
                ? 'Còn được phép chi'
                : 'Đã vượt tổng hạn mức'}
            </span>
            <span
              className={`font-mono text-base sm:text-lg font-bold tabular-nums ${
                remainingBudget >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {formatVND(Math.abs(remainingBudget))}
            </span>
          </div>
        </Card.Header>

        <Card.Content className="p-0 pt-4 space-y-2.5">
          {/* K3 Wooden Metric Ruler */}
          <div className="relative bg-[#EFE8D8] dark:bg-[#3E3834] border border-[#D5C7A9] dark:border-[#524B46] rounded-xs p-2 shadow-2xs font-mono text-[9px] text-stone-700 dark:text-stone-300">
            {/* Metric Notches */}
            <div className="flex justify-between items-end h-3.5 px-1 border-b border-stone-400/50 dark:border-stone-500/50 pb-0.5">
              <span>0%</span>
              <span className="h-1 w-px bg-stone-400 dark:bg-stone-500" />
              <span>25%</span>
              <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500" />
              <span className="font-bold text-stone-900 dark:text-stone-100">
                50%
              </span>
              <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500" />
              <span className="text-amber-800 dark:text-amber-300 font-semibold">
                80%
              </span>
              <span className="h-1 w-px bg-stone-400 dark:bg-stone-500" />
              <span className="text-danger font-bold">100%</span>
            </div>

            {/* Progress Track with Time Pace Marker */}
            <div className="mt-2 h-2.5 bg-surface rounded-2xs overflow-hidden relative border border-border/50">
              <div
                className={`h-full transition-all duration-500 rounded-2xs ${
                  overallPercent >= 100
                    ? 'bg-danger'
                    : overallPercent >= 80
                      ? 'bg-warning'
                      : 'bg-gradient-to-r from-amber-700 to-amber-900'
                }`}
                style={{ width: `${clampedOverallWidth}%` }}
              />
              {dayProgress.isCurrentMonth && totalBudgeted > 0 ? (
                <div
                  title={`Nhịp thời gian tháng: Ngày ${dayProgress.currentDay}/${dayProgress.daysInMonth} (${dayProgress.dayPercentage}%)`}
                  className="absolute top-0 bottom-0 w-0.5 bg-accent z-10"
                  style={{ left: `${dayProgress.dayPercentage}%` }}
                />
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted font-mono">
            <span>
              Đã dùng:{' '}
              <strong className="text-foreground">{overallPercent}%</strong> kế
              hoạch
            </span>
            {dayProgress.isCurrentMonth ? (
              <span>
                Nhịp thời gian tháng:{' '}
                <strong className="text-accent">
                  {dayProgress.dayPercentage}%
                </strong>{' '}
                ({dayProgress.currentDay}/{dayProgress.daysInMonth} ngày)
              </span>
            ) : null}
          </div>
        </Card.Content>
      </Card>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-xs">Đang đối chiếu sổ ngân sách tháng...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger text-xs rounded-lg">
          {error instanceof Error
            ? error.message
            : 'Không thể tải dữ liệu ngân sách tháng'}
        </div>
      ) : (
        <div className="space-y-6">
          {/* 3. Ruled Budget Envelope Sheet */}
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
                    Đặt hạn mức cho các danh mục chi tiêu lớn như Ăn uống, Tiền
                    nhà hoặc Di chuyển để thước đo K3 theo dõi tự động mỗi khi
                    bạn ghi sổ.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={() => openCreateModal()}
                    className="px-4 py-2 text-xs font-bold bg-amber-900 text-amber-100 rounded-lg cursor-pointer"
                  >
                    Đặt hạn mức đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/70">
                  {envelopes.map((env) => {
                    const badge = getStatusBadgeProps(env.status);
                    const StatusIcon = badge.icon;
                    const clampedBar = Math.min(
                      100,
                      Math.max(0, env.usagePercentage),
                    );

                    return (
                      <div
                        key={env.id}
                        className="py-4 flex flex-col gap-2.5 group"
                      >
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

                            <button
                              type="button"
                              onClick={() => openEditModal(env)}
                              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
                              aria-label={`Điều chỉnh hạn mức ${env.categoryName}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
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

          {/* 4. Unbudgeted Categories — 1-Tap Setup Invitation */}
          {unbudgeted.length > 0 ? (
            <Card className="bg-surface-secondary/40 border border-border rounded-xl p-5 shadow-2xs">
              <Card.Header className="p-0 pb-3">
                <Card.Title className="font-serif font-bold text-sm text-foreground">
                  Danh mục chưa đặt hạn mức ({unbudgeted.length})
                </Card.Title>
                <Card.Description className="text-xs text-muted mt-0.5">
                  Chọn một danh mục bên dưới để thiết lập phong bì hạn mức ngay
                </Card.Description>
              </Card.Header>

              <Card.Content className="p-0 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {unbudgeted.map((cat) => (
                    <button
                      key={cat.categoryId}
                      type="button"
                      onClick={() =>
                        openCreateModal(
                          cat.categoryId,
                          cat.spentAmount > 0
                            ? Math.ceil(cat.spentAmount / 500000) * 500000
                            : 2000000,
                        )
                      }
                      className="flex items-center justify-between p-3 bg-surface border border-border hover:border-accent rounded-lg text-left transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-semibold text-foreground block truncate group-hover:text-accent">
                          {cat.categoryName}
                        </span>
                        <span className="text-[11px] font-mono text-muted tabular-nums">
                          {cat.spentAmount > 0
                            ? `Tháng này đã chi: ${formatVND(cat.spentAmount)}`
                            : 'Chưa phát sinh chi tiêu'}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-accent shrink-0">
                        + Đặt hạn mức
                      </span>
                    </button>
                  ))}
                </div>
              </Card.Content>
            </Card>
          ) : null}
        </div>
      )}

      {/* Upsert Budget Modal */}
      <UpsertBudgetModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        month={selectedMonth}
        initialCategoryId={modalState.categoryId}
        initialAmount={modalState.amount}
        existingBudgetId={modalState.budgetId}
      />
    </div>
  );
}
