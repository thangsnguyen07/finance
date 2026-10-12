'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  BarChart3,
  Landmark,
  Settings,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useUiStore } from '@/stores/use-ui-store';

export function Sidebar() {
  const pathname = usePathname();
  const openQuickEntry = useUiStore((state) => state.openQuickEntry);

  const navItems = [
    {
      label: 'Tổng quan',
      href: '/',
      icon: LayoutDashboard,
      isActive: pathname === '/',
    },
    {
      label: 'Sổ giao dịch',
      href: '/transactions',
      icon: Receipt,
      isActive: pathname.startsWith('/transactions'),
    },
    {
      label: 'Ngân sách',
      href: '/budgets',
      icon: PieChart,
      isActive: pathname.startsWith('/budgets'),
    },
    {
      label: 'Báo cáo dòng tiền',
      href: '/reports',
      icon: BarChart3,
      isActive: pathname.startsWith('/reports'),
    },
    {
      label: 'Ví & Tài khoản',
      href: '/accounts',
      icon: Landmark,
      isActive: pathname.startsWith('/accounts'),
    },
    {
      label: 'Cài đặt sổ',
      href: '/settings',
      icon: Settings,
      isActive: pathname.startsWith('/settings'),
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface border-r border-border p-5 select-none shrink-0">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-md bg-accent text-accent-foreground flex items-center justify-center shadow-sm">
          <BookOpen className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-lg text-foreground tracking-tight leading-tight">
            Sổ Thu Chi
          </h1>
          <p className="text-[11px] text-muted font-sans uppercase tracking-wider">
            Paperlike Ledger
          </p>
        </div>
      </div>

      <Button
        tone="brand"
        onPress={openQuickEntry}
        className="w-full py-2.5 px-4 mb-6 rounded-md font-medium text-sm shadow-sm"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Ghi chép mới</span>
      </Button>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                item.isActive
                  ? 'bg-surface-secondary text-accent font-semibold border-l-2 border-accent'
                  : 'text-muted hover:text-foreground hover:bg-surface-secondary/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  item.isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-md text-xs text-muted">
          <div className="w-7 h-7 rounded-full bg-surface-tertiary flex items-center justify-center font-bold text-foreground">
            TN
          </div>
          <div className="truncate">
            <p className="font-medium text-foreground truncate">Thang Nguyen</p>
            <p className="text-[10px] text-muted">Bản ghi sổ 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
