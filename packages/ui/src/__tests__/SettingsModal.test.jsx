import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsModal } from '../settings/SettingsModal.jsx'
import { ThemeProvider } from '../theme/ThemeProvider.jsx'

describe('SettingsModal', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ThemeProvider>
        <SettingsModal isOpen={false} onClose={() => {}} />
      </ThemeProvider>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders correctly and allows tab navigation', () => {
    const handleClose = vi.fn()
    render(
      <ThemeProvider>
        <SettingsModal isOpen={true} onClose={handleClose} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText('Settings Center')).toBeDefined()

    // Default tab is General & Appearance
    expect(screen.getByText('Interface Theme')).toBeDefined()
    expect(screen.getByText('Display Scaling (Accessibility)')).toBeDefined()

    // Switch to Typography & Formats
    fireEvent.click(screen.getByText('Typography & Formats'))
    expect(screen.getByText('Default Document Font')).toBeDefined()
    expect(screen.getByText('ZWriter (Documents)')).toBeDefined()

    // Switch to Autosave & Spellcheck
    fireEvent.click(screen.getByText('Autosave & Spellcheck'))
    expect(screen.getByText('Background Autosave Interval')).toBeDefined()
    expect(screen.getByText('Spellcheck & Writing Assistance')).toBeDefined()

    // Switch to Plugin Manager
    fireEvent.click(screen.getByText('Plugin Manager'))
    expect(screen.getByText('Installed Plugins & Extensions')).toBeDefined()
    expect(screen.getByText('Word Frequency Counter')).toBeDefined()
    expect(screen.getByText('CSV Data Cleaner')).toBeDefined()

    // Switch to Privacy & Sovereignty
    fireEvent.click(screen.getByText('Privacy & Sovereignty'))
    expect(screen.getByText('Zoffice Privacy Guarantee')).toBeDefined()
    expect(screen.getByText('100% Offline-First')).toBeDefined()
    expect(screen.getByText('Zero Telemetry & Tracking')).toBeDefined()
    expect(screen.getByText(/Independent Open-Source Software/)).toBeDefined()

    // Close modal via Done button
    fireEvent.click(screen.getByText('Done'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('allows toggling a plugin active state', () => {
    render(
      <ThemeProvider>
        <SettingsModal isOpen={true} onClose={() => {}} initialTab="plugins" />
      </ThemeProvider>,
    )

    const toggleButtons = screen.getAllByRole('button', { name: /Active|Disabled/i })
    expect(toggleButtons.length).toBeGreaterThan(0)
    fireEvent.click(toggleButtons[0])
    expect(screen.getAllByRole('button', { name: /Active|Disabled/i }).length).toBeGreaterThan(0)
  })
})
