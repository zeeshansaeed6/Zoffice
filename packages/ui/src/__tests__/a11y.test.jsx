import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { ThemeProvider, useTheme } from '../theme/ThemeProvider.jsx'
import { Dialog } from '../dialogs/Dialog.jsx'
import { Ribbon } from '../ribbon/Ribbon.jsx'
import { StatusBar } from '../status-bar/StatusBar.jsx'
import { StatusBarSlot } from '../status-bar/StatusBarSlot.jsx'

function ThemeTestConsumer() {
  const { theme, resolvedTheme, setTheme, uiScale, setUiScale } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <span data-testid="scale">{uiScale}</span>
      <button type="button" onClick={() => setTheme('high-contrast')}>
        High Contrast
      </button>
      <button type="button" onClick={() => setUiScale(1.5)}>
        Scale 150%
      </button>
      <button type="button" onClick={() => setUiScale(2.5)}>
        Scale Max Clamp
      </button>
    </div>
  )
}

describe('Accessibility & Theming (a11y)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.style.fontSize = ''
  })

  it('supports high-contrast theme and syncs high-contrast class on root', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeTestConsumer />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false)

    fireEvent.click(screen.getByText('High Contrast'))
    expect(screen.getByTestId('theme').textContent).toBe('high-contrast')
    expect(screen.getByTestId('resolved').textContent).toBe('high-contrast')
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('supports scalable UI from 100% to 200% with clamping', () => {
    render(
      <ThemeProvider defaultTheme="light" defaultScale={1.0}>
        <ThemeTestConsumer />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('scale').textContent).toBe('1')

    fireEvent.click(screen.getByText('Scale 150%'))
    expect(screen.getByTestId('scale').textContent).toBe('1.5')
    expect(document.documentElement.style.fontSize).toBe('150%')

    // Clamps to 2.0 max
    fireEvent.click(screen.getByText('Scale Max Clamp'))
    expect(screen.getByTestId('scale').textContent).toBe('2')
    expect(document.documentElement.style.fontSize).toBe('200%')
  })

  it('renders accessible Dialog with escape key and backdrop dismiss', () => {
    let closed = false
    const { container, rerender } = render(
      <Dialog isOpen={true} onClose={() => (closed = true)} title="Accessibility Modal">
        <p>Accessible modal contents</p>
      </Dialog>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeDefined()
    expect(dialog.getAttribute('aria-modal')).toBe('true')

    // Escape key closes modal
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(closed).toBe(true)

    // Backdrop click dismisses
    closed = false
    fireEvent.click(dialog)
    expect(closed).toBe(true)

    rerender(
      <Dialog isOpen={false} onClose={() => {}} title="Accessibility Modal">
        <p>Hidden</p>
      </Dialog>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders accessible Ribbon with tablist, tabs, and tabpanel', () => {
    const config = {
      appId: 'writer',
      fileMenuLabel: 'File',
      tabs: [
        {
          id: 'home',
          label: 'Home',
          groups: [{ id: 'g1', label: 'Clipboard', controls: [] }],
        },
        {
          id: 'insert',
          label: 'Insert',
          groups: [{ id: 'g2', label: 'Tables', controls: [] }],
        },
      ],
    }

    render(
      <ThemeProvider defaultTheme="light">
        <Ribbon config={config} />
      </ThemeProvider>,
    )

    const tablist = screen.getByRole('tablist', { name: 'Ribbon Tabs' })
    expect(tablist).toBeDefined()

    const homeTab = screen.getByRole('tab', { name: 'Home' })
    const insertTab = screen.getByRole('tab', { name: 'Insert' })

    expect(homeTab.getAttribute('aria-selected')).toBe('true')
    expect(homeTab.tabIndex).toBe(0)
    expect(insertTab.getAttribute('aria-selected')).toBe('false')
    expect(insertTab.tabIndex).toBe(-1)

    const panel = screen.getByRole('tabpanel')
    expect(panel).toBeDefined()
    expect(panel.getAttribute('aria-labelledby')).toBe('ribbon-tab-home')
  })

  it('passes axe-core accessibility checks on UI components', async () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <div>
          <StatusBar
            leftContent={<StatusBarSlot>Ready</StatusBarSlot>}
            centerContent="Saved"
            zoom={100}
          />
          <Dialog isOpen={true} onClose={() => {}} title="Axe Check">
            <p>Dialog body text</p>
          </Dialog>
        </div>
      </ThemeProvider>,
    )

    const results = await axe.run(container, {
      rules: {
        // In virtual DOM test containers, color contrast can't compute real CSS layout
        'color-contrast': { enabled: false },
      },
    })

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    )
    expect(criticalViolations.length).toBe(0)
  })
})
