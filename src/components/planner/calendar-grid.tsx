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
}

export function CalendarGrid({
  year,
  monthIndex,
  selectedDateISO,
  tasksByDate,
  onSelectDate,
  onEditTask,
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
                className={`dayCell ${day.inCurrentMonth ? '' : 'isMuted'} ${day.isToday ? 'isToday' : ''} ${isSelected ? 'isSelected' : ''}`}
                onClick={() => onSelectDate(day.dateISO)}
                data-testid={`day-${day.dateISO}`}
              >
                <header className="dayHeader">
                  <span>{day.dayNumber}</span>
                  {tasks.length > 0 ? <small>{tasks.length} task{tasks.length > 1 ? 's' : ''}</small> : null}
                </header>

                <ul className="dayTaskList">
                  {tasks.slice(0, 3).map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        className={`taskChip status-${task.status} priority-${task.priority}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditTask(task.id);
                        }}
                        data-testid={`task-item-${task.id}`}
                      >
                        {task.title}
                      </button>
                    </li>
                  ))}
                </ul>

                {tasks.length > 3 ? <p className="moreTasks">+{tasks.length - 3} more</p> : null}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
