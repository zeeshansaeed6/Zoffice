import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('ZDrive E2E Tests', () => {
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

  test('opens ZDrive from start screen, interacts with navigation, views, new folder and storage', async () => {
    const driveTile = page.getByRole('button', { name: /ZDrive/i })
    await expect(driveTile).toBeVisible()
    await driveTile.click()

    // Tab opens
    await expect(page.getByRole('tab', { name: /Drive/i })).toBeVisible()

    // ZDrive composite app mounts
    const driveApp = page.locator('[data-testid="zdrive-app"]')
    await expect(driveApp).toBeVisible()

    // Default folders and documents exist
    await expect(page.getByText('Documents')).toBeVisible()
    await expect(page.getByText('Projects')).toBeVisible()

    // Switch view to List
    const listViewBtn = page.getByTitle('List view')
    await expect(listViewBtn).toBeVisible()
    await listViewBtn.click()

    // Check table headers
    await expect(page.getByRole('cell', { name: 'Quarterly Report.docx' })).toBeVisible()

    // Open Storage Analytics section
    const storageNavBtn = page.getByRole('button', { name: 'Storage' })
    await expect(storageNavBtn).toBeVisible()
    await storageNavBtn.click()

    await expect(page.getByText('Total Storage Used')).toBeVisible()
    await expect(page.getByText('Storage Distribution')).toBeVisible()

    // Navigate back to My Drive
    const myDriveBtn = page.getByRole('button', { name: 'My Drive' })
    await expect(myDriveBtn).toBeVisible()
    await myDriveBtn.click()

    // Open New Folder Modal
    const newFolderBtn = page.getByRole('button', { name: /New Folder/i }).first()
    await expect(newFolderBtn).toBeVisible()
    await newFolderBtn.click()

    await expect(page.getByRole('heading', { name: 'New Folder' })).toBeVisible()

    // Close modal
    const cancelBtn = page.getByRole('button', { name: 'Cancel' })
    await cancelBtn.click()
    await expect(page.getByRole('heading', { name: 'New Folder' })).not.toBeVisible()
  })
})
