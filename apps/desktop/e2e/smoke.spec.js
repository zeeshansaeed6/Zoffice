import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('Zoffice Electron Smoke Test', () => {
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

  test('app launches, displays start screen, and opens a ZWriter tab', async () => {
    // 1. Verify start screen is displayed
    const startScreen = page.locator('[data-testid="start-screen"]')
    await expect(startScreen).toBeVisible()

    // 2. Verify Zoffice branding and app tiles
    await expect(page.getByText('Zoffice')).toBeVisible()
    const writerTile = page.getByRole('button', { name: /ZWriter/i })
    await expect(writerTile).toBeVisible()

    // 3. Click ZWriter tile to create a new document
    await writerTile.click()

    // 4. Verify ZWriter tab is opened and active
    const tabBar = page.locator('[data-testid="tab-bar"]')
    await expect(tabBar).toBeVisible()
    await expect(page.getByRole('tab', { name: /Document 1/i })).toBeVisible()

    // 5. Verify Ribbon component is rendered with Home tab
    const ribbon = page.locator('[data-testid="ribbon"]')
    await expect(ribbon).toBeVisible()
    await expect(ribbon.getByText('Home')).toBeVisible()

    // 6. Verify Status Bar is present
    const statusBar = page.locator('[data-testid="status-bar"]')
    await expect(statusBar).toBeVisible()
    await expect(page.getByText(/words/i)).toBeVisible()
  })
})
