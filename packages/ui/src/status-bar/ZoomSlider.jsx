import React from 'react'
import { Minus, Plus } from 'lucide-react'

/**
 * Zoom control slider (- 100% +) matching desktop office conventions.
 *
 * @param {Object} props
 * @param {number} props.zoom - Current zoom level percentage (e.g. 100)
 * @param {(zoom: number) => void} props.onZoomChange
 * @param {number} [props.min=10]
 * @param {number} [props.max=400]
 * @param {number} [props.step=10]
 */
export function ZoomSlider({ zoom = 100, onZoomChange, min = 10, max = 400, step = 10 }) {
  const clamp = (val) => Math.min(max, Math.max(min, val))

  const handleMinus = () => {
    onZoomChange(clamp(zoom - step))
  }

  const handlePlus = () => {
    onZoomChange(clamp(zoom + step))
  }

  return (
    <div
      data-testid="zoom-slider"
      className="flex select-none items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400"
    >
      <button
        type="button"
        aria-label="Zoom out"
        onClick={handleMinus}
        className="rounded p-0.5 hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
      >
        <Minus size={12} />
      </button>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={zoom}
        aria-label="Zoom slider"
        onChange={(e) => onZoomChange(Number(e.target.value))}
        className="h-1 w-20 cursor-pointer accent-blue-600 dark:accent-blue-400"
      />

      <button
        type="button"
        aria-label="Zoom in"
        onClick={handlePlus}
        className="rounded p-0.5 hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
      >
        <Plus size={12} />
      </button>

      <button
        type="button"
        aria-label="Reset zoom to 100%"
        onClick={() => onZoomChange(100)}
        className="min-w-[40px] text-right font-mono text-[11px] hover:underline"
      >
        {Math.round(zoom)}%
      </button>
    </div>
  )
}
