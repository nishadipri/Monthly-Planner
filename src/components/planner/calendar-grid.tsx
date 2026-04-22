'use client';

import { WEEKDAY_LABELS_MONDAY_FIRST } from '@/lib/constants';
import { getMonthMatrix } from '@/lib/date';
import type { Task } from '@/types/task';

interface CalendarGridProps {
  year: number;
  monthIndex: number;
  selectedDateISO: string;
  tasksByDate: Record<string, Task[]>;
  onSelectDate: (dateISO: string) => void;
  onEditTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
}

export function CalendarGrid({
  year,
  monthIndex,
  selectedDateISO,
  tasksByDate,
  onSelectDate,
  onEditTask,
  onToggleComplete,
  onRemoveTask,
}: CalendarGridProps) {
  const matrix = getMonthMatrix(year, monthIndex);

  return (
    <section className="calendar" aria-label="Monthly calendar">
      <div className="weekdayRow">
        {WEEKDAY_LABELS_MONDAY_FIRST.map((label) => (
          <div key={label} className="weekdayCell">
            {label}
          </div>
        ))}
      </div>

      <div className="calendarBody">
        {matrix.map((week) =>
          week.map((day) => {
            const tasks = tasksByDate[day.dateISO] ?? [];
            const isSelected = day.dateISO === selectedDateISO;

            return (
              <article
                key={day.dateISO}
                role="button"
                tabIndex={0}
                aria-label={`${day.dateISO}${day.isToday ? ', today' : ''}, ${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
                aria-pressed={isSelected}
                className={`dayCell ${day.inCurrentMonth ? '' : 'isMuted'} ${day.isToday ? 'isToday' : ''} ${isSelected ? 'isSelected' : ''}`}
                onClick={() => onSelectDate(day.dateISO)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDate(day.dateISO);
                  }
                }}
                data-testid={`day-${day.dateISO}`}
              >
                <header className="dayHeader">
                  <span>{day.dayNumber}</span>
                  {tasks.length > 0 ? <small>{tasks.length} task{tasks.length > 1 ? 's' : ''}</small> : null}
                </header>

                <ul className="dayTaskList">
                  {tasks.map((task) => (
                    <li key={task.id} className={`taskChip status-${task.status} priority-${task.priority}`}>
                      <button
                        type="button"
                        className="taskChipToggle"
                        aria-label={task.status === 'done' ? 'Mark incomplete' : 'Mark complete'}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(task.id);
                        }}
                      >
                        {task.status === 'done' ? '✓' : '○'}
                      </button>
                      <button
                        type="button"
                        className="taskChipTitle"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task.id);
                        }}
                        data-testid={`task-item-${task.id}`}
                      >
                        {task.title}
                      </button>
                      <button
                        type="button"
                        className="taskChipDelete"
                        aria-label={`Delete ${task.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveTask(task.id);
                        }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
