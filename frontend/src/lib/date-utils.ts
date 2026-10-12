export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function shiftMonth(month: string, delta: number): string {
  const parts = month.split('-');
  const year = Number(parts[0]);
  const m = Number(parts[1]);
  const d = new Date(year, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export interface MonthDayProgress {
  currentDay: number;
  daysInMonth: number;
  dayPercentage: number;
  isCurrentMonth: boolean;
}

export function getMonthDayProgress(month: string): MonthDayProgress {
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

export function getSixMonthWindow(endMonth: string): {
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
