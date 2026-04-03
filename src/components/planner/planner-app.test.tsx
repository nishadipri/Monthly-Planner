import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '@/lib/constants';
import { PlannerApp } from '@/components/planner/planner-app';

beforeEach(() => {
  window.localStorage.clear();
});

describe('PlannerApp', () => {
  it('creates, edits, and deletes a task', async () => {
    const user = userEvent.setup();
    render(<PlannerApp />);

    await screen.findByTestId('task-count');

    await user.type(screen.getByTestId('task-input-title'), 'Write project notes');
    await user.click(screen.getByTestId('task-submit'));

    await waitFor(() => {
      expect(screen.getByText('Write project notes')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Write project notes'));
    const titleInput = screen.getByTestId('task-input-title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Write clean architecture notes');
    await user.click(screen.getByTestId('task-submit'));

    await waitFor(() => {
      expect(screen.getByText('Write clean architecture notes')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Write clean architecture notes'));
    await user.click(screen.getByTestId('task-delete'));

    await waitFor(() => {
      expect(screen.queryByText('Write clean architecture notes')).not.toBeInTheDocument();
    });
  });

  it('filters tasks by status', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.tasks,
      JSON.stringify([
        {
          id: '1',
          title: 'Todo task',
          dateISO: '2026-01-15',
          category: 'work',
          priority: 'high',
          status: 'todo',
          notes: '',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Done task',
          dateISO: '2026-01-15',
          category: 'study',
          priority: 'low',
          status: 'done',
          notes: '',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ])
    );

    const user = userEvent.setup();
    render(<PlannerApp />);

    await screen.findByTestId('task-count');
    await user.selectOptions(screen.getByTestId('filter-status'), 'done');

    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1 filtered / 2 total');
    });
  });

  it('navigates month boundaries across years', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({
        filters: {
          status: 'all',
          category: 'all',
          priority: 'all',
        },
        lastViewedDateISO: '2026-01-15',
      })
    );

    const user = userEvent.setup();
    render(<PlannerApp />);

    await screen.findByText('January 2026');

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(await screen.findByText('December 2025')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('January 2026')).toBeInTheDocument();
  });
});
