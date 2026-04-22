'use client';

import { useEffect, useMemo, useState } from 'react';
import { filterTasks } from '@/lib/filter';
import { fromDateISO, getMonthLabel, toDateISO } from '@/lib/date';
import { createTask, loadSettings, loadTasksWithMigration, saveSettings, saveTasks } from '@/lib/storage';
import type { MigrationResult, Task, TaskFilters, TaskInput } from '@/types/task';

export function usePlanner() {
  const [isReady, setIsReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    category: 'all',
    priority: 'all',
  });
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateISO, setSelectedDateISO] = useState(() => toDateISO(new Date()));
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationResult>({
    migratedCount: 0,
    sourceVersion: 'v2',
  });

  useEffect(() => {
    const loaded = loadTasksWithMigration();
    const loadedSettings = loadSettings();

    setTasks(loaded.tasks);
    setMigrationResult(loaded.migrationResult);
    setFilters(loadedSettings.filters);

    const parsedDate = fromDateISO(loadedSettings.lastViewedDateISO);
    setVisibleMonth(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
    setSelectedDateISO(loadedSettings.lastViewedDateISO);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveTasks(tasks);
  }, [isReady, tasks]);

  useEffect(() => {
    if (!isReady) return;

    saveSettings({
      filters,
      lastViewedDateISO: selectedDateISO,
    });
  }, [isReady, filters, selectedDateISO]);

  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  const tasksByDate = useMemo(() => {
    return filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
      if (!acc[task.dateISO]) {
        acc[task.dateISO] = [];
      }
      acc[task.dateISO].push(task);
      return acc;
    }, {});
  }, [filteredTasks]);

  const editingTask = useMemo(() => {
    if (!editingTaskId) return null;
    return tasks.find((task) => task.id === editingTaskId) ?? null;
  }, [editingTaskId, tasks]);

  const monthLabel = useMemo(
    () => getMonthLabel(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth]
  );

  function changeMonth(offset: number): void {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
    setVisibleMonth(nextMonth);

    const nextSelected = toDateISO(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
    setSelectedDateISO(nextSelected);
    setEditingTaskId(null);
  }

  function resetToCurrentMonth(): void {
    const now = new Date();
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateISO(toDateISO(now));
    setEditingTaskId(null);
  }

  function selectDate(dateISO: string): void {
    setSelectedDateISO(dateISO);
    setEditingTaskId(null);
  }

  function startEditingTask(taskId: string): void {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    setSelectedDateISO(task.dateISO);
    setEditingTaskId(task.id);
  }

  function cancelForm(): void {
    setEditingTaskId(null);
  }

  function toggleTaskComplete(taskId: string): void {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done', updatedAt: new Date().toISOString() }
          : task
      )
    );
  }

  function removeTask(taskId: string): void {
    setTasks((current) => current.filter((task) => task.id !== taskId));

    if (editingTaskId === taskId) {
      setEditingTaskId(null);
    }
  }

  function saveTask(input: TaskInput): void {
    if (editingTaskId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...input,
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );
      setEditingTaskId(null);
      setSelectedDateISO(input.dateISO);
      return;
    }

    const newTask = createTask(input);

    setTasks((current) => [...current, newTask]);
    setSelectedDateISO(newTask.dateISO);
  }

  return {
    isReady,
    tasks,
    tasksByDate,
    filteredTasks,
    filters,
    selectedDateISO,
    visibleMonth,
    monthLabel,
    editingTask,
    migrationResult,
    setFilters,
    changeMonth,
    resetToCurrentMonth,
    selectDate,
    startEditingTask,
    cancelForm,
    removeTask,
    saveTask,
    toggleTaskComplete,
  };
}
