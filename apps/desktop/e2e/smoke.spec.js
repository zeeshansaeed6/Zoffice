import { test, expect, _electron as electron } from '@playwright/test'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

test.describe('Zoffice Electron Smoke Tests', () => {
  /** @type {import('@playwright/test').ElectronApplication} */
  let electronApp
  /** @type {import('@playwright/test').Page} */
  let page

  const launchApp = async () => {
    const app = await electron.launch({
      args: [resolve('.')],
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    })
    const win = await app.firstWindow()
    await win.waitForLoadState('domcontentloaded')
    return { app, win }
  }

  test.beforeEach(async () => {
    const instance = await launchApp()
    electronApp = instance.app
    page = instance.win
  })

  test.afterEach(async () => {
    if (electronApp) {
      await electronApp.close()
    }
  })

  test('app launches, displays start screen, captures screenshot, and opens ZWriter, ZSheets, and ZSlides', async () => {
    // 1. Verify start screen is displayed
    const startScreen = page.locator('[data-testid="start-screen"]')
    await expect(startScreen).toBeVisible()
    await expect(page.getByText('Zoffice')).toBeVisible()

    // Capture screenshot to docs/screenshots/start-screen.png
    const screenshotPath = resolve(__dirname, '../../../docs/screenshots/start-screen.png')
    await page.screenshot({ path: screenshotPath })
    expect(existsSync(screenshotPath)).toBe(true)

    // 2. Open ZWriter tab
    const writerTile = page.getByRole('button', { name: /ZWriter/i })
    await expect(writerTile).toBeVisible()
    await writerTile.click()

    await expect(page.getByRole('tab', { name: /Document 1/i })).toBeVisible()
    const ribbon = page.locator('[data-testid="ribbon"]')
    await expect(ribbon).toBeVisible()
    await expect(page.locator('[data-testid="zwriter-app"]')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Document editor' })).toBeVisible()

    // 3. Return to Start Screen and open ZSheets tab
    await page.getByRole('button', { name: 'Start Screen' }).click()
    const sheetsTile = page.getByRole('button', { name: /ZSheets/i })
    await sheetsTile.click()

    await expect(page.getByRole('tab', { name: /Workbook 1/i })).toBeVisible()
    await expect(page.locator('[data-testid="zsheets-app"]')).toBeVisible()
    await expect(ribbon).toBeVisible()

    // 4. Return to Start Screen and open ZSlides tab
    await page.getByRole('button', { name: 'Start Screen' }).click()
    const slidesTile = page.getByRole('button', { name: /ZSlides/i })
    await slidesTile.click()

    await expect(page.getByRole('tab', { name: /Presentation 1/i })).toBeVisible()
    await expect(page.locator('[data-testid="zslides-app"]')).toBeVisible()
    await expect(ribbon).toBeVisible()
  })

  test('better-sqlite3 loads in Electron main process and persists recent file across restart', async () => {
    // Add a recent file via Electron IPC bridge backed by SQLite
    const testFile = {
      filePath: 'C:/docs/sqlite-test-doc.docx',
      title: 'SQLite Verified Doc',
      appId: 'writer',
    }

    const added = await page.evaluate(async (item) => {
      return await window.zofficeAPI.recent.add(item)
    }, testFile)
    expect(added).toBe(true)

    // Query immediate list
    const initialList = await page.evaluate(async () => {
      return await window.zofficeAPI.recent.list(10)
    })
    const foundInitial = initialList.some((f) => f.filePath === testFile.filePath)
    expect(foundInitial).toBe(true)

    // Restart Electron App to prove persistence in SQLite
    await electronApp.close()
    const restarted = await launchApp()
    electronApp = restarted.app
    page = restarted.win

    // Query after restart
    const persistedList = await page.evaluate(async () => {
      return await window.zofficeAPI.recent.list(10)
    })
    const persistedItem = persistedList.find((f) => f.filePath === testFile.filePath)
    expect(persistedItem).toBeDefined()
    expect(persistedItem.title).toBe(testFile.title)

    // Also verify it renders on the Start Screen
    await expect(page.getByText('SQLite Verified Doc')).toBeVisible()

    // Clean up
    await page.evaluate(async () => {
      await window.zofficeAPI.recent.clear()
    })
  })

  test('theme toggle switches and persists across restart', async () => {
    // Open a document to access the QuickAccessToolbar
    await page.getByRole('button', { name: /ZWriter/i }).click()
    const qat = page.locator('[data-testid="quick-access-toolbar"]')
    await expect(qat).toBeVisible()

    const html = page.locator('html')
    const initialClass = (await html.getAttribute('class')) || ''
    const initiallyDark = initialClass.includes('dark')

    // Find and click the theme toggle button
    const toggleBtn = qat.getByRole('button', { name: /Switch to/i })
    await toggleBtn.click()

    // Verify theme inverted
    if (initiallyDark) {
      await expect(html).not.toHaveClass(/dark/)
    } else {
      await expect(html).toHaveClass(/dark/)
    }

    // Restart Electron App to verify persistence
    await electronApp.close()
    const restarted = await launchApp()
    electronApp = restarted.app
    page = restarted.win

    const restartedHtml = page.locator('html')
    if (initiallyDark) {
      await expect(restartedHtml).not.toHaveClass(/dark/)
    } else {
      await expect(restartedHtml).toHaveClass(/dark/)
    }

    // Restore original theme
    await page.getByRole('button', { name: /ZWriter/i }).click()
    const restoredToggleBtn = page
      .locator('[data-testid="quick-access-toolbar"]')
      .getByRole('button', { name: /Switch to/i })
    await restoredToggleBtn.click()
  })

  test('closing a tab with unsaved changes shows confirmation dialog', async () => {
    // 1. Open ZWriter tab
    await page.getByRole('button', { name: /ZWriter/i }).click()
    const tab = page.getByRole('tab', { name: /Document 1/i })
    await expect(tab).toBeVisible()

    // 2. Type into the document editor to make it dirty
    const textarea = page.getByRole('textbox', { name: 'Document editor' })
    await textarea.fill('Modifying document content to mark as dirty')

    // 3. Attempt to close the tab
    const closeBtn = page.getByRole('button', { name: /Close Document 1/i })
    await closeBtn.click()

    // 4. Verify confirmation dialog appears
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Save Changes')).toBeVisible()
    await expect(dialog.getByText(/Do you want to save the changes/i)).toBeVisible()

    // 5. Click "Don't Save" to discard and close
    const dontSaveBtn = dialog.getByRole('button', { name: "Don't Save" })
    await dontSaveBtn.click()

    // 6. Verify tab is closed and start screen returns
    await expect(tab).not.toBeVisible()
    await expect(page.locator('[data-testid="start-screen"]')).toBeVisible()
  })

  test('tabs can be drag-reordered', async () => {
    // Open two tabs: Document 1 and Workbook 1
    await page.getByRole('button', { name: /ZWriter/i }).click()
    await page.getByRole('button', { name: 'Start Screen' }).click()
    await page.getByRole('button', { name: /ZSheets/i }).click()

    const tabs = page.locator('[data-testid="tab-bar"] [role="tab"]')
    await expect(tabs).toHaveCount(2)
    await expect(tabs.nth(0)).toContainText('Document 1')
    await expect(tabs.nth(1)).toContainText('Workbook 1')

    // Drag tab 0 to tab 1
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer())
    await tabs.nth(0).dispatchEvent('dragstart', { dataTransfer })
    await tabs.nth(1).dispatchEvent('dragover', { dataTransfer })
    await tabs.nth(1).dispatchEvent('drop', { dataTransfer })

    // Verify tabs have reordered
    await expect(tabs.nth(0)).toContainText('Workbook 1')
    await expect(tabs.nth(1)).toContainText('Document 1')
  })

  test('offline check: zero external network requests are made during runtime', async () => {
    /** @type {string[]} */
    const remoteRequests = []
    page.on('request', (request) => {
      const url = request.url()
      if (url.startsWith('http://') || url.startsWith('https://')) {
        remoteRequests.push(url)
      }
    })

    // Navigate through start screen and open documents
    await page.getByRole('button', { name: /ZWriter/i }).click()
    await page.getByRole('button', { name: 'Start Screen' }).click()
    await page.getByRole('button', { name: /ZSheets/i }).click()

    expect(remoteRequests).toHaveLength(0)
  })
})
