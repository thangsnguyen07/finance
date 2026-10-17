'use client';

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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface p-5 select-none lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground shadow-sm">
          <BookOpen className="h-5 w-5 stroke-[2]" />
        </div>
        <div>
          <h1 className="font-serif text-lg leading-tight font-bold tracking-tight text-foreground">
            Sổ Thu Chi
          </h1>
          <p className="font-sans text-xs tracking-wider text-muted uppercase">
            Paperlike Ledger
          </p>
        </div>
      </div>

      <Button
        tone="brand"
        onPress={openQuickEntry}
        className="mb-6 w-full rounded-md px-4 py-2.5 text-sm font-medium shadow-sm"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span>Ghi chép mới</span>
      </Button>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                item.isActive
                  ? 'border-l-2 border-accent bg-surface-secondary font-semibold text-accent'
                  : 'text-muted hover:bg-surface-secondary/60 hover:text-foreground'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  item.isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5 text-xs text-muted">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-tertiary font-bold text-foreground">
            TN
          </div>
          <div className="truncate">
            <p className="truncate font-medium text-foreground">Thang Nguyen</p>
            <p className="text-xs text-muted">Bản ghi sổ 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
