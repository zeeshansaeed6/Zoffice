import React, { useState, useRef, useEffect } from 'react'

const STANDARD_COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#efefef',
  '#f3f3f3',
  '#ffffff',
  '#980000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
]

/**
 * Compact Office-style color picker dropdown.
 *
 * @param {Object} props
 * @param {string} props.color - Current hex color
 * @param {(color: string) => void} props.onChange
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.label]
 */
export function ColorPicker({ color, onChange, icon, label = 'Color' }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(/** @type {HTMLDivElement | null} */ (null))

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen(!open)}
        className="inline-flex flex-col items-center justify-center rounded p-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <span className="text-sm">{icon}</span>
        <span
          className="h-1 w-4 rounded-sm border border-neutral-300 dark:border-neutral-600"
          style={{ backgroundColor: color || '#000000' }}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            Colors
          </div>
          <div className="grid grid-cols-10 gap-1">
            {STANDARD_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={hex}
                onClick={() => {
                  onChange(hex)
                  setOpen(false)
                }}
                className="h-3.5 w-3.5 rounded-sm border border-neutral-300 transition-transform hover:scale-125 dark:border-neutral-600"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              onChange('transparent')
              setOpen(false)
            }}
            className="mt-2 w-full rounded border border-neutral-200 py-0.5 text-center text-[10px] text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            No Color
          </button>
        </div>
      )}
    </div>
  )
}
