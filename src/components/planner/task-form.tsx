'use client';

import { useEffect, useMemo, useState } from 'react';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants';
import type { Task, TaskInput } from '@/types/task';

interface TaskFormProps {
  selectedDateISO: string;
  editingTask: Task | null;
  onSave: (task: TaskInput) => void;
  onDelete: (taskId: string) => void;
  onCancelEdit: () => void;
}

const defaultTaskInput: TaskInput = {
  title: '',
  dateISO: '',
  category: 'other',
  priority: 'medium',
  status: 'todo',
  notes: '',
};

export function TaskForm({ selectedDateISO, editingTask, onSave, onDelete, onCancelEdit }: TaskFormProps) {
  const [formState, setFormState] = useState<TaskInput>(() => ({
    ...defaultTaskInput,
    dateISO: selectedDateISO,
  }));

  const mode = editingTask ? 'edit' : 'create';

  useEffect(() => {
    if (editingTask) {
      setFormState({
        title: editingTask.title,
        dateISO: editingTask.dateISO,
        category: editingTask.category,
        priority: editingTask.priority,
        status: editingTask.status,
        notes: editingTask.notes,
      });
      return;
    }

    setFormState((current) => ({
      ...current,
      title: '',
      notes: '',
      dateISO: selectedDateISO,
      category: 'other',
      priority: 'medium',
      status: 'todo',
    }));
  }, [editingTask, selectedDateISO]);

  const formattedSelectedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(new Date(`${selectedDateISO}T12:00:00`)),
    [selectedDateISO]
  );

  function updateField<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = formState.title.trim();
    if (!trimmedTitle) return;

    onSave({
      ...formState,
      title: trimmedTitle,
      notes: formState.notes.trim(),
    });
  }

  return (
    <section className="taskPanel" aria-label="Task editor">
      <div className="taskPanelHeader">
        <h2>{mode === 'edit' ? 'Edit Task' : 'Create Task'}</h2>
        <p>{formattedSelectedDate}</p>
      </div>

      <form onSubmit={submit} className="taskForm">
        <label>
          Title
          <input
            type="text"
            required
            value={formState.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Add a meaningful task"
            data-testid="task-input-title"
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={formState.dateISO}
            onChange={(event) => updateField('dateISO', event.target.value)}
            data-testid="task-input-date"
          />
        </label>

        <label>
          Category
          <select
            value={formState.category}
            onChange={(event) => updateField('category', event.target.value as TaskInput['category'])}
            data-testid="task-input-category"
          >
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
            value={formState.priority}
            onChange={(event) => updateField('priority', event.target.value as TaskInput['priority'])}
            data-testid="task-input-priority"
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select
            value={formState.status}
            onChange={(event) => updateField('status', event.target.value as TaskInput['status'])}
            data-testid="task-input-status"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Notes
          <textarea
            value={formState.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            rows={4}
            placeholder="Optional notes"
            data-testid="task-input-notes"
          />
        </label>

        <div className="taskActions">
          <button type="submit" className="primaryButton" data-testid="task-submit">
            {mode === 'edit' ? 'Save changes' : 'Add task'}
          </button>

          {mode === 'edit' ? (
            <>
              <button type="button" className="ghostButton" onClick={onCancelEdit}>
                Cancel edit
              </button>
              <button
                type="button"
                className="dangerButton"
                onClick={() => {
                  if (editingTask) {
                    onDelete(editingTask.id);
                  }
                }}
                data-testid="task-delete"
              >
                Delete task
              </button>
            </>
          ) : null}
        </div>
      </form>
    </section>
  );
}
