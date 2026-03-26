export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';
export type ViewType = 'kanban' | 'list' | 'timeline';
export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  startDate: string | null; // ISO date string
  dueDate: string;           // ISO date string
  description?: string;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assignees: string[];
  dateFrom: string;
  dateTo: string;
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface CollaboratorPresence {
  userId: string;
  taskId: string | null;
  action: 'viewing' | 'editing';
}
