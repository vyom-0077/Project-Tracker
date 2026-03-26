import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { Task } from '../types';

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export function useFilteredTasks(): Task[] {
  const { tasks, filters, sort } = useAppStore();

  return useMemo(() => {
    let result = tasks.filter((task) => {
      if (filters.statuses.length && !filters.statuses.includes(task.status)) return false;
      if (filters.priorities.length && !filters.priorities.includes(task.priority)) return false;
      if (filters.assignees.length && !filters.assignees.includes(task.assigneeId)) return false;
      if (filters.dateFrom && task.dueDate < filters.dateFrom) return false;
      if (filters.dateTo && task.dueDate > filters.dateTo) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sort.field === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (sort.field === 'priority') {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      } else if (sort.field === 'dueDate') {
        cmp = a.dueDate.localeCompare(b.dueDate);
      }
      return sort.direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks, filters, sort]);
}
