import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('ZBase E2E Tests', () => {
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

  test('opens ZBase from start screen, switches views, opens SQL console and field modal', async () => {
    const baseTile = page.getByRole('button', { name: /ZBase/i })
    await expect(baseTile).toBeVisible()
    await baseTile.click()

    // Tab opens
    await expect(page.getByRole('tab', { name: /Database/i })).toBeVisible()

    // ZBase composite app mounts
    const baseApp = page.locator('[data-testid="zbase-app"]')
    await expect(baseApp).toBeVisible()

    // Default tables and views exist
    await expect(page.getByRole('button', { name: 'Projects' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Team' })).toBeVisible()

    // Switch view to Kanban
    const kanbanBtn = page.getByRole('button', { name: /Status Board/i })
    if (await kanbanBtn.isVisible()) {
      await kanbanBtn.click()
      await expect(page.getByText('Planned')).toBeVisible()
      await expect(page.getByText('Active')).toBeVisible()
    }

    // Open SQL Console
    const sqlBtn = page.getByRole('button', { name: /SQL Console/i }).first()
    await expect(sqlBtn).toBeVisible()
    await sqlBtn.click()

    await expect(page.getByText('ZBase SQL Console')).toBeVisible()
    await expect(page.getByRole('button', { name: /Run Query/i })).toBeVisible()
    await page.getByRole('button', { name: /Run Query/i }).click()

    // Results table appears
    await expect(page.getByText(/row\(s\) returned/i)).toBeVisible()

    // Close SQL Console
    const closeBtn = page.locator('button:has(svg.lucide-x)')
    await closeBtn.click()
    await expect(page.getByText('ZBase SQL Console')).not.toBeVisible()

    // Open Add Field Modal
    const addFieldBtn = page.getByRole('button', { name: /Add Field/i }).first()
    if (await addFieldBtn.isVisible()) {
      await addFieldBtn.click()
      await expect(page.getByText('Add New Field')).toBeVisible()
    }
  })
})
