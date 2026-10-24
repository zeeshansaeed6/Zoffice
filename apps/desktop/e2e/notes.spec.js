import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('ZNotes E2E Tests', () => {
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

  test('opens ZNotes from start screen and displays canvas with sidebar and ribbon', async () => {
    const notesTile = page.getByRole('button', { name: /ZNotes/i })
    await expect(notesTile).toBeVisible()
    await notesTile.click()

    // Tab opens
    await expect(page.getByRole('tab', { name: /Notebook 1/i })).toBeVisible()

    // ZNotes app mounts
    const notesApp = page.locator('[data-testid="znotes-app"]')
    await expect(notesApp).toBeVisible()

    // Ribbon tabs are available
    await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Insert' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Draw & Sketch' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Tools & Export' })).toBeVisible()

    // Sidebar shows default notebook
    await expect(page.getByText('Notebooks')).toBeVisible()
    await expect(page.getByText('My Notebook')).toBeVisible()

    // Canvas shows initial block
    await expect(page.getByText(/Welcome to ZNotes/i)).toBeVisible()
  })
})
