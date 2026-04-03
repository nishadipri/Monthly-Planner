import type { TaskCategory, TaskPriority, TaskStatus } from '@/types/task';

export const STORAGE_KEYS = {
  tasks: 'planner.tasks.v2',
  settings: 'planner.settings.v1',
  legacyTasks: 'savedTasks',
} as const;

export const TASK_CATEGORIES: TaskCategory[] = ['home', 'work', 'study', 'other'];
export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];

export const WEEKDAY_LABELS_MONDAY_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  home: 'Home',
  work: 'Work',
  study: 'Study',
  other: 'Other',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};
