export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysDiff(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

export function formatDueDate(dateStr: string): string {
  const diff = daysDiff(dateStr);
  if (diff === 0) return 'Due Today';
  if (diff < -7) return `${Math.abs(diff)} days overdue`;
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function isOverdue(dateStr: string): boolean {
  return daysDiff(dateStr) < 0;
}

export function isDueToday(dateStr: string): boolean {
  return daysDiff(dateStr) === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthStart(year: number, month: number): Date {
  return new Date(year, month, 1);
}
