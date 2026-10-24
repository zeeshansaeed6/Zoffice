import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('ZDraw E2E Tests', () => {
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

  test('opens ZDraw from start screen, interacts with shape library, canvas, and export', async () => {
    const drawTile = page.getByRole('button', { name: /ZDraw/i })
    await expect(drawTile).toBeVisible()
    await drawTile.click()

    // Tab opens
    await expect(page.getByRole('tab', { name: /Drawing/i })).toBeVisible()

    // ZDraw composite app mounts
    const drawApp = page.locator('[data-testid="zdraw-app"]')
    await expect(drawApp).toBeVisible()

    // Check Shape Library Panel tabs
    await expect(page.getByRole('button', { name: 'Flowchart' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Basic' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'UML' })).toBeVisible()

    // Add a basic shape by clicking
    await page.getByRole('button', { name: 'Basic' }).click()
    const rectShapeBtn = page.getByTitle(/Rectangle/i)
    await expect(rectShapeBtn).toBeVisible()
    await rectShapeBtn.click()

    // Verify properties panel updates with Shape Properties
    await expect(page.getByText('Shape Properties')).toBeVisible()
    await expect(page.getByText('Color Palette')).toBeVisible()

    // Switch to View & Export Ribbon Tab
    await page.getByRole('tab', { name: 'View & Export' }).click()
    const exportBtn = page.getByRole('button', { name: 'Export Image' })
    await expect(exportBtn).toBeVisible()
    await exportBtn.click()

    // Verify Export Modal opens with SVG, PNG, PDF options
    await expect(page.getByText('SVG Vector Graphic (.svg)')).toBeVisible()
    await expect(page.getByText('PNG Raster Image (.png)')).toBeVisible()
    await expect(page.getByText('PDF Document Print (.pdf)')).toBeVisible()
  })
})
