'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui';

interface PostItReminderCardProps {
  usagePercent: number;
}

export function PostItReminderCard({ usagePercent }: PostItReminderCardProps) {
  const now = new Date();
  const monthLabel = `T${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  return (
    <Card
      variant="post-it"
      className="relative rotate-[-1.5deg] overflow-visible rounded-lg transition-transform hover:rotate-0"
    >
      <div className="mx-auto -mt-6 mb-3 h-3 w-16 rounded-2xs border border-amber-300/70 bg-amber-200/80 shadow-2xs dark:border-amber-600/50 dark:bg-amber-700/50" />

      <Card.Header className="border-b border-[#FDE047] pb-2 text-[11px] font-bold tracking-wider uppercase dark:border-[#5C5627]">
        <span>📌 Giấy Note Nhắc Việc</span>
        <span className="font-mono text-[10px]">{monthLabel}</span>
      </Card.Header>

      <Card.Content className="mt-3 space-y-2.5 font-sans text-xs">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-800 dark:text-amber-400" />
          <span>Kiểm tra kỳ sao kê thẻ tín dụng hàng tháng.</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-800 dark:text-amber-400" />
          <span>Hạn mức chi tiêu tháng đã dùng {usagePercent}% kế hoạch.</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-800 dark:text-amber-400" />
          <span>Mục tiêu: Ghi chép đầy đủ mọi khoản thu chi trong ngày.</span>
        </div>
      </Card.Content>

      <Card.Footer className="mt-4 justify-end border-t border-[#FDE047] pt-3 dark:border-[#5C5627]">
        <Link href="/budgets" className="text-[11px] font-bold hover:underline">
          Xem chi tiết ngân sách →
        </Link>
      </Card.Footer>
    </Card>
  );
}
