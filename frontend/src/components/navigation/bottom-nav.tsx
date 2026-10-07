'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  Landmark,
} from 'lucide-react';

interface BottomNavProps {
  onQuickEntryClick?: () => void;
}

export function BottomNav({ onQuickEntryClick }: BottomNavProps) {
  const pathname = usePathname();

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
      isActive: pathname.startsWith('/transactions'),
    },
    {
      label: 'Ghi chép',
      href: '#quick-entry',
      icon: Plus,
      isAction: true,
      onClick: onQuickEntryClick,
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
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex flex-col items-center justify-center -mt-5 group focus:outline-none"
                aria-label="Thêm giao dịch mới"
              >
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md active:scale-95 transition-transform duration-150 border-2 border-surface">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-medium text-foreground/80 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                item.isActive
                  ? 'text-accent font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  item.isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'
                }`}
              />
              <span className="text-[11px] mt-1 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
