import React, { useState } from 'react'

/**
 * Lightweight accessible tooltip.
 *
 * @param {Object} props
 * @param {string} props.content - Text displayed in tooltip
 * @param {React.ReactNode} props.children - Anchor element
 * @param {'top' | 'bottom'} [props.position='bottom']
 */
export function Tooltip({ content, children, position = 'bottom' }) {
  const [visible, setVisible] = useState(false)

  if (!content) return <>{children}</>

  const posClass =
    position === 'top'
      ? 'bottom-full mb-1.5 left-1/2 -translate-x-1/2'
      : 'top-full mt-1.5 left-1/2 -translate-x-1/2'

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white shadow-md transition-opacity dark:bg-neutral-100 dark:text-neutral-900 ${posClass}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
