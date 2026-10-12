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
      variant="postIt"
      className="rotate-[-1.5deg] hover:rotate-0 transition-transform"
    >
      <div className="w-16 h-3 bg-amber-200/80 dark:bg-amber-700/50 border border-amber-300/70 dark:border-amber-600/50 rounded-2xs -mt-6 mx-auto mb-3 shadow-2xs" />

      <Card.Header className="pb-2 border-b border-[#FDE047] dark:border-[#5C5627] text-[11px] font-bold uppercase tracking-wider">
        <span>📌 Giấy Note Nhắc Việc</span>
        <span className="text-[10px] font-mono">{monthLabel}</span>
      </Card.Header>

      <Card.Content className="mt-3 space-y-2.5 text-xs font-sans">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-amber-800 dark:text-amber-400 shrink-0" />
          <span>Kiểm tra kỳ sao kê thẻ tín dụng hàng tháng.</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-amber-800 dark:text-amber-400 shrink-0" />
          <span>Hạn mức chi tiêu tháng đã dùng {usagePercent}% kế hoạch.</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-amber-800 dark:text-amber-400 shrink-0" />
          <span>Mục tiêu: Ghi chép đầy đủ mọi khoản thu chi trong ngày.</span>
        </div>
      </Card.Content>

      <Card.Footer className="mt-4 pt-3 border-t border-[#FDE047] dark:border-[#5C5627] justify-end">
        <Link href="/budgets" className="text-[11px] font-bold hover:underline">
          Xem chi tiết ngân sách →
        </Link>
      </Card.Footer>
    </Card>
  );
}
