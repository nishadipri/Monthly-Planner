import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '@/lib/constants';
import { loadTasksWithMigration, loadSettings, saveSettings } from '@/lib/storage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadTasksWithMigration', () => {
  it('migrates legacy tasks from savedTasks to planner.tasks.v2', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.legacyTasks,
      JSON.stringify([
        {
          name: 'Old planner item',
          category: 'study',
          difficulty: 'hard',
          dueDate: new Date('2026-02-10T10:00:00.000Z').getTime(),
        },
      ])
    );

    const result = loadTasksWithMigration();

    expect(result.migrationResult.sourceVersion).toBe('legacy_savedTasks');
    expect(result.migrationResult.migratedCount).toBe(1);
    expect(result.tasks[0].title).toBe('Old planner item');
    expect(result.tasks[0].category).toBe('study');
    expect(result.tasks[0].priority).toBe('high');
    expect(result.tasks[0].status).toBe('todo');

    const persisted = window.localStorage.getItem(STORAGE_KEYS.tasks);
    expect(persisted).not.toBeNull();
  });

  it('is idempotent when v2 data already exists', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.tasks,
      JSON.stringify([
        {
          id: 'v2-1',
          title: 'Modern task',
          dateISO: '2026-02-05',
          category: 'work',
          priority: 'medium',
          status: 'in_progress',
          notes: '',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ])
    );

    window.localStorage.setItem(
      STORAGE_KEYS.legacyTasks,
      JSON.stringify([{ name: 'Should not migrate again', difficulty: 'easy' }])
    );

    const result = loadTasksWithMigration();

    expect(result.migrationResult.sourceVersion).toBe('v2');
    expect(result.migrationResult.migratedCount).toBe(0);
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].id).toBe('v2-1');
  });
});

describe('settings storage', () => {
  it('saves and loads planner settings', () => {
    saveSettings({
      filters: {
        status: 'done',
        category: 'study',
        priority: 'low',
      },
      lastViewedDateISO: '2026-03-03',
    });

    const settings = loadSettings();

    expect(settings.filters.status).toBe('done');
    expect(settings.filters.category).toBe('study');
    expect(settings.filters.priority).toBe('low');
    expect(settings.lastViewedDateISO).toBe('2026-03-03');
  });
});
