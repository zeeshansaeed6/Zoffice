import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { existsSync, readFileSync, unlinkSync } from 'fs'

test.describe('ZSlides E2E Tests', () => {
  /** @type {import('@playwright/test').ElectronApplication} */
  let electronApp
  /** @type {import('@playwright/test').Page} */
  let page
  const pptxPath = resolve(tmpdir(), `zoffice-e2e-slides-${Date.now()}.pptx`)

  test.beforeEach(async () => {
    electronApp = await electron.launch({
      args: [resolve('.')],
      env: { ...process.env, NODE_ENV: 'test' },
    })
    page = await electronApp.firstWindow()
    await page.waitForLoadState('domcontentloaded')
  })

  test.afterEach(async () => {
    await electronApp?.close()
    if (existsSync(pptxPath)) unlinkSync(pptxPath)
  })

  test('edits slides with undo, speaker notes, and saves and reopens a real .pptx', async () => {
    await page.getByRole('button', { name: /ZSlides/i }).click()
    await expect(page.getByTestId('zslides-app')).toBeVisible()
    await expect(page.getByText(/Slide 1 of 1/)).toBeVisible()

    // Speaker notes
    await page.getByRole('button', { name: 'Notes', exact: true }).click()
    await page.getByLabel('Speaker notes').fill('Remember the demo')
    await expect(page.getByLabel('Speaker notes')).toHaveValue('Remember the demo')

    // New slide, then undo removes it and redo brings it back
    await page.getByRole('button', { name: 'New Slide' }).click()
    await expect(page.getByText(/Slide 2 of 2/)).toBeVisible()
    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(page.getByText(/Slide 1 of 1/)).toBeVisible()
    await page.getByRole('button', { name: 'Redo' }).click()
    await expect(page.getByText(/Slide 2 of 2/)).toBeVisible()

    // Save to a real .pptx file (native dialog stubbed to a temp path)
    await electronApp.evaluate(({ dialog }, target) => {
      dialog.showSaveDialog = async () => ({ canceled: false, filePath: target })
    }, pptxPath)
    await page.getByRole('button', { name: /^Save/ }).first().click()
    await expect.poll(() => existsSync(pptxPath)).toBe(true)
    const bytes = readFileSync(pptxPath)
    expect(bytes.subarray(0, 2).toString()).toBe('PK')
    expect(bytes.includes('ppt/slides/slide2.xml')).toBe(true)

    // Reopen the file from disk (Open dialog stubbed)
    await electronApp.evaluate(({ dialog }, target) => {
      dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [target] })
    }, pptxPath)
    await page.getByRole('button', { name: 'Start Screen' }).click()
    await page.getByRole('button', { name: /Open Existing/i }).click()
    await expect(page.getByText(/Slide 1 of 2/)).toBeVisible()
    await page.getByRole('button', { name: 'Notes', exact: true }).click()
    await expect(page.getByLabel('Speaker notes')).toHaveValue('Remember the demo')
  })
})
