import React from 'react'
import { Tooltip } from '../common/Tooltip.jsx'

/**
 * Toggle button inside ribbon (e.g. Bold, Italic, Underline).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon
 * @param {string} props.label
 * @param {boolean} props.pressed
 * @param {(pressed: boolean) => void} props.onToggle
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.tooltip]
 */
export function RibbonToggle({ icon, label, pressed, onToggle, disabled = false, tooltip }) {
  const baseStyle =
    'inline-flex h-6 w-6 items-center justify-center rounded border border-transparent transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs'

  const stateStyle = disabled
    ? 'opacity-40 cursor-not-allowed text-neutral-400'
    : pressed
      ? 'bg-blue-100 border-blue-300 text-blue-900 font-semibold dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200'
      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'

  const button = (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onToggle(!pressed)}
      className={`${baseStyle} ${stateStyle}`}
    >
      {icon}
    </button>
  )

  if (tooltip || label) {
    return <Tooltip content={tooltip || label}>{button}</Tooltip>
  }

  return button
}
