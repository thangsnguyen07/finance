const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatVND(amount: number): string {
  return vndFormatter.format(amount);
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatMonthDisplay(month: string): string {
  const parts = month.split('-');
  return `Tháng ${Number(parts[1])}/${parts[0]}`;
}

export function formatShortMonthLabel(month: string): string {
  const parts = month.split('-');
  return `T${String(Number(parts[1])).padStart(2, '0')}/${String(parts[0]).slice(2)}`;
}
