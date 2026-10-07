'use client';

import Link from 'next/link';
import {
  Landmark,
  Receipt,
  PieChart,
  ArrowRight,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useAccounts } from '@/hooks/use-accounts';

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardPage() {
  const { data: accounts, isLoading } = useAccounts();

  const totalAssets = (accounts || [])
    .filter((a) => a.type !== 'CREDIT_CARD')
    .reduce((sum, a) => sum + (a.current_balance || 0), 0);

  const totalDebt = (accounts || [])
    .filter((a) => a.type === 'CREDIT_CARD')
    .reduce((sum, a) => sum + (a.current_balance || 0), 0);

  const netWorth = totalAssets - totalDebt;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paperlike Visual Identity</span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-foreground tracking-tight">
            Chào mừng trở lại, Thang Nguyen
          </h1>
          <p className="text-xs text-muted mt-1 max-w-md">
            Sổ ghi chép tài chính cá nhân tinh tế, không chói mắt, ghi nhận trung thực dòng tiền.
          </p>

          <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-6">
            <div>
              <span className="text-xs text-muted block">Tài sản ròng hiện tại</span>
              <span className="font-serif text-2xl font-bold text-foreground">
                {isLoading ? '...' : formatVND(netWorth)}
              </span>
            </div>
            <div className="border-l border-border/60 pl-6">
              <span className="text-xs text-muted block">Tài khoản & Ví</span>
              <span className="font-mono text-lg font-semibold text-foreground">
                {isLoading ? '...' : `${(accounts || []).length} tài khoản`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/accounts"
          className="p-5 bg-surface border border-border rounded-lg shadow-xs hover:border-accent hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-md bg-accent/10 text-accent flex items-center justify-center mb-3">
            <Landmark className="w-5 h-5 stroke-[2]" />
          </div>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors flex items-center justify-between">
            <span>Ví & Tài khoản</span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-xs text-muted mt-1">
            Quản lý tiền mặt, thẻ ngân hàng và hạn mức thẻ tín dụng.
          </p>
        </Link>

        <Link
          href="/transactions"
          className="p-5 bg-surface border border-border rounded-lg shadow-xs hover:border-accent hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-md bg-success/10 text-success flex items-center justify-center mb-3">
            <Receipt className="w-5 h-5 stroke-[2]" />
          </div>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors flex items-center justify-between">
            <span>Sổ giao dịch</span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-xs text-muted mt-1">
            Nhật ký ghi chép các khoản chi tiêu và nguồn thu nhập.
          </p>
        </Link>

        <Link
          href="/budgets"
          className="p-5 bg-surface border border-border rounded-lg shadow-xs hover:border-accent hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 rounded-md bg-warning/10 text-warning flex items-center justify-center mb-3">
            <PieChart className="w-5 h-5 stroke-[2]" />
          </div>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors flex items-center justify-between">
            <span>Hạn mức ngân sách</span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-xs text-muted mt-1">
            Kế hoạch phân bổ chi tiêu cho từng danh mục tháng.
          </p>
        </Link>
      </div>

      {/* Snapshot of Wallets */}
      <div className="bg-surface border border-border rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
              Danh sách ví đang hoạt động
            </h2>
          </div>
          <Link
            href="/accounts"
            className="text-xs text-accent hover:underline font-medium"
          >
            Xem chi tiết →
          </Link>
        </div>

        {isLoading ? (
          <p className="text-xs text-muted py-4">Đang tải...</p>
        ) : (accounts || []).length === 0 ? (
          <p className="text-xs text-muted py-4">Chưa có tài khoản nào được tạo.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(accounts || []).map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between p-3 rounded-md bg-surface-secondary/30 border border-border/50 text-xs"
              >
                <span className="font-medium text-foreground">{acc.name}</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatVND(acc.current_balance || 0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
