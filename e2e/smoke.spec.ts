import { expect, test } from '@playwright/test';

test('migrates legacy savedTasks on first load', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => {
    localStorage.removeItem('planner.tasks.v2');
    localStorage.removeItem('planner.settings.v1');
    localStorage.setItem(
      'savedTasks',
      JSON.stringify([
        {
          name: 'Legacy task',
          category: 'work',
          difficulty: 'easy',
          dueDate: Date.now(),
        },
      ])
    );
  });

  await page.reload();

  await expect(page.getByTestId('task-count')).toContainText('1 filtered / 1 total');

  const migratedLength = await page.evaluate(() => {
    const value = localStorage.getItem('planner.tasks.v2');
    if (!value) return 0;
    return JSON.parse(value).length;
  });

  expect(migratedLength).toBe(1);
});

test('persists created tasks after reload', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('task-input-title').fill('E2E persist task');
  await page.getByTestId('task-submit').click();

  await expect(page.getByText('E2E persist task')).toBeVisible();

  await page.reload();

  await expect(page.getByText('E2E persist task')).toBeVisible();
});

test('shows offline indicator when browser goes offline', async ({ context, page }) => {
  await page.goto('/');
  await expect(page.getByText('Online')).toBeVisible();

  await context.setOffline(true);
  await expect(page.getByText('Offline mode: local edits are still available')).toBeVisible();

  await context.setOffline(false);
});
