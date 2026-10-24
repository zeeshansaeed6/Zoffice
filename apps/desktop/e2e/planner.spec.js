import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('ZPlanner E2E Tests', () => {
  /** @type {import('@playwright/test').ElectronApplication} */
  let electronApp
  /** @type {import('@playwright/test').Page} */
  let page

  test.beforeEach(async () => {
    electronApp = await electron.launch({
      args: [resolve('.')],
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    })
    page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
  })

  test.afterEach(async () => {
    if (electronApp) {
      await electronApp.close()
    }
  })

  test('opens ZPlanner from start screen, interacts with Kanban, switches to Gantt and Calendar', async () => {
    const plannerTile = page.getByRole('button', { name: /ZPlanner/i })
    await expect(plannerTile).toBeVisible()
    await plannerTile.click()

    // Tab opens
    await expect(page.getByRole('tab', { name: /Project Board/i })).toBeVisible()

    // ZPlanner composite app mounts
    const plannerApp = page.locator('[data-testid="zplanner-app"]')
    await expect(plannerApp).toBeVisible()

    // Check default columns in Kanban
    await expect(page.getByText('TO DO')).toBeVisible()
    await expect(page.getByText('IN PROGRESS')).toBeVisible()
    await expect(page.getByText('DONE')).toBeVisible()

    // Switch to Gantt view
    const ganttTab = page.locator('[data-testid="tab-gantt"]')
    await expect(ganttTab).toBeVisible()
    await ganttTab.click()

    // Verify Gantt timeline header is visible
    await expect(page.getByText(/Timeline \(/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /day/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /week/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /month/i })).toBeVisible()

    // Switch to Calendar view
    const calTab = page.locator('[data-testid="tab-calendar"]')
    await expect(calTab).toBeVisible()
    await calTab.click()

    // Verify Calendar view controls
    await expect(page.getByRole('button', { name: 'Today' })).toBeVisible()
    await expect(page.getByText('Mon')).toBeVisible()
    await expect(page.getByText('Fri')).toBeVisible()

    // Switch back to Kanban
    const kanbanTab = page.locator('[data-testid="tab-kanban"]')
    await expect(kanbanTab).toBeVisible()
    await kanbanTab.click()

    // Click starter task to open detail modal
    const taskCard = page.getByText('Architect offline storage pipeline')
    await expect(taskCard).toBeVisible()
    await taskCard.click()

    // Detail modal opens
    await expect(page.getByRole('button', { name: 'Done' })).toBeVisible()
    await expect(page.getByText('Checklist')).toBeVisible()
    await expect(page.getByText('Dependencies (Predecessors)')).toBeVisible()

    // Close modal
    await page.getByRole('button', { name: 'Done' }).click()
    await expect(page.getByRole('button', { name: 'Done' })).not.toBeVisible()
  })
})
