import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('ZForms E2E Tests', () => {
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

  test('opens ZForms from start screen, builds form, previews submission, and views responses', async () => {
    const formsTile = page.getByRole('button', { name: /ZForms/i })
    await expect(formsTile).toBeVisible()
    await formsTile.click()

    // Tab opens
    await expect(page.getByRole('tab', { name: /Form/i })).toBeVisible()

    // ZForms composite app mounts
    const formsApp = page.locator('[data-testid="zforms-app"]')
    await expect(formsApp).toBeVisible()

    // Initial questions are rendered in builder
    await expect(page.getByPlaceholder('Form Title')).toBeVisible()
    await expect(page.getByDisplayValue('Full Name')).toBeVisible()
    await expect(page.getByDisplayValue('Email Address')).toBeVisible()

    // Switch to Preview
    const previewBtn = page.locator('[data-testid="btn-preview"]')
    await expect(previewBtn).toBeVisible()
    await previewBtn.click()

    // Fill in response
    const inputs = page.getByPlaceholder('Your answer')
    await inputs.first().fill('Sam Respondent')
    await inputs.nth(1).fill('sam@zoffice.local')

    // Submit response
    const submitBtn = page.getByRole('button', { name: 'Submit' })
    await expect(submitBtn).toBeVisible()
    await submitBtn.click()

    // Completion screen
    await expect(page.getByText('Response Submitted!')).toBeVisible()

    // Return to Builder
    await previewBtn.click()

    // Navigate to Responses tab
    const responsesTab = page.locator('[data-testid="tab-responses"]')
    await expect(responsesTab).toBeVisible()
    await responsesTab.click()

    // Responses counter reflects submission
    await expect(page.getByText('1 Response')).toBeVisible()
    await expect(page.getByText('Sam Respondent')).toBeVisible()
  })
})
