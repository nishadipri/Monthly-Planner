'use client';

import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants';
import type { TaskFilters } from '@/types/task';

interface FiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  return (
    <section className="filters" aria-label="Task filters">
      <label>
        Status
        <select
          value={filters.status ?? 'all'}
          onChange={(event) => onChange({ ...filters, status: event.target.value as TaskFilters['status'] })}
          data-testid="filter-status"
        >
          <option value="all">All</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <label>
        Category
        <select
          value={filters.category ?? 'all'}
          onChange={(event) => onChange({ ...filters, category: event.target.value as TaskFilters['category'] })}
          data-testid="filter-category"
        >
          <option value="all">All</option>
          {TASK_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </label>

      <label>
        Priority
        <select
          value={filters.priority ?? 'all'}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFilters['priority'] })}
          data-testid="filter-priority"
        >
          <option value="all">All</option>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className="ghostButton"
        onClick={() =>
          onChange({
            status: 'all',
            category: 'all',
            priority: 'all',
          })
        }
      >
        Clear filters
      </button>
    </section>
  );
}
