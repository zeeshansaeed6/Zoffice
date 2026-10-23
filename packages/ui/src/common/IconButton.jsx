import React from 'react'
import { Tooltip } from './Tooltip.jsx'

/**
 * Universal icon button with optional tooltip.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Lucide or custom icon node
 * @param {string} [props.label] - Accessible label and tooltip text
 * @param {() => void} [props.onClick]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.active=false]
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {string} [props.className]
 */
export function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-1.5 text-sm',
    lg: 'p-2 text-base',
  }

  const baseClasses =
    'inline-flex items-center justify-center rounded transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500'

  const stateClasses = disabled
    ? 'opacity-40 cursor-not-allowed text-neutral-400'
    : active
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'

  const button = (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${stateClasses} ${className}`}
    >
      {icon}
    </button>
  )

  if (label) {
    return <Tooltip content={label}>{button}</Tooltip>
  }

  return button
}
