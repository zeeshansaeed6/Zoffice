import React from 'react'
import { Tooltip } from '../common/Tooltip.jsx'

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon
 * @param {string} props.label
 * @param {'large' | 'small'} [props.size='large']
 * @param {() => void} [props.onClick]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.active=false]
 * @param {string} [props.tooltip]
 * @param {string} [props.className]
 */
export function RibbonButton({
  icon,
  label,
  size = 'large',
  onClick,
  disabled = false,
  active = false,
  tooltip,
  className = '',
}) {
  const isLarge = size === 'large'

  const baseStyle =
    'relative inline-flex items-center justify-center rounded border border-transparent transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500'

  const sizeStyle = isLarge
    ? 'flex-col h-[58px] min-w-[48px] px-2 py-1 text-xs gap-1'
    : 'flex-row h-[24px] px-1.5 py-0.5 text-xs gap-1.5'

  const stateStyle = disabled
    ? 'opacity-40 cursor-not-allowed text-neutral-400'
    : active
      ? 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-200'
      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'

  const button = (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${sizeStyle} ${stateStyle} ${className}`}
    >
      <span className={isLarge ? 'text-lg' : 'text-sm'}>{icon}</span>
      <span className="truncate leading-tight">{label}</span>
    </button>
  )

  if (tooltip || (!isLarge && label)) {
    return <Tooltip content={tooltip || label}>{button}</Tooltip>
  }

  return button
}
