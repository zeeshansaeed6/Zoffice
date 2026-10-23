import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Ribbon } from '../ribbon/Ribbon.jsx'
import { ThemeProvider } from '../theme/ThemeProvider.jsx'

describe('Ribbon component', () => {
  const sampleConfig = {
    tabs: [
      {
        id: 'home',
        label: 'Home',
        groups: [
          {
            id: 'clipboard',
            label: 'Clipboard',
            controls: [
              {
                id: 'paste',
                type: 'button',
                label: 'Paste',
                onClick: vi.fn(),
              },
            ],
          },
        ],
      },
      {
        id: 'insert',
        label: 'Insert',
        groups: [
          {
            id: 'tables',
            label: 'Tables',
            controls: [
              {
                id: 'table',
                type: 'button',
                label: 'Table',
              },
            ],
          },
        ],
      },
    ],
  }

  it('renders all tabs and active tab group content', () => {
    render(
      <ThemeProvider>
        <Ribbon config={sampleConfig} />
      </ThemeProvider>,
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Insert')).toBeInTheDocument()
    expect(screen.getByText('Clipboard')).toBeInTheDocument()
    expect(screen.getByText('Paste')).toBeInTheDocument()
  })

  it('switches tabs on click', () => {
    const onTabChange = vi.fn()
    render(
      <ThemeProvider>
        <Ribbon config={sampleConfig} onTabChange={onTabChange} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByText('Insert'))
    expect(onTabChange).toHaveBeenCalledWith('insert')
  })

  it('collapses and expands ribbon on collapse button click', () => {
    render(
      <ThemeProvider>
        <Ribbon config={sampleConfig} />
      </ThemeProvider>,
    )

    expect(screen.getByText('Paste')).toBeInTheDocument()

    const collapseBtn = screen.getByLabelText('Collapse Ribbon')
    fireEvent.click(collapseBtn)

    expect(screen.queryByText('Paste')).not.toBeInTheDocument()

    const expandBtn = screen.getByLabelText('Expand Ribbon')
    fireEvent.click(expandBtn)

    expect(screen.getByText('Paste')).toBeInTheDocument()
  })
})
