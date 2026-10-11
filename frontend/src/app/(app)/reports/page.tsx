'use client';

import { useState, createContext, use } from 'react';
import { Card, Chip } from '@heroui/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { useTransactions } from '@/hooks/use-transactions';
import type { TransactionResponse } from '@/types/api';

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

function formatShortMonthLabel(month: string): string {
  const parts = month.split('-');
  return `T${String(Number(parts[1])).padStart(2, '0')}/${String(parts[0]).slice(2)}`;
}

function getSixMonthWindow(endMonth: string): {
  months: string[];
  startDate: string;
  endDate: string;
} {
  const months: string[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    months.push(shiftMonth(endMonth, -i));
  }
  const firstMonth = months[0] || endMonth;
  const parts = endMonth.split('-');
  const lastDay = new Date(Number(parts[0]), Number(parts[1]), 0).getDate();
  return {
    months,
    startDate: `${firstMonth}-01`,
    endDate: `${endMonth}-${String(lastDay).padStart(2, '0')}`,
  };
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
  count: number;
}

interface MonthlyPoint {
  month: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

interface ReportsAnalyticsData {
  selectedMonth: string;
  monthIncome: number;
  monthExpense: number;
  monthNet: number;
  savingsRate: number;
  sixMonthTrend: MonthlyPoint[];
  maxMonthlyValue: number;
  expenseBreakdown: CategoryBreakdownItem[];
  incomeBreakdown: CategoryBreakdownItem[];
}

const EXPENSE_PALETTE = [
  '#991B1B',
  '#B45309',
  '#1E3A8A',
  '#7C2D12',
  '#4338CA',
  '#BE123C',
  '#6E665E',
];

const INCOME_PALETTE = [
  '#166534',
  '#15803D',
  '#047857',
  '#0F766E',
  '#1E3A8A',
];

function computeAnalyticsSinglePass(
  transactions: TransactionResponse[],
  selectedMonth: string,
  monthsWindow: string[],
): ReportsAnalyticsData {
  const monthPointMap = new Map<string, { income: number; expense: number }>();
  for (const m of monthsWindow) {
    monthPointMap.set(m, { income: 0, expense: 0 });
  }

  const expenseCatMap = new Map<
    string,
    { name: string; color: string | null; amount: number; count: number }
  >();
  const incomeCatMap = new Map<
    string,
    { name: string; color: string | null; amount: number; count: number }
  >();

  let monthIncome = 0;
  let monthExpense = 0;

  // Single O(N) pass over transactions (following js-combine-iterations & js-index-maps)
  for (const tx of transactions) {
    const txMonth = tx.transactionDate.slice(0, 7);
    const bucket = monthPointMap.get(txMonth);

    if (bucket) {
      if (tx.type === 'INCOME') {
        bucket.income += tx.amount;
      } else if (tx.type === 'EXPENSE') {
        bucket.expense += tx.amount;
      }
    }

    if (txMonth === selectedMonth) {
      if (tx.type === 'EXPENSE') {
        monthExpense += tx.amount;
        const catId = tx.categoryId || 'uncategorized-expense';
        const catName = tx.category?.name || 'Chưa phân loại';
        const existing = expenseCatMap.get(catId);
        if (existing) {
          existing.amount += tx.amount;
          existing.count += 1;
        } else {
          expenseCatMap.set(catId, {
            name: catName,
            color: tx.category?.color || null,
            amount: tx.amount,
            count: 1,
          });
        }
      } else if (tx.type === 'INCOME') {
        monthIncome += tx.amount;
        const catId = tx.categoryId || 'uncategorized-income';
        const catName = tx.category?.name || 'Thu nhập khác';
        const existing = incomeCatMap.get(catId);
        if (existing) {
          existing.amount += tx.amount;
          existing.count += 1;
        } else {
          incomeCatMap.set(catId, {
            name: catName,
            color: tx.category?.color || null,
            amount: tx.amount,
            count: 1,
          });
        }
      }
    }
  }

  const sixMonthTrend: MonthlyPoint[] = [];
  let maxMonthlyValue = 1;

  for (const m of monthsWindow) {
    const point = monthPointMap.get(m) || { income: 0, expense: 0 };
    const peak = Math.max(point.income, point.expense);
    if (peak > maxMonthlyValue) {
      maxMonthlyValue = peak;
    }
    sixMonthTrend.push({
      month: m,
      label: formatShortMonthLabel(m),
      income: point.income,
      expense: point.expense,
      net: point.income - point.expense,
    });
  }

  const expenseBreakdown: CategoryBreakdownItem[] = Array.from(
    expenseCatMap.entries(),
  )
    .map(([categoryId, item], idx) => ({
      categoryId,
      categoryName: item.name,
      color:
        item.color || EXPENSE_PALETTE[idx % EXPENSE_PALETTE.length] || '#991B1B',
      amount: item.amount,
      count: item.count,
      percentage:
        monthExpense > 0
          ? Math.round((item.amount / monthExpense) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const incomeBreakdown: CategoryBreakdownItem[] = Array.from(
    incomeCatMap.entries(),
  )
    .map(([categoryId, item], idx) => ({
      categoryId,
      categoryName: item.name,
      color:
        item.color || INCOME_PALETTE[idx % INCOME_PALETTE.length] || '#166534',
      amount: item.amount,
      count: item.count,
      percentage:
        monthIncome > 0
          ? Math.round((item.amount / monthIncome) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const monthNet = monthIncome - monthExpense;
  const savingsRate =
    monthIncome > 0
      ? Math.round(((monthIncome - monthExpense) / monthIncome) * 1000) / 10
      : 0;

  return {
    selectedMonth,
    monthIncome,
    monthExpense,
    monthNet,
    savingsRate,
    sixMonthTrend,
    maxMonthlyValue,
    expenseBreakdown,
    incomeBreakdown,
  };
}

// ============================================================================
// Compound Component Pattern (vercel-composition-patterns + React 19 `use()`)
// ============================================================================

interface CategoryProportionContextValue {
  items: CategoryBreakdownItem[];
  totalAmount: number;
  emptyMessage: string;
}

const CategoryProportionContext =
  createContext<CategoryProportionContextValue | null>(null);

function useCategoryProportionContext(): CategoryProportionContextValue {
  const ctx = use(CategoryProportionContext);
  if (!ctx) {
    throw new Error(
      'CategoryProportion subcomponents must be used within CategoryProportionSheet.Root',
    );
  }
  return ctx;
}

function CategoryProportionRoot({
  items,
  totalAmount,
  emptyMessage,
  children,
}: {
  items: CategoryBreakdownItem[];
  totalAmount: number;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <CategoryProportionContext
      value={{ items, totalAmount, emptyMessage }}
    >
      <Card className="bg-surface border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
        {children}
      </Card>
    </CategoryProportionContext>
  );
}

function CategoryProportionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { totalAmount } = useCategoryProportionContext();
  return (
    <Card.Header className="p-0 pb-3 border-b border-border flex items-baseline justify-between gap-2">
      <div>
        <Card.Title className="font-serif font-bold text-base text-foreground">
          {title}
        </Card.Title>
        <Card.Description className="text-xs text-muted mt-0.5">
          {subtitle}
        </Card.Description>
      </div>
      <span className="font-mono text-sm font-bold text-foreground tabular-nums">
        {formatVND(totalAmount)}
      </span>
    </Card.Header>
  );
}

function CategoryProportionSegmentedBar() {
  const { items, totalAmount } = useCategoryProportionContext();
  if (items.length === 0 || totalAmount <= 0) return null;

  return (
    <div className="mt-4 h-3 w-full rounded-xs overflow-hidden flex bg-surface-secondary border border-border/60 p-0.5 gap-0.5">
      {items.map((item) => (
        <div
          key={item.categoryId}
          style={{
            width: `${Math.max(2, item.percentage)}%`,
            backgroundColor: item.color,
          }}
          title={`${item.categoryName}: ${item.percentage}%`}
          className="h-full first:rounded-l-2xs last:rounded-r-2xs transition-all duration-300"
        />
      ))}
    </div>
  );
}

function CategoryProportionList() {
  const { items, emptyMessage } = useCategoryProportionContext();

  if (items.length === 0) {
    return (
      <Card.Content className="p-0 py-10 text-center">
        <p className="text-xs text-muted">{emptyMessage}</p>
      </Card.Content>
    );
  }

  return (
    <Card.Content className="p-0 pt-3 divide-y divide-border/60">
      {items.map((item) => (
        <div
          key={item.categoryId}
          className="py-2.5 flex items-center justify-between text-xs gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-2xs shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <span className="font-medium text-foreground truncate block">
                {item.categoryName}
              </span>
              <span className="text-[11px] text-muted">
                {item.count} bút toán
              </span>
            </div>
          </div>

          <div className="text-right font-mono tabular-nums shrink-0">
            <span className="font-bold text-foreground block">
              {formatVND(item.amount)}
            </span>
            <span className="text-[11px] text-muted">{item.percentage}%</span>
          </div>
        </div>
      ))}
    </Card.Content>
  );
}

const CategoryProportionSheet = {
  Root: CategoryProportionRoot,
  Header: CategoryProportionHeader,
  SegmentedBar: CategoryProportionSegmentedBar,
  List: CategoryProportionList,
};

// ============================================================================
// Explicit Variants for Net Cashflow Badge (avoiding boolean prop proliferation)
// ============================================================================

function SurplusSavingsBadge({ rate }: { rate: number }) {
  return (
    <Chip
      size="sm"
      color="success"
      variant="soft"
      className="font-mono text-xs font-semibold"
    >
      Giữ lại được {rate}% thu nhập
    </Chip>
  );
}

function DeficitSavingsBadge() {
  return (
    <Chip
      size="sm"
      color="danger"
      variant="soft"
      className="font-mono text-xs font-semibold"
    >
      Chi vượt thu trong kỳ
    </Chip>
  );
}

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentMonthString,
  );

  const windowRange = getSixMonthWindow(selectedMonth);
  const { data: txData, isLoading } = useTransactions({
    startDate: windowRange.startDate,
    endDate: windowRange.endDate,
    limit: 200,
  });

  const analytics = computeAnalyticsSinglePass(
    txData?.items || [],
    selectedMonth,
    windowRange.months,
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Month Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
            Sổ Báo Cáo & Phân Tích Dòng Tiền
          </h1>
          <p className="text-xs text-muted mt-1">
            Tổng hợp cán cân thu chi, tỷ lệ tiết kiệm ròng và cơ cấu danh mục
          </p>
        </div>

        <div className="inline-flex items-center bg-surface border border-border rounded-lg p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedMonth((prev) => shiftMonth(prev, -1))}
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
            onClick={() => setSelectedMonth((prev) => shiftMonth(prev, 1))}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Monthly Balance Sheet Summary Card */}
      <Card className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs">
        <Card.Header className="p-0 pb-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-muted block">
              Thặng dư / Thâm hụt ròng • {formatMonthDisplay(selectedMonth)}
            </span>
            <Card.Title
              className={`text-2xl sm:text-3xl font-serif font-black mt-1 tabular-nums ${
                analytics.monthNet >= 0 ? 'text-foreground' : 'text-danger'
              }`}
            >
              {analytics.monthNet > 0 ? '+' : ''}
              {formatVND(analytics.monthNet)}
            </Card.Title>
          </div>

          {analytics.monthIncome > 0 ? (
            analytics.monthNet >= 0 ? (
              <SurplusSavingsBadge rate={analytics.savingsRate} />
            ) : (
              <DeficitSavingsBadge />
            )
          ) : null}
        </Card.Header>

        <Card.Content className="p-0 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-secondary/40 border border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-muted block">Tổng dòng thu</span>
                <span className="text-[11px] text-muted">
                  {analytics.incomeBreakdown.length} nhóm nguồn thu
                </span>
              </div>
            </div>
            <span className="font-mono text-base font-bold text-success tabular-nums">
              +{formatVND(analytics.monthIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-secondary/40 border border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-muted block">Tổng dòng chi</span>
                <span className="text-[11px] text-muted">
                  {analytics.expenseBreakdown.length} nhóm chi tiêu
                </span>
              </div>
            </div>
            <span className="font-mono text-base font-bold text-danger tabular-nums">
              -{formatVND(analytics.monthExpense)}
            </span>
          </div>
        </Card.Content>
      </Card>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-xs">Đang tổng hợp sổ báo cáo dòng tiền...</p>
        </div>
      ) : (
        <>
          {/* 3. Focal Point: 6-Month Cashflow Ledger Bar Chart on Ruled Paper */}
          <Card className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs">
            <Card.Header className="p-0 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent" />
                <div>
                  <Card.Title className="font-serif font-bold text-base text-foreground">
                    Biểu đồ đối chiếu Thu – Chi 6 tháng
                  </Card.Title>
                  <Card.Description className="text-xs text-muted">
                    Bấm vào cột tháng bất kỳ để xem chi tiết cơ cấu danh mục của
                    tháng đó
                  </Card.Description>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className="w-2.5 h-2.5 rounded-2xs bg-success inline-block" />
                  Thu nhập
                </span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className="w-2.5 h-2.5 rounded-2xs bg-danger inline-block" />
                  Chi tiêu
                </span>
              </div>
            </Card.Header>

            <Card.Content className="p-0 pt-6">
              <div className="relative h-48 grid grid-cols-6 gap-2 sm:gap-4 items-end pt-4 px-2 border-b border-border bg-[linear-gradient(to_bottom,transparent_24%,var(--border)_25%,transparent_26%,transparent_49%,var(--border)_50%,transparent_51%,transparent_74%,var(--border)_75%,transparent_76%)]">
                {analytics.sixMonthTrend.map((point) => {
                  const isCurrentSelected = point.month === selectedMonth;
                  const incomeHeight = Math.round(
                    (point.income / analytics.maxMonthlyValue) * 100,
                  );
                  const expenseHeight = Math.round(
                    (point.expense / analytics.maxMonthlyValue) * 100,
                  );

                  return (
                    <button
                      key={point.month}
                      type="button"
                      onClick={() => setSelectedMonth(point.month)}
                      className={`h-full flex flex-col justify-end items-center group cursor-pointer rounded-t-md px-1 pt-2 transition-colors ${
                        isCurrentSelected
                          ? 'bg-accent/5 ring-1 ring-accent/30'
                          : 'hover:bg-surface-secondary/50'
                      }`}
                    >
                      <div className="w-full max-w-[44px] h-full flex items-end justify-center gap-1 sm:gap-1.5">
                        <div
                          style={{
                            height: `${
                              point.income > 0 ? Math.max(6, incomeHeight) : 2
                            }%`,
                          }}
                          title={`Thu ${point.label}: ${formatVND(point.income)}`}
                          className="w-1/2 bg-success rounded-t-2xs transition-all duration-300"
                        />
                        <div
                          style={{
                            height: `${
                              point.expense > 0 ? Math.max(6, expenseHeight) : 2
                            }%`,
                          }}
                          title={`Chi ${point.label}: ${formatVND(point.expense)}`}
                          className="w-1/2 bg-danger rounded-t-2xs transition-all duration-300"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* X-Axis Labels */}
              <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-2.5 px-2 text-center">
                {analytics.sixMonthTrend.map((point) => {
                  const isCurrentSelected = point.month === selectedMonth;
                  return (
                    <button
                      key={point.month}
                      type="button"
                      onClick={() => setSelectedMonth(point.month)}
                      className={`text-[11px] font-mono cursor-pointer transition-colors ${
                        isCurrentSelected
                          ? 'font-bold text-accent underline underline-offset-4'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      {point.label}
                    </button>
                  );
                })}
              </div>
            </Card.Content>
          </Card>

          {/* 4. Category Proportion Breakdown Using Compound Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CategoryProportionSheet.Root
              items={analytics.expenseBreakdown}
              totalAmount={analytics.monthExpense}
              emptyMessage={`Chưa có khoản chi tiêu nào trong ${formatMonthDisplay(selectedMonth)}.`}
            >
              <div>
                <CategoryProportionSheet.Header
                  title="Cơ cấu chi tiêu theo danh mục"
                  subtitle="Tỷ trọng các khoản chi lớn nhất trong kỳ"
                />
                <CategoryProportionSheet.SegmentedBar />
                <CategoryProportionSheet.List />
              </div>
            </CategoryProportionSheet.Root>

            <CategoryProportionSheet.Root
              items={analytics.incomeBreakdown}
              totalAmount={analytics.monthIncome}
              emptyMessage={`Chưa có khoản thu nhập nào trong ${formatMonthDisplay(selectedMonth)}.`}
            >
              <div>
                <CategoryProportionSheet.Header
                  title="Cơ cấu nguồn thu nhập"
                  subtitle="Phân bổ các nguồn tiền đi vào trong kỳ"
                />
                <CategoryProportionSheet.SegmentedBar />
                <CategoryProportionSheet.List />
              </div>
            </CategoryProportionSheet.Root>
          </div>
        </>
      )}
    </div>
  );
}
