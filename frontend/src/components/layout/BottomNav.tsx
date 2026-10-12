'use client';

import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  Landmark,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUiStore } from '@/stores/use-ui-store';

export function BottomNav() {
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
      label: 'Giao dịch',
      href: '/transactions',
      icon: Receipt,
      isActive:
        pathname.startsWith('/transactions') || pathname.startsWith('/reports'),
    },
    {
      label: 'Ghi chép',
      href: '#quick-entry',
      icon: Plus,
      isAction: true,
      onClick: openQuickEntry,
    },
    {
      label: 'Ngân sách',
      href: '/budgets',
      icon: PieChart,
      isActive: pathname.startsWith('/budgets'),
    },
    {
      label: 'Tài khoản',
      href: '/accounts',
      icon: Landmark,
      isActive: pathname.startsWith('/accounts'),
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="group -mt-5 flex cursor-pointer flex-col items-center justify-center focus:outline-none"
                aria-label="Thêm giao dịch mới"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-surface bg-accent text-accent-foreground shadow-md transition-transform duration-150 active:scale-95">
                  <Icon className="h-6 w-6 stroke-[2.5]" />
                </div>
                <span className="mt-1 text-[11px] font-medium text-foreground/80">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
                item.isActive
                  ? 'font-semibold text-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  item.isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'
                }`}
              />
              <span className="mt-1 text-[11px] tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
