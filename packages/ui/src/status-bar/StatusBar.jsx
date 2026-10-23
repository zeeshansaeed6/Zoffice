import React from 'react'
import { ZoomSlider } from './ZoomSlider.jsx'

/**
 * Desktop Office-style bottom status bar.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.leftContent] - Page/word counters, spellcheck
 * @param {React.ReactNode} [props.centerContent] - Status messages (e.g. "Saved")
 * @param {React.ReactNode} [props.viewButtons] - Document view modes
 * @param {number} [props.zoom] - Zoom percentage
 * @param {(zoom: number) => void} [props.onZoomChange]
 * @param {string} [props.className]
 */
export function StatusBar({
  leftContent,
  centerContent,
  viewButtons,
  zoom = 100,
  onZoomChange,
  className = '',
}) {
  return (
    <footer
      data-testid="status-bar"
      className={`flex h-6 w-full select-none items-center justify-between border-t border-neutral-200 bg-neutral-100 px-3 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 ${className}`}
    >
      <div className="flex items-center gap-2 overflow-hidden">{leftContent}</div>

      <div className="flex items-center truncate text-[11px] text-neutral-500">{centerContent}</div>

      <div className="flex items-center gap-3">
        {viewButtons && <div className="flex items-center gap-1">{viewButtons}</div>}
        {onZoomChange && <ZoomSlider zoom={zoom} onZoomChange={onZoomChange} />}
      </div>
    </footer>
  )
}
