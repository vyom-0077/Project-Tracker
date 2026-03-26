import { create } from 'zustand';
import type { Task, FilterState, SortState, ViewType, Status } from '../types';
import { INITIAL_TASKS } from '../data/generator';

interface AppState {
  tasks: Task[];
  view: ViewType;
  filters: FilterState;
  sort: SortState;

  setView: (view: ViewType) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSort: (sort: SortState) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
}

const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  priorities: [],
  assignees: [],
  dateFrom: '',
  dateTo: '',
};

const DEFAULT_SORT: SortState = {
  field: 'dueDate',
  direction: 'asc',
};

export const useAppStore = create<AppState>((set) => ({
  tasks: INITIAL_TASKS,
  view: 'kanban',
  filters: DEFAULT_FILTERS,
  sort: DEFAULT_SORT,

  setView: (view) => set({ view }),

  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  setSort: (sort) => set({ sort }),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),
}));
