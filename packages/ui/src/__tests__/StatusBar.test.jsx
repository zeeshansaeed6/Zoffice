import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatusBar } from '../status-bar/StatusBar.jsx'
import { StatusBarSlot } from '../status-bar/StatusBarSlot.jsx'

describe('StatusBar component', () => {
  it('renders left slots and status message', () => {
    render(
      <StatusBar leftContent={<StatusBarSlot>Page 1 of 5</StatusBarSlot>} centerContent="Ready" />,
    )

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
  })

  it('triggers onZoomChange when zoom controls are used', () => {
    const onZoomChange = vi.fn()
    render(<StatusBar zoom={100} onZoomChange={onZoomChange} />)

    const zoomOut = screen.getByLabelText('Zoom out')
    fireEvent.click(zoomOut)
    expect(onZoomChange).toHaveBeenCalledWith(90)

    const zoomIn = screen.getByLabelText('Zoom in')
    fireEvent.click(zoomIn)
    expect(onZoomChange).toHaveBeenCalledWith(110)

    const resetBtn = screen.getByLabelText('Reset zoom to 100%')
    fireEvent.click(resetBtn)
    expect(onZoomChange).toHaveBeenCalledWith(100)
  })
})
