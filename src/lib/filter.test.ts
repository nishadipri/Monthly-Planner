import { describe, expect, it } from 'vitest';
import { filterTasks } from '@/lib/filter';
import type { Task } from '@/types/task';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Deep work block',
    dateISO: '2026-01-02',
    category: 'work',
    priority: 'high',
    status: 'todo',
    notes: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Read chapter',
    dateISO: '2026-01-02',
    category: 'study',
    priority: 'medium',
    status: 'done',
    notes: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('filterTasks', () => {
  it('returns all tasks when filters are all', () => {
    expect(filterTasks(tasks, { status: 'all', category: 'all', priority: 'all' })).toHaveLength(2);
  });

  it('filters by status + category + priority', () => {
    const filtered = filterTasks(tasks, {
      status: 'todo',
      category: 'work',
      priority: 'high',
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });
});
