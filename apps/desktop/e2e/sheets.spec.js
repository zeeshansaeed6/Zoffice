import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { existsSync, readFileSync, unlinkSync } from 'fs'

// Mirrors packages/sheets/src/core/grid-constants.js
const ROW_HEADER_WIDTH = 50
const COL_HEADER_HEIGHT = 26
const COL_WIDTH = 100
const ROW_HEIGHT = 24

test.describe('ZSheets E2E Tests', () => {
  /** @type {import('@playwright/test').ElectronApplication} */
  let electronApp
  /** @type {import('@playwright/test').Page} */
  let page
  const xlsxPath = resolve(tmpdir(), `zoffice-e2e-${Date.now()}.xlsx`)

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
    if (existsSync(xlsxPath)) unlinkSync(xlsxPath)
  })

  /** Clicks a grid cell (0-based) and commits a value through the formula bar. */
  const enterCell = async (row, col, text) => {
    const canvas = page.getByTestId('sheets-canvas')
    await canvas.click({
      position: {
        x: ROW_HEADER_WIDTH + col * COL_WIDTH + 10,
        y: COL_HEADER_HEIGHT + row * ROW_HEIGHT + 8,
      },
    })
    const bar = page.getByLabel('Formula Bar Input')
    await bar.fill(text)
    await bar.press('Enter')
  }

  const selectCell = (row, col) =>
    page.getByTestId('sheets-canvas').click({
      position: {
        x: ROW_HEADER_WIDTH + col * COL_WIDTH + 10,
        y: COL_HEADER_HEIGHT + row * ROW_HEIGHT + 8,
      },
    })

  test('recalculates dependents, formats, undoes, and saves a real .xlsx', async () => {
    await page.getByRole('button', { name: /ZSheets/i }).click()
    await expect(page.getByTestId('zsheets-app')).toBeVisible()

    await enterCell(0, 0, '5')
    await enterCell(1, 0, '7')
    await enterCell(2, 0, '=A1+A2')
    const stats = page.getByText(/Count: 1 \| Sum:/)
    await expect(stats).toContainText('Sum: 12')

    // Changing a precedent updates the dependent formula
    await enterCell(0, 0, '10')
    await selectCell(2, 0)
    await expect(stats).toContainText('Sum: 17')

    // Currency format changes the display, undo restores it
    await page.getByRole('button', { name: 'Currency' }).click()
    await expect(page.getByLabel('Formula Bar Input')).toHaveValue('=A1+A2')
    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(stats).toContainText('Sum: 17')

    // Save to a real .xlsx file (native dialog stubbed to a temp path)
    await electronApp.evaluate(({ dialog }, target) => {
      dialog.showSaveDialog = async () => ({ canceled: false, filePath: target })
    }, xlsxPath)
    await page.getByRole('button', { name: /^Save/ }).first().click()
    await expect.poll(() => existsSync(xlsxPath)).toBe(true)
    const bytes = readFileSync(xlsxPath)
    expect(bytes.subarray(0, 2).toString()).toBe('PK')
    expect(bytes.includes('xl/workbook.xml')).toBe(true)
  })

  test('opens an .xlsx file with formulas and values from disk', async () => {
    // Build the file through the app first
    await page.getByRole('button', { name: /ZSheets/i }).click()
    await enterCell(0, 0, '4')
    await enterCell(1, 0, '6')
    await enterCell(2, 0, '=SUM(A1:A2)')
    await electronApp.evaluate(({ dialog }, target) => {
      dialog.showSaveDialog = async () => ({ canceled: false, filePath: target })
    }, xlsxPath)
    await page.getByRole('button', { name: /^Save/ }).first().click()
    await expect.poll(() => existsSync(xlsxPath)).toBe(true)

    // Reopen it in a fresh tab via the Open dialog (stubbed)
    await electronApp.evaluate(({ dialog }, target) => {
      dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [target] })
    }, xlsxPath)
    await page.getByRole('button', { name: 'Start Screen' }).click()
    await page.getByRole('button', { name: /Open Existing/i }).click()
    await expect(page.getByTestId('zsheets-app')).toBeVisible()
    await selectCell(2, 0)
    await expect(page.getByLabel('Formula Bar Input')).toHaveValue('=SUM(A1:A2)')
    await expect(page.getByText(/Count: 1 \| Sum:/)).toContainText('Sum: 10')
  })
})
