'use client';

import { CalendarGrid } from '@/components/planner/calendar-grid';
import { FiltersBar } from '@/components/planner/filters-bar';
import { OfflineIndicator } from '@/components/planner/offline-indicator';
import { TaskForm } from '@/components/planner/task-form';
import { usePlanner } from '@/hooks/use-planner';

export function PlannerApp() {
  const {
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
  } = usePlanner();

  return (
    <main className="pageShell">
      <section className="heroPanel">
        <div className="heroContent">
          <p className="heroEyebrow">Monthly Planner</p>
          <h1>Organize, Prioritize, Succeed</h1>
          <p>
            Your planner is now local-first and modernized with quick filtering, better task workflows, and offline-safe
            basics.
          </p>
          <OfflineIndicator />
        </div>
      </section>

      <section className="plannerPanel">
        <header className="plannerHeader">
          <div>
            <p className="subtle">Focused month view</p>
            <h2>{monthLabel}</h2>
            <p className="subtle" data-testid="task-count">
              {filteredTasks.length} filtered / {tasks.length} total
            </p>
          </div>

          <div className="navButtons" role="group" aria-label="Month navigation">
            <button type="button" className="ghostButton" onClick={() => changeMonth(-1)}>
              Previous
            </button>
            <button type="button" className="ghostButton" onClick={resetToCurrentMonth}>
              Today
            </button>
            <button type="button" className="ghostButton" onClick={() => changeMonth(1)}>
              Next
            </button>
          </div>
        </header>

        <FiltersBar filters={filters} onChange={setFilters} />

        {!isReady ? (
          <p>Loading planner...</p>
        ) : (
          <div className="plannerGrid">
            <CalendarGrid
              year={visibleMonth.getFullYear()}
              monthIndex={visibleMonth.getMonth()}
              selectedDateISO={selectedDateISO}
              tasksByDate={tasksByDate}
              onSelectDate={selectDate}
              onEditTask={startEditingTask}
              onToggleComplete={toggleTaskComplete}
              onRemoveTask={removeTask}
            />

            <TaskForm
              selectedDateISO={selectedDateISO}
              editingTask={editingTask}
              onSave={saveTask}
              onDelete={removeTask}
              onCancelEdit={cancelForm}
            />
          </div>
        )}

        {migrationResult.sourceVersion === 'legacy_savedTasks' && migrationResult.migratedCount > 0 ? (
          <p className="migrationNote" data-testid="migration-note">
            Migrated {migrationResult.migratedCount} legacy task{migrationResult.migratedCount > 1 ? 's' : ''} from
            the previous version.
          </p>
        ) : null}
      </section>
    </main>
  );
}
