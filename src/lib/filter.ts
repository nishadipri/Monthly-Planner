import type { Task, TaskFilters } from '@/types/task';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    const statusMatches = !filters.status || filters.status === 'all' || task.status === filters.status;
    const categoryMatches =
      !filters.category || filters.category === 'all' || task.category === filters.category;
    const priorityMatches =
      !filters.priority || filters.priority === 'all' || task.priority === filters.priority;

    return statusMatches && categoryMatches && priorityMatches;
  });
}
