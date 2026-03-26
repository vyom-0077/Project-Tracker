import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Arjun Sharma', color: '#4f8ef7' },
  { id: 'u2', name: 'Priya Patel', color: '#9b6dff' },
  { id: 'u3', name: 'Rohit Mehta', color: '#22d3a0' },
  { id: 'u4', name: 'Sneha Iyer', color: '#f5a623' },
  { id: 'u5', name: 'Vikram Das', color: '#ff4d6d' },
  { id: 'u6', name: 'Ananya Nair', color: '#00d4ff' },
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[] = ['todo', 'in_progress', 'in_review', 'done'];

const TASK_TITLES = [
  'Implement authentication flow',
  'Design dashboard layout',
  'Fix memory leak in worker thread',
  'Write unit tests for API endpoints',
  'Refactor database queries',
  'Add pagination to list views',
  'Create onboarding wizard',
  'Optimize image loading pipeline',
  'Build notification system',
  'Update API documentation',
  'Set up CI/CD pipeline',
  'Migrate to TypeScript',
  'Implement dark mode',
  'Add export to CSV feature',
  'Fix race condition in auth',
  'Create admin panel',
  'Improve search performance',
  'Add rate limiting',
  'Implement file upload',
  'Design mobile navigation',
  'Audit accessibility compliance',
  'Add WebSocket support',
  'Create email templates',
  'Implement two-factor auth',
  'Set up error monitoring',
  'Performance profiling audit',
  'Build reporting module',
  'Integrate payment gateway',
  'Add drag-and-drop sorting',
  'Create data visualization charts',
  'Implement lazy loading',
  'Add keyboard shortcuts',
  'Create API versioning strategy',
  'Build caching layer',
  'Write E2E tests',
  'Security audit and fixes',
  'Database schema migration',
  'Add multi-language support',
  'Create component library',
  'Implement undo/redo system',
  'Build activity log',
  'Add team permissions',
  'Optimize bundle size',
  'Create style guide',
  'Implement offline mode',
  'Add analytics tracking',
  'Build webhook system',
  'Create backup system',
  'Implement SSO',
  'Add custom fields support',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateTasks(count: number = 500): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const titleBase = TASK_TITLES[i % TASK_TITLES.length];
    const title = i < TASK_TITLES.length ? titleBase : `${titleBase} (v${Math.floor(i / TASK_TITLES.length) + 1})`;

    const dueDateOffset = randomInt(-20, 40); // some overdue
    const dueDate = addDays(today, dueDateOffset);
    const hasStartDate = Math.random() > 0.15; // 15% have no start date
    const startDateOffset = randomInt(-10, dueDateOffset - 1);
    const startDate = hasStartDate ? addDays(today, startDateOffset) : null;

    tasks.push({
      id: `task-${i + 1}`,
      title,
      status: randomFrom(STATUSES),
      priority: randomFrom(PRIORITIES),
      assigneeId: randomFrom(USERS).id,
      startDate: startDate ? toISO(startDate) : null,
      dueDate: toISO(dueDate),
    });
  }

  return tasks;
}

export const INITIAL_TASKS = generateTasks(500);
