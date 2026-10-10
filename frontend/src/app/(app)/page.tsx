'use client';

import Link from 'next/link';
import {
  Paperclip,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  CreditCard,
  Banknote,
  CheckCircle2,
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
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const totalDebt = (accounts || [])
    .filter((a) => a.type === 'CREDIT_CARD')
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const netWorth = totalAssets - totalDebt;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HERO: SỔ CÁI TÀI SẢN & THƯỚC ĐO NGÂN SÁCH GỖ K3 */}
      <div className="relative bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-xs overflow-hidden space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-muted">
              Sổ Cái Tổng Hợp • Số Dư Tích Lũy
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300">
              +4.2% T10
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-foreground tracking-tight tabular-nums">
            {isLoading ? '...' : formatVND(netWorth)}
          </h1>
        </div>

        {/* THƯỚC ĐO NGÂN SÁCH GỖ SỒI K3 */}
        <div className="pt-3 border-t border-border/70 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <span>📏 Hạn mức chi tiêu tháng 10:</span>
              <span className="text-[10px] text-muted font-normal">(Ngày 10/31)</span>
            </span>
            <span className="font-mono text-amber-950 dark:text-amber-300 font-bold">
              10.250.000 ₫ (58%)
            </span>
          </div>

          {/* Wooden metric ruler bar */}
          <div className="relative bg-[#EFE8D8] dark:bg-[#3E3834] border border-[#D5C7A9] dark:border-[#524B46] rounded-xs p-1.5 shadow-2xs font-mono text-[8px] text-stone-700 dark:text-stone-300">
            {/* Metric Notches */}
            <div className="flex justify-between items-end h-3 px-1 border-b border-stone-400/50 dark:border-stone-500/50 pb-0.5">
              <span>0%</span>
              <span className="h-1 w-px bg-stone-400 dark:bg-stone-500"></span>
              <span>25%</span>
              <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500"></span>
              <span className="font-bold text-stone-900 dark:text-stone-100">50%</span>
              <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500"></span>
              <span>75%</span>
              <span className="h-1 w-px bg-stone-400 dark:bg-stone-500"></span>
              <span className="text-danger font-bold">100%</span>
            </div>
            {/* Amber Progress Fill */}
            <div className="mt-1.5 h-2 bg-surface rounded-2xs overflow-hidden relative border border-border/40">
              <div
                className="h-full bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xs transition-all duration-500"
                style={{ width: '58%' }}
              />
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-muted font-mono">
            <span>Đã chi: 10.250.000 ₫ (58%)</span>
            <span className="font-bold text-foreground">Còn lại: 7.250.000 ₫</span>
          </div>
        </div>

        {/* Chú thích bút máy viết tay */}
        <p className="text-sm font-hand text-muted pt-2 border-t border-border/70 flex items-center justify-between">
          <span>✍️ Dòng tiền ròng tháng 10 đang thặng dư +4.800.000 ₫</span>
          <span className="font-sans text-[10px] text-muted font-medium">
            Cập nhật gần nhất
          </span>
        </p>
      </div>

      {/* 2. POCKET CARDS: KHAY KẸP VÍ TIỀN & THẺ THANH TOÁN (Horizontal Carousel) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-muted rotate-45" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
              Khay Kẹp Ví & Thẻ Thanh Toán
            </h2>
          </div>
          <Link
            href="/accounts"
            className="text-xs text-accent hover:underline font-medium"
          >
            Quản lý tất cả →
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {isLoading ? (
            <div className="p-4 bg-surface border border-border rounded-lg text-xs text-muted">
              Đang tải danh sách ví...
            </div>
          ) : (accounts || []).length === 0 ? (
            <div className="p-4 bg-surface border border-border rounded-lg text-xs text-muted flex items-center gap-3">
              <span>Chưa có ví nào được tạo.</span>
              <Link
                href="/accounts"
                className="text-xs text-accent font-semibold hover:underline"
              >
                Tạo ví đầu tiên →
              </Link>
            </div>
          ) : (
            <>
              {(accounts || []).map((acc, idx) => (
                <div
                  key={acc.id}
                  className="shrink-0 w-48 sm:w-56 bg-surface border border-border rounded-lg p-3.5 shadow-xs relative group hover:border-accent transition-all"
                >
                  {/* Paperclip Accent Top Left */}
                  <div className="absolute -top-1.5 left-4 w-2 h-3.5 bg-amber-800/80 rounded-full" />
                  
                  <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      Thẻ #{idx + 1}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/10 text-muted flex items-center gap-1">
                      {acc.type === 'CASH' ? (
                        <>
                          <Banknote className="w-3 h-3 text-emerald-600" />
                          <span>Tiền mặt</span>
                        </>
                      ) : acc.type === 'CREDIT_CARD' ? (
                        <>
                          <CreditCard className="w-3 h-3 text-danger" />
                          <span className="text-danger font-bold">Thẻ tín dụng</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3 h-3 text-accent" />
                          <span>Ngân hàng</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-medium text-xs sm:text-sm text-foreground truncate">
                    {acc.name}
                  </h3>

                  <div className="mt-2 text-base font-serif font-bold text-foreground tabular-nums">
                    {formatVND(acc.currentBalance || 0)}
                  </div>
                </div>
              ))}

              {/* Add New Wallet Button Card */}
              <Link
                href="/accounts"
                className="shrink-0 w-32 border border-dashed border-border hover:border-accent rounded-lg p-3.5 flex flex-col items-center justify-center text-center text-muted hover:text-accent transition-colors group cursor-pointer bg-surface/50"
              >
                <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Thêm ví mới</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 3. RULED LEDGER & POST-IT NOTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Nhật Ký Ghi Sổ 3 Dòng Kẻ Gần Nhất */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans flex items-center gap-1.5">
              <span>📖 Nhật Ký Ghi Sổ Gần Nhất</span>
            </h2>
            <Link
              href="/transactions"
              className="text-xs text-accent hover:underline font-medium"
            >
              Xem toàn bộ sổ →
            </Link>
          </div>

          <div className="divide-y divide-border/60 mt-1">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-foreground block">
                    Cà phê sáng & Bánh mì
                  </span>
                  <span className="text-[10px] text-muted font-sans">
                    08:30 • Tiền mặt
                  </span>
                </div>
              </div>
              <span className="font-mono font-bold text-danger">
                -45.000 ₫
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-foreground block">
                    Siêu thị VinMart cuối tuần
                  </span>
                  <span className="text-[10px] text-muted font-sans">
                    Hôm qua • Vietcombank
                  </span>
                </div>
              </div>
              <span className="font-mono font-bold text-danger">
                -420.000 ₫
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-success/10 text-success flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-foreground block">
                    Lương công ty tháng 10
                  </span>
                  <span className="text-[10px] text-muted font-sans">
                    05/10 • Techcombank
                  </span>
                </div>
              </div>
              <span className="font-mono font-bold text-success">
                +25.000.000 ₫
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Yellow Post-it Note Dán Xiên Nhắc Việc */}
        <div className="relative bg-[#FEF9C3] dark:bg-[#423E1C] text-[#713F12] dark:text-[#FEF08A] border border-[#FDE047] dark:border-[#5C5627] rounded-lg p-5 shadow-sm rotate-[-1.5deg] hover:rotate-0 transition-transform">
          {/* Post-it Tape header */}
          <div className="w-16 h-3 bg-amber-200/80 dark:bg-amber-700/50 border border-amber-300/70 dark:border-amber-600/50 rounded-2xs -mt-6 mx-auto mb-3 shadow-2xs" />

          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider pb-2 border-b border-[#FDE047] dark:border-[#5C5627]">
            <span>📌 Giấy Note Nhắc Việc</span>
            <span className="text-[10px] font-mono">T10/2026</span>
          </div>

          <ul className="mt-3 space-y-2.5 text-xs font-sans">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-amber-800 dark:text-amber-400 shrink-0" />
              <span>Hạn sao kê thẻ tín dụng: ngày 15/10.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-amber-800 dark:text-amber-400 shrink-0" />
              <span>Hạn mức ăn uống đã đạt 58% kế hoạch.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-amber-800 dark:text-amber-400 shrink-0" />
              <span>Mục tiêu: Không chi tiêu ngoài danh mục.</span>
            </li>
          </ul>

          <div className="mt-4 pt-3 border-t border-[#FDE047] dark:border-[#5C5627] flex justify-end">
            <Link
              href="/budgets"
              className="text-[11px] font-bold hover:underline"
            >
              Xem chi tiết ngân sách →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
