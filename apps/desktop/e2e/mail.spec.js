import { test, expect, _electron as electron } from '@playwright/test'
import { resolve } from 'path'

test.describe('ZMail & ZCalendar E2E Tests', () => {
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

  test('opens ZMail from start screen and navigates mail, calendar, and contacts', async () => {
    const mailTile = page.getByRole('button', { name: /ZMail/i })
    await expect(mailTile).toBeVisible()
    await mailTile.click()

    // Tab opens
    await expect(page.getByRole('tab', { name: /Mailbox/i })).toBeVisible()

    // ZMail composite app mounts
    const mailApp = page.locator('[data-testid="zmail-app"]')
    await expect(mailApp).toBeVisible()

    // Ribbon tabs are available
    await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible()

    // 3-Pane Mail layout elements
    await expect(page.getByText('Folders')).toBeVisible()
    await expect(page.getByText('Inbox')).toBeVisible()
    await expect(page.getByText('Welcome to ZMail & ZCalendar!')).toBeVisible()

    // Switch to Calendar via side switcher
    const calSwitcher = page.locator('[data-testid="switcher-calendar"]')
    await expect(calSwitcher).toBeVisible()
    await calSwitcher.click()

    // Calendar view mounts
    await expect(page.getByText('Today')).toBeVisible()

    // Switch to Contacts via side switcher
    const contactsSwitcher = page.locator('[data-testid="switcher-contacts"]')
    await expect(contactsSwitcher).toBeVisible()
    await contactsSwitcher.click()

    // Contacts view mounts
    await expect(page.getByText('Address Book')).toBeVisible()
  })
})
