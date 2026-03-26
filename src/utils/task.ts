import type { Priority, Status } from '../types';

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ff4d6d',
  high: '#f5a623',
  medium: '#4f8ef7',
  low: '#22d3a0',
};

export const PRIORITY_BG: Record<Priority, string> = {
  critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  high: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  medium: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
};

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

export const STATUS_COLORS: Record<Status, string> = {
  todo: '#6b7280',
  in_progress: '#4f8ef7',
  in_review: '#9b6dff',
  done: '#22d3a0',
};

export const STATUS_BG: Record<Status, string> = {
  todo: 'bg-gray-500/15 text-gray-400',
  in_progress: 'bg-blue-500/15 text-blue-400',
  in_review: 'bg-purple-500/15 text-purple-400',
  done: 'bg-emerald-500/15 text-emerald-400',
};

export const ALL_STATUSES: Status[] = ['todo', 'in_progress', 'in_review', 'done'];
export const ALL_PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
