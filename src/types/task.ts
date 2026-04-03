export type TaskCategory = 'home' | 'work' | 'study' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  dateISO: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  dateISO: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  notes: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  category?: TaskCategory | 'all';
  priority?: TaskPriority | 'all';
}

export interface MigrationResult {
  migratedCount: number;
  sourceVersion: 'legacy_savedTasks' | 'v2';
}
