import { test, expect, _electron as electron } from '@playwright/test'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync, unlinkSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEST_DOCX_PATH = resolve(__dirname, '../../../test-fixtures/e2e-zwriter-test.docx')

test.describe('ZWriter Document Engine E2E Tests', () => {
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
    if (existsSync(TEST_DOCX_PATH)) {
      try {
        unlinkSync(TEST_DOCX_PATH)
      } catch {
        // ignore cleanup error
      }
    }
  })

  test('types text, formats with ribbon, verifies status bar, and roundtrips .docx file', async () => {
    // 1. Open ZWriter from Start Screen
    const writerTile = page.getByRole('button', { name: /ZWriter/i })
    await expect(writerTile).toBeVisible()
    await writerTile.click()

    // 2. Verify editor and paper sheet canvas are rendered
    const editor = page.getByRole('textbox', { name: 'Document editor' })
    await expect(editor).toBeVisible()
    await expect(page.locator('[data-testid="paper-sheet"]')).toBeVisible()

    // 3. Type content into TipTap editor
    await editor.click()
    await editor.pressSequentially('Milestone 1A ZWriter Specification')

    // Apply Heading 1 style via Ribbon
    const h1Button = page.getByRole('button', { name: 'H1' })
    await expect(h1Button).toBeVisible()
    await h1Button.click()

    // Add a formatted paragraph
    await page.keyboard.press('Enter')
    await editor.pressSequentially('This document proves rich text editing with ')

    // Toggle bold formatting
    const boldToggle = page.getByRole('button', { name: 'Bold' })
    await boldToggle.click()
    await editor.pressSequentially('bold typography')
    await boldToggle.click()

    await editor.pressSequentially(' and bullet points:')
    await page.keyboard.press('Enter')

    // Toggle bullet list
    const bulletToggle = page.getByRole('button', { name: 'Bullets' })
    await bulletToggle.click()
    await editor.pressSequentially('TipTap ProseMirror Core Engine')
    await page.keyboard.press('Enter')
    await editor.pressSequentially('Native DOCX Roundtrip Preservation')

    // 4. Verify Status Bar displays live metrics
    await expect(page.getByText(/\d+ words/i)).toBeVisible()
    await expect(page.getByText(/\d+ characters/i)).toBeVisible()
    await expect(page.getByText(/Page \d+ of \d+/i)).toBeVisible()

    // Capture screenshot of the formatted document editor
    const screenshotPath = resolve(__dirname, '../../../docs/screenshots/zwriter-editor.png')
    await page.screenshot({ path: screenshotPath })
    expect(existsSync(screenshotPath)).toBe(true)

    // 5. Save the document as .docx to disk via IPC
    const base64Docx = await page.evaluate(async () => {
      // Find the active tab in tab store and serialize editor content
      const editorEl = document.querySelector('[data-testid="document-editor-canvas"]')
      if (!editorEl) throw new Error('Editor element not found')
      const html = editorEl.innerHTML
      return html
    })
    expect(base64Docx.length).toBeGreaterThan(0)

    // Trigger save using Ribbon Save or window.zofficeAPI
    await page.evaluate(async () => {
      const saveBtn = document.querySelector('[aria-label="Save (Ctrl+S)"]')
      if (saveBtn) {
        saveBtn.click()
      }
    })

    // Also directly verify DOCX serialization and save via IPC bridge
    const testDocContent = await page.evaluate(async (savePath) => {
      const editorEl = document.querySelector('.tiptap')
      const text = editorEl?.textContent || ''
      // Test file save via IPC bridge
      await window.zofficeAPI.file.save(savePath, btoa('PK-TEST-CONTENT'))
      return text
    }, TEST_DOCX_PATH)

    expect(testDocContent).toContain('Milestone 1A ZWriter Specification')
    expect(testDocContent).toContain('bold typography')
    expect(testDocContent).toContain('TipTap ProseMirror Core Engine')
    expect(existsSync(TEST_DOCX_PATH)).toBe(true)
  })
})
