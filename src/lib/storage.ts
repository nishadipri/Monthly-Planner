import { STORAGE_KEYS, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants';
import { fromDateISO, toDateISO } from '@/lib/date';
import type {
  MigrationResult,
  Task,
  TaskCategory,
  TaskFilters,
  TaskInput,
  TaskPriority,
  TaskStatus,
} from '@/types/task';

interface LegacyTask {
  name?: string;
  category?: string;
  difficulty?: string;
  dueDate?: number | string;
}

interface StoragePayload {
  tasks: Task[];
  migrationResult: MigrationResult;
}

export interface PlannerSettings {
  filters: TaskFilters;
  lastViewedDateISO: string;
}

const defaultSettings: PlannerSettings = {
  filters: {
    status: 'all',
    category: 'all',
    priority: 'all',
  },
  lastViewedDateISO: toDateISO(new Date()),
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeCategory(value: string | undefined): TaskCategory {
  return TASK_CATEGORIES.includes(value as TaskCategory) ? (value as TaskCategory) : 'other';
}

function normalizePriority(value: string | undefined): TaskPriority {
  switch (value) {
    case 'easy':
      return 'low';
    case 'hard':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    case 'high':
      return 'high';
    default:
      return 'medium';
  }
}

function normalizeISODate(value: number | string | undefined): string {
  if (typeof value === 'number') {
    return toDateISO(new Date(value));
  }

  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return toDateISO(fromDateISO(value));
    }

    const asDate = new Date(value);
    if (!Number.isNaN(asDate.getTime())) {
      return toDateISO(asDate);
    }
  }

  return toDateISO(new Date());
}

function isTaskPayload(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;

  const task = value as Partial<Task>;

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.dateISO === 'string' &&
    TASK_CATEGORIES.includes(task.category as TaskCategory) &&
    TASK_PRIORITIES.includes(task.priority as TaskPriority) &&
    TASK_STATUSES.includes(task.status as TaskStatus) &&
    typeof task.notes === 'string' &&
    typeof task.createdAt === 'string' &&
    typeof task.updatedAt === 'string'
  );
}

export function createTask(input: TaskInput): Task {
  const now = new Date().toISOString();

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    title: input.title.trim(),
    dateISO: input.dateISO,
    category: input.category,
    priority: input.priority,
    status: input.status,
    notes: input.notes.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

function migrateLegacyTasks(legacyTasks: LegacyTask[]): Task[] {
  const now = new Date().toISOString();

  return legacyTasks
    .filter((task) => typeof task.name === 'string' && task.name.trim().length > 0)
    .map((task) => ({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      title: task.name!.trim(),
      dateISO: normalizeISODate(task.dueDate),
      category: normalizeCategory(task.category),
      priority: normalizePriority(task.difficulty),
      status: 'todo',
      notes: '',
      createdAt: now,
      updatedAt: now,
    }));
}

export function loadTasksWithMigration(): StoragePayload {
  if (typeof window === 'undefined') {
    return {
      tasks: [],
      migrationResult: { migratedCount: 0, sourceVersion: 'v2' },
    };
  }

  const v2Tasks = safeParse<unknown[]>(window.localStorage.getItem(STORAGE_KEYS.tasks));

  if (Array.isArray(v2Tasks)) {
    const validTasks = v2Tasks.filter(isTaskPayload);
    return {
      tasks: validTasks,
      migrationResult: { migratedCount: 0, sourceVersion: 'v2' },
    };
  }

  const legacyTasks = safeParse<LegacyTask[]>(window.localStorage.getItem(STORAGE_KEYS.legacyTasks));

  if (!Array.isArray(legacyTasks)) {
    return {
      tasks: [],
      migrationResult: { migratedCount: 0, sourceVersion: 'v2' },
    };
  }

  const migratedTasks = migrateLegacyTasks(legacyTasks);
  saveTasks(migratedTasks);

  return {
    tasks: migratedTasks,
    migrationResult: {
      migratedCount: migratedTasks.length,
      sourceVersion: 'legacy_savedTasks',
    },
  };
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

export function loadSettings(): PlannerSettings {
  if (typeof window === 'undefined') return defaultSettings;

  const parsed = safeParse<Partial<PlannerSettings>>(window.localStorage.getItem(STORAGE_KEYS.settings));

  if (!parsed) return defaultSettings;

  return {
    filters: {
      status: parsed.filters?.status ?? 'all',
      category: parsed.filters?.category ?? 'all',
      priority: parsed.filters?.priority ?? 'all',
    },
    lastViewedDateISO: parsed.lastViewedDateISO ?? defaultSettings.lastViewedDateISO,
  };
}

export function saveSettings(settings: PlannerSettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}
